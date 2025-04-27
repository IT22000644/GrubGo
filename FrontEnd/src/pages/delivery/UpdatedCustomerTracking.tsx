import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import { io, Socket } from "socket.io-client";
import DeliveryMap, {
  DeliveryRoute,
} from "../../components/delivery/DeliveryMap";
import StatusPanel from "../../components/delivery/StatusPanel";
import { fetchRoadPath } from "../../utils/delivery/mapHelpers";
import StatusTracker from "../../components/delivery/StatusTracker";
import DriverInfoCard from "../../components/delivery/DriverInfoCard";
import PickupDropInfo from "../../components/delivery/PickupDropInfo";

interface TrackingState {
  mode: "track";
  orderId: string;
}

interface DeliveryStatusResponse {
  orderId: string;
  driverId: string;
  status: string;
  driverAddress: string;
  restaurantAddress: string;
  customerAddress: string;
  driverLocation: { latitude: number; longitude: number };
  restaurantLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
  nextDestination: string;
  expectedDeliveryTime: string;
  etaToNext: number;
  estimatedTimeToRestaurant: number;
  estimatedTimeToCustomer: number;
}

interface DriverInfo {
  fullName: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
}

export default function CustomerTracking() {
  const loc = useLocation();
  const state = loc.state as TrackingState;
  const { orderId } = state;

  const deliveryIdRef = useRef<string>("");
  const orderIdRef = useRef<string>(orderId);
  const driverIdRef = useRef<string>("");

  const [route, setRoute] = useState<DeliveryRoute>();
  const [status, setStatus] = useState("Loading");
  const [driverInfo, setDriverInfo] = useState<DriverInfo>();
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

  const interpolate = (
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral => ({
    lat: start.lat + (end.lat - start.lat) * t,
    lng: start.lng + (end.lng - start.lng) * t,
  });

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

  const fetchDriverInfo = async (driverId: string) => {
    try {
      const res = await api.get<DriverInfo>(`user/${driverId}`);
      setDriverInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch driver info:", err);
    }
  };

  const fetchStatusAndResume = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 5000) return;
    lastFetchTimeRef.current = now;

    try {
      const res = await api.get<DeliveryStatusResponse>(
        `delivery/status/${deliveryIdRef.current}`
      );
      const data = res.data;

      if (data.status !== lastFetchedStatusRef.current) {
        lastFetchedStatusRef.current = data.status;
      } else {
        return;
      }

      if (!driverIdRef.current) {
        driverIdRef.current = data.driverId;
        await fetchDriverInfo(driverIdRef.current);

        if (socketRef.current && !subscribedRef.current) {
          const evt = `delivery:${orderIdRef.current}`;
          socketRef.current.on(evt, async (_data: { status: string }) => {
            console.log("Received status update from server:", _data.status);
            lastFetchedStatusRef.current = null;
            await fetchStatusAndResume();
          });
          subscribedRef.current = true;
        }
      }

      const deliveryRoute: DeliveryRoute = {
        driverLocation: data.driverLocation,
        restaurantLocation: data.restaurantLocation,
        customerLocation: data.customerLocation,
        vehicleType: driverInfo?.vehicleType || "Car",
        vehicleColor: driverInfo?.vehicleColor || "Blue",
        vehicleNumber: driverInfo?.vehicleNumber || "UNKNOWN",
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
      } else if (
        data.status === "Arrived Restaurant" ||
        data.status === "Arrived Customer"
      ) {
        animationCancelledRef.current = true;
        setRoute((r) =>
          r
            ? {
                ...r,
                driverLocation: {
                  latitude:
                    data.status === "Arrived Restaurant"
                      ? data.restaurantLocation.latitude
                      : data.customerLocation.latitude,
                  longitude:
                    data.status === "Arrived Restaurant"
                      ? data.restaurantLocation.longitude
                      : data.customerLocation.longitude,
                },
              }
            : r
        );
      }
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  }, [driverInfo]);

  const fetchInitialData = async () => {
    try {
      const res = await api.get(`order/${orderIdRef.current}`);
      const delivery = res.data.deliveries[0];
      if (delivery) {
        deliveryIdRef.current = delivery._id;
        driverIdRef.current = delivery.driverId;
        await fetchDriverInfo(driverIdRef.current);
        await fetchStatusAndResume();
      }
    } catch (err) {
      console.error("Failed to fetch delivery by orderId:", err);
    }
  };

  useEffect(() => {
    if (!connectedRef.current) {
      socketRef.current = io("http://localhost:4006");
      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id);
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

    fetchInitialData();
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
          <DriverInfoCard
            name={driverInfo?.fullName || "Driver"}
            imageUrl="https://images.pexels.com/photos/28955594/pexels-photo-28955594/free-photo-of-chimpanzee-at-zoo-in-natural-habitat.jpeg?auto=compress&cs=tinysrgb&w=600"
            vehicleType={driverInfo?.vehicleType || "Car"}
            vehicleColor={driverInfo?.vehicleColor || "Blue"}
            vehicleNumber={driverInfo?.vehicleNumber || "UNKNOWN"}
          />

          <PickupDropInfo
            restaurantAddress={
              route?.restaurantLocation ? "Restaurant Location" : ""
            }
            customerAddress={route?.customerLocation ? "Customer Location" : ""}
          />

          {route && (
            <StatusPanel
              status={status}
              etaToRestaurant={etaToRestaurant}
              etaToCustomer={etaToCustomer}
              expectedDeliveryTime={expectedDeliveryTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}
