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
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { updateRiderStatus } from "../../features/auth/authSlice";

import api from "../../api/api";

interface TrackingState {
  deliveryId: string;
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
  nextLocation: { latitude: number; longitude: number };
  distanceToNext: number;
  etaToNext: number;
  expectedDeliveryTime: string;
  estimatedTimeToRestaurant: number;
  estimatedTimeToCustomer: number;
  driverName: string;
  driverImage: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleNumber: string;
  customerName: string;
  customerImage: string;
  restaurantName: string;
  restaurantImage: string;
}

export default function DeliveryTracking() {
  const loc = useLocation();
  const state = loc.state as TrackingState;

  const deliveryIdRef = useRef<string>(state.deliveryId);
  const orderIdRef = useRef<string>(state.orderId);
  const [route, setRoute] = useState<DeliveryRoute>({
    driverLocation: state.driverLocation,
    restaurantLocation: state.restaurantLocation,
    customerLocation: state.customerLocation,
    vehicleType: state.vehicleType,
    vehicleColor: state.vehicleColor,
    vehicleNumber: state.vehicleNumber,
  });
  const [status, setStatus] = useState(state.status);
  const socketRef = useRef<Socket | null>(null);
  const [etaToRestaurant, setEtaToRestaurant] = useState(
    state.estimatedTimeToRestaurant
  );
  const [etaToCustomer, setEtaToCustomer] = useState(
    state.estimatedTimeToCustomer
  );
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(
    state.expectedDeliveryTime
  );
  const [pathCoords, setPathCoords] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapPathStage, setMapPathStage] = useState<
    "toRestaurant" | "toCustomer"
  >("toRestaurant");
  const animationCancelledRef = useRef(false);
  const connectedRef = useRef(false);
  const subscribedRef = useRef(false);
  const lastFetchedStatusRef = useRef<string | null>(state.status);
  const lastFetchTimeRef = useRef<number>(0);

  const restaurantStatuses = ["Assigned", "In Transit", "Arrived Restaurant"];
  const customerStatuses = [
    "Picked Up",
    "In Transit - Picked Up",
    "Arrived Customer",
  ];
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

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
      const res = await api.get(`delivery/status/${deliveryIdRef.current}`);
      const data = res.data;

      if (data.status === lastFetchedStatusRef.current) return;
      lastFetchedStatusRef.current = data.status;

      orderIdRef.current = data.orderId;

      setRoute((r) => (r ? { ...r, driverLocation: data.driverLocation } : r));
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
            lat: state.restaurantLocation.latitude,
            lng: state.restaurantLocation.longitude,
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
            lat: state.customerLocation.latitude,
            lng: state.customerLocation.longitude,
          }
        );
        await animateAlong(
          path,
          Math.max(data.estimatedTimeToCustomer * 1000 - 5000, 1000)
        );
      } else if (data.status === "Arrived Restaurant") {
        animationCancelledRef.current = true;
        setRoute((r) =>
          r ? { ...r, driverLocation: state.restaurantLocation } : r
        );
      } else if (data.status === "Arrived Customer") {
        animationCancelledRef.current = true;
        setRoute((r) =>
          r ? { ...r, driverLocation: state.customerLocation } : r
        );
      }
    } catch (err) {
      console.error("Failed to resume tracking:", err);
    }
  }, [state]);

  useEffect(() => {
    if (!connectedRef.current) {
      socketRef.current = io("http://localhost:4006");
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

  const handlePickedUp = useCallback(async () => {
    try {
      await api.put("delivery/status/picked-up", {
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
      await api.put("delivery/status/delivered", {
        deliveryId: deliveryIdRef.current,
      });
      lastFetchedStatusRef.current = null;
      setStatus("Delivered");
      await api.put(`order/status/delivered/${orderIdRef.current}`);

      if (!user || !token) {
        console.warn("Skipping rider status update: missing user or token");
        return;
      }

      await dispatch(
        updateRiderStatus({
          id: user._id,
          isAvailable: true,
          location: {
            lat: state.customerLocation.latitude,
            lng: state.customerLocation.longitude,
          },
          token,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error marking delivered:", error);
    }
  }, [dispatch, state.customerLocation, token, user]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Tracking Delivery</h1>
      <StatusTracker currentStatus={status} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 h-auto shadow-lg">
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
              imageUrl={state.restaurantImage}
              fullName={state.restaurantName}
              address={state.restaurantAddress}
              role="Restaurant"
            />
          )}

          {customerStatuses.includes(status) && (
            <NextLocationCard
              imageUrl={state.customerImage}
              fullName={state.customerName}
              address={state.customerAddress}
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
