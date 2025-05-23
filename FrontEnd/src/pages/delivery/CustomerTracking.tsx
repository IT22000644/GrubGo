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
  orderId: string;
  deliveryId: string;
  driverId: string;
  status: string;
  driverAddress: string;
  restaurantAddress: string;
  customerAddress: string;
  driverLocation: { latitude: number; longitude: number };
  restaurantLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
  nextDestination: string;
  nextLocation: { latitude: number; longitude: number };
  distanceToNext: number;
  etaToNext: number;
  expectedDeliveryTime: string;
  estimatedTimeToRestaurant: number;
  estimatedTimeToCustomer: number;
  driverName: string;
  driverImage: string;
  vehicleType: string;
  vehicleColor: string;
  vehicleModel: string;
  vehicleNumber: string;
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

export default function CustomerTracking() {
  const loc = useLocation();
  const state = loc.state as TrackingState;

  const {
    orderId,
    deliveryId,
    driverName,
    driverImage,
    vehicleType,
    vehicleColor,
    vehicleModel,
    vehicleNumber,
    restaurantAddress,
    customerAddress,
    driverLocation,
    restaurantLocation,
    customerLocation,
    status: initialStatus,
    expectedDeliveryTime,
    estimatedTimeToRestaurant,
    estimatedTimeToCustomer,
  } = state;

  const deliveryIdRef = useRef<string>(deliveryId);
  const orderIdRef = useRef<string>(orderId);

  const [route, setRoute] = useState<DeliveryRoute>({
    driverLocation,
    restaurantLocation,
    customerLocation,
    vehicleType,
    vehicleColor,
    vehicleNumber,
    vehicleModel,
  });
  const [status, setStatus] = useState(initialStatus);
  const [etaToRestaurant, setEtaToRestaurant] = useState(
    estimatedTimeToRestaurant
  );
  const [etaToCustomer, setEtaToCustomer] = useState(estimatedTimeToCustomer);
  const [pathCoords, setPathCoords] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapPathStage, setMapPathStage] = useState<
    "toRestaurant" | "toCustomer"
  >("toRestaurant");
  const [currentExpectedDeliveryTime, setCurrentExpectedDeliveryTime] =
    useState(expectedDeliveryTime);

  const socketRef = useRef<Socket | null>(null);
  const animationCancelledRef = useRef(false);
  const connectedRef = useRef(false);
  const subscribedRef = useRef(false);
  const lastFetchedStatusRef = useRef<string | null>(initialStatus);
  const lastFetchTimeRef = useRef<number>(0);

  const interpolate = (
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral => {
    return {
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    };
  };

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
      const res = await api.get<DeliveryStatusResponse>(
        `delivery/status/${deliveryIdRef.current}`
      );
      const data = res.data;

      if (data.status !== lastFetchedStatusRef.current) {
        lastFetchedStatusRef.current = data.status;
      } else {
        return;
      }

      setStatus(data.status);
      setCurrentExpectedDeliveryTime(data.expectedDeliveryTime);
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

    const evt = `delivery:${orderIdRef.current}`;
    socketRef.current.on(evt, async (_data: { status: string }) => {
      console.log("Received status update from server:", _data.status);
      lastFetchedStatusRef.current = null;
      await fetchStatusAndResume();
    });
    subscribedRef.current = true;

    fetchStatusAndResume();
  }, [fetchStatusAndResume]);

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
            name={driverName}
            imageUrl={driverImage}
            vehicleType={vehicleType}
            vehicleColor={vehicleColor}
            vehicleModel={vehicleModel}
            vehicleNumber={vehicleNumber}
          />

          <PickupDropInfo
            restaurantAddress={restaurantAddress}
            customerAddress={customerAddress}
          />

          {route && (
            <StatusPanel
              status={status}
              etaToRestaurant={etaToRestaurant}
              etaToCustomer={etaToCustomer}
              expectedDeliveryTime={currentExpectedDeliveryTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}
