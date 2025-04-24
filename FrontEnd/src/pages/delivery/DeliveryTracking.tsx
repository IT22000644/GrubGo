import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import DeliveryMap, {
  DeliveryRoute,
} from "../../components/delivery/DeliveryMap";
import StatusPanel from "../../components/delivery/StatusPanel";
import ControlsPanel from "../../components/delivery/ControlsPanel";
import { fetchRoadPath } from "../../utils/delivery/mapHelpers";
import NextLocationCard from "../../components/delivery/NextLocationCard";
import StatusTracker from "../../components/delivery/StatusTracker";
import api5005 from "../../api/api5005";

interface TrackingState {
  mode: "track";
  deliveryId: string;
}

interface DeliveryStatusResponse {
  orderId: string;
  driverId: string;
  status: string;
  driverLocation: { latitude: number; longitude: number };
  restaurantLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
  nextDestination: string;
  expectedDeliveryTime: string;
  etaToNext: number;
  estimatedTimeToRestaurant: number;
  estimatedTimeToCustomer: number;
}

export default function DeliveryTracking() {
  const loc = useLocation();
  const state = loc.state as TrackingState;

  const deliveryIdRef = useRef<string>(state.deliveryId);
  const orderIdRef = useRef<string>("");
  const [route, setRoute] = useState<DeliveryRoute>();
  const [status, setStatus] = useState("Loading");
  const socketRef = useRef<Socket | null>(null);
  const [etaToRestaurant, setEtaToRestaurant] = useState(0);
  const [etaToCustomer, setEtaToCustomer] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [pathCoords, setPathCoords] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapPathStage, setMapPathStage] = useState<
    "toRestaurant" | "toCustomer"
  >("toRestaurant");
  const animationCancelledRef = useRef(false);
  const connectedRef = useRef(false);
  const subscribedRef = useRef(false);
  const lastFetchedStatusRef = useRef<string | null>(null);
  const lastFetchTimeRef = useRef<number>(0);

  function interpolate(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral {
    return {
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    };
  }

  const animateAlong = async (
    path: google.maps.LatLngLiteral[],
    totalMs: number,
    onFinish?: () => void
  ): Promise<void> => {
    const updatesPerSegment = 10;
    const segmentDuration = totalMs / ((path.length - 1) * updatesPerSegment);
    animationCancelledRef.current = false;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];

      for (let step = 0; step <= updatesPerSegment; step++) {
        if (animationCancelledRef.current) return;
        const t = step / updatesPerSegment;
        const interpolated = interpolate(from, to, t);

        setRoute((r) =>
          r
            ? {
                ...r,
                driverLocation: {
                  latitude: interpolated.lat,
                  longitude: interpolated.lng,
                },
              }
            : r
        );

        setPathCoords(path.slice(i + 1));
        await new Promise((res) => setTimeout(res, segmentDuration));
      }
    }

    onFinish?.();
  };

  const fetchStatusAndResume = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 5000) return;
    lastFetchTimeRef.current = now;

    try {
      const res = await api5005.get<DeliveryStatusResponse>(
        `deliveries/status/${deliveryIdRef.current}`
      );
      const data = res.data;

      if (data.status === lastFetchedStatusRef.current) return;
      lastFetchedStatusRef.current = data.status;

      orderIdRef.current = data.orderId;

      const deliveryRoute: DeliveryRoute = {
        driverLocation: data.driverLocation,
        restaurantLocation: data.restaurantLocation,
        customerLocation: data.customerLocation,
        vehicleType: "car",
        vehicleColor: "blue",
        vehicleNumber: "XT-9988",
      };

      setRoute(deliveryRoute);
      setStatus(data.status);
      setExpectedDeliveryTime(data.expectedDeliveryTime);
      setEtaToRestaurant(data.estimatedTimeToRestaurant);
      setEtaToCustomer(data.estimatedTimeToCustomer);

      if (data.status === "In Transit") {
        const path = await fetchRoadPath(
          {
            lat: data.driverLocation.latitude,
            lng: data.driverLocation.longitude,
          },
          {
            lat: data.restaurantLocation.latitude,
            lng: data.restaurantLocation.longitude,
          }
        );
        await animateAlong(path, data.estimatedTimeToRestaurant * 1000);
      } else if (data.status === "In Transit - Picked Up") {
        setMapPathStage("toCustomer");
        const path = await fetchRoadPath(
          {
            lat: data.driverLocation.latitude,
            lng: data.driverLocation.longitude,
          },
          {
            lat: data.customerLocation.latitude,
            lng: data.customerLocation.longitude,
          }
        );
        await animateAlong(
          path,
          Math.max(data.estimatedTimeToCustomer * 1000 - 5000, 1000)
        );
      } else if (data.status === "Arrived Restaurant") {
        animationCancelledRef.current = true;
        setRoute((r) =>
          r
            ? {
                ...r,
                driverLocation: {
                  latitude: data.restaurantLocation.latitude,
                  longitude: data.restaurantLocation.longitude,
                },
              }
            : r
        );
      } else if (data.status === "Arrived Customer") {
        animationCancelledRef.current = true;
        setRoute((r) =>
          r
            ? {
                ...r,
                driverLocation: {
                  latitude: data.customerLocation.latitude,
                  longitude: data.customerLocation.longitude,
                },
              }
            : r
        );
      }
    } catch (err) {
      console.error("Failed to resume tracking:", err);
    }
  }, []);

  useEffect(() => {
    if (!connectedRef.current) {
      socketRef.current = io("http://localhost:5005");
      socketRef.current.on("connect", () => {
        connectedRef.current = true;
      });

      return () => {
        socketRef.current?.off();
        socketRef.current?.disconnect();
        connectedRef.current = false;
        subscribedRef.current = false;
      };
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current || subscribedRef.current) return;

    fetchStatusAndResume().then(() => {
      const evt = `delivery:${orderIdRef.current}`;
      socketRef.current!.on(evt, async (_data: { status: string }) => {
        await fetchStatusAndResume();
      });
      subscribedRef.current = true;
    });
  }, [fetchStatusAndResume]);

  const restaurantStatuses = ["Assigned", "In Transit", "Arrived Restaurant"];
  const customerStatuses = [
    "Picked Up",
    "In Transit - Picked Up",
    "Arrived Customer",
  ];

  const handlePickedUp = useCallback(async () => {
    try {
      await api5005.put("deliveries/status/picked-up", {
        deliveryId: deliveryIdRef.current,
      });
      lastFetchedStatusRef.current = null;
      setStatus("Picked Up");
    } catch (error) {
      console.error("Error marking picked up:", error);
    }
  }, []);

  const handleDelivered = useCallback(async () => {
    try {
      await api5005.put("deliveries/status/delivered", {
        deliveryId: deliveryIdRef.current,
      });
      lastFetchedStatusRef.current = null;
      setStatus("Delivered");

      // await api5011.put(`status/delivered/${id}`, {

      // });
    } catch (error) {
      console.error("Error marking delivered:", error);
    }
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Tracking Delivery</h1>
      <StatusTracker currentStatus={status} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 h-96 border-4 border-blue-800 border-double">
          <DeliveryMap
            route={route}
            pathStage={mapPathStage}
            dynamicPath={pathCoords}
          />
        </div>
        <div className="space-y-4">
          {route && (
            <StatusPanel
              status={status}
              etaToRestaurant={etaToRestaurant}
              etaToCustomer={etaToCustomer}
              expectedDeliveryTime={expectedDeliveryTime}
            />
          )}

          {restaurantStatuses.includes(status) && (
            <NextLocationCard
              imageUrl="https://images.pexels.com/photos/1458681/pexels-photo-1458681.jpeg?auto=compress&cs=tinysrgb&w=600"
              fullName="Spar Supermarket"
              address="Random Address Place Holder - Restaurant"
              role="Restaurant"
            />
          )}

          {customerStatuses.includes(status) && (
            <NextLocationCard
              imageUrl="https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              fullName="John Doe"
              address="Random Address Place Holder - Customer"
              role="Customer"
            />
          )}

          {route && (
            <ControlsPanel
              status={status}
              onPickedUp={handlePickedUp}
              onDelivered={handleDelivered}
            />
          )}
        </div>
      </div>
    </div>
  );
}
