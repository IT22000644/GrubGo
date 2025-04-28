import { useState, useRef, useEffect, useCallback } from "react";
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

interface AssignPayload {
  message: string;
  delivery: {
    _id: string;
    status: string;
    estimatedTimeToRestaurant: number;
    estimatedTimeToCustomer: number;
    expectedDeliveryTime: string;
  };
}

type LocationState = {
  orderId: string;
  driverId: string;
  driverAddress: string;
  restaurantAddress: string;
  customerAddress: string;
  driverLocation: { latitude: number; longitude: number };
  restaurantLocation: { latitude: number; longitude: number };
  customerLocation: { latitude: number; longitude: number };
  driverName: string;
  driverImage: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  customerName: string;
  customerImage: string;
  restaurantName: string;
  restaurantImage: string;
};

export default function DeliveryAssign() {
  const loc = useLocation();
  const state = loc.state as LocationState;

  const {
    orderId,
    driverId,
    driverAddress,
    restaurantAddress,
    customerAddress,
    driverLocation,
    restaurantLocation,
    customerLocation,
    driverName,
    driverImage,
    vehicleNumber,
    vehicleType,
    vehicleModel,
    vehicleColor,
  } = state;

  const [route, setRoute] = useState<DeliveryRoute>();
  const [status, setStatus] = useState("Not Assigned");
  const [etaToRestaurant, setEtaToRestaurant] = useState(0);
  const [etaToCustomer, setEtaToCustomer] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [pathCoords, setPathCoords] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapPathStage, setMapPathStage] = useState<
    "toRestaurant" | "toCustomer"
  >("toRestaurant");

  const deliveryIdRef = useRef<string>("");
  const assignCalledRef = useRef(false);
  const animationCancelledRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

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
      const from = path[i],
        to = path[i + 1];
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

  useEffect(() => {
    socketRef.current = io("http://localhost:4006");

    socketRef.current.on("connect", () => {
      console.log("WebSocket connected:", socketRef.current?.id);
    });

    socketRef.current.on(
      `delivery:${orderId}`,
      async (data: { status: string; timestamp: string }) => {
        setStatus(data.status);

        if (data.status === "In Transit") {
          const path = await fetchRoadPath(
            {
              lat: driverLocation.latitude,
              lng: driverLocation.longitude,
            },
            {
              lat: restaurantLocation.latitude,
              lng: restaurantLocation.longitude,
            }
          );
          await animateAlong(path, etaToRestaurant * 1000);
        }

        if (data.status === "Arrived Restaurant") {
          animationCancelledRef.current = true;
          setRoute((r) =>
            r
              ? {
                  ...r,
                  driverLocation: {
                    latitude: restaurantLocation.latitude,
                    longitude: restaurantLocation.longitude,
                  },
                }
              : r
          );
        }

        if (data.status === "In Transit - Picked Up") {
          setMapPathStage("toCustomer");
          const path = await fetchRoadPath(
            {
              lat: restaurantLocation.latitude,
              lng: restaurantLocation.longitude,
            },
            {
              lat: customerLocation.latitude,
              lng: customerLocation.longitude,
            }
          );
          await animateAlong(path, Math.max(etaToCustomer * 1000 - 5000, 1000));
        }

        if (data.status === "Arrived Customer") {
          animationCancelledRef.current = true;
          setRoute((r) =>
            r
              ? {
                  ...r,
                  driverLocation: {
                    latitude: customerLocation.latitude,
                    longitude: customerLocation.longitude,
                  },
                }
              : r
          );
        }
      }
    );

    return () => {
      socketRef.current?.off(`delivery:${orderId}`);
      socketRef.current?.off("connect");
      socketRef.current?.disconnect();
    };
  }, [
    etaToRestaurant,
    etaToCustomer,
    driverLocation,
    restaurantLocation,
    customerLocation,
    orderId,
  ]);

  const assignDelivery = useCallback(async () => {
    try {
      const { delivery } = (
        await api.post<AssignPayload>("delivery/assign", {
          orderId,
          driverId,
          driverAddress,
          restaurantAddress,
          customerAddress,
          driverLocation,
          restaurantLocation,
          customerLocation,
        })
      ).data;

      deliveryIdRef.current = delivery._id;
      setEtaToRestaurant(delivery.estimatedTimeToRestaurant);
      setEtaToCustomer(delivery.estimatedTimeToCustomer);
      setExpectedDeliveryTime(delivery.expectedDeliveryTime);

      setRoute({
        driverLocation,
        restaurantLocation,
        customerLocation,
        vehicleType,
        vehicleModel,
        vehicleNumber,
        vehicleColor,
      });

      setStatus("Assigned");
      setMapPathStage("toRestaurant");
    } catch (e) {
      console.error("Assign error:", e);
    }
  }, [
    orderId,
    driverId,
    driverAddress,
    restaurantAddress,
    customerAddress,
    driverLocation,
    restaurantLocation,
    customerLocation,
    vehicleType,
    vehicleModel,
    vehicleNumber,
    vehicleColor,
  ]);

  useEffect(() => {
    if (!assignCalledRef.current) {
      assignCalledRef.current = true;
      assignDelivery();
    }
  }, [assignDelivery]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Delivery</h1>
      <StatusTracker currentStatus={status} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 h-auto shadow-md">
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
            vehicleNumber={vehicleNumber}
            vehicleModel={vehicleModel}
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
              expectedDeliveryTime={expectedDeliveryTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}
