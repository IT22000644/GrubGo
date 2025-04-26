import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api5005 from "../../api/api5005";
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
  mode: "assign";
  initialRoute: DeliveryRoute;
  driverAddress: string;
  restaurantAddress: string;
  customerAddress: string;
};

export default function DeliveryAssign() {
  const ORDER_ID = "41ga21e5624f2dfbc4126h50";
  const loc = useLocation();
  const state = loc.state as LocationState;
  const { initialRoute, driverAddress, restaurantAddress, customerAddress } =
    state;

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
      `delivery:${ORDER_ID}`,
      async (data: { status: string; timestamp: string }) => {
        setStatus(data.status);

        if (data.status === "In Transit") {
          const path = await fetchRoadPath(
            {
              lat: initialRoute.driverLocation.latitude,
              lng: initialRoute.driverLocation.longitude,
            },
            {
              lat: initialRoute.restaurantLocation.latitude,
              lng: initialRoute.restaurantLocation.longitude,
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
                    latitude: initialRoute.restaurantLocation.latitude,
                    longitude: initialRoute.restaurantLocation.longitude,
                  },
                }
              : r
          );
        }

        if (data.status === "In Transit - Picked Up") {
          setMapPathStage("toCustomer");
          const path = await fetchRoadPath(
            {
              lat: initialRoute.restaurantLocation.latitude,
              lng: initialRoute.restaurantLocation.longitude,
            },
            {
              lat: initialRoute.customerLocation.latitude,
              lng: initialRoute.customerLocation.longitude,
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
                    latitude: initialRoute.customerLocation.latitude,
                    longitude: initialRoute.customerLocation.longitude,
                  },
                }
              : r
          );
        }
      }
    );

    return () => {
      socketRef.current?.off(`delivery:${ORDER_ID}`);
      socketRef.current?.off("connect");
      socketRef.current?.disconnect();
    };
  }, [etaToRestaurant, etaToCustomer, initialRoute]);

  const assignDelivery = useCallback(async () => {
    if (state.mode !== "assign") return;

    try {
      const { delivery } = (
        await api5005.post<AssignPayload>("delivery/assign", {
          orderId: ORDER_ID,
          driverId: "34ga21e5624f2dfbc3284h65",
          driverAddress,
          restaurantAddress,
          customerAddress,
          driverLocation: initialRoute.driverLocation,
          restaurantLocation: initialRoute.restaurantLocation,
          customerLocation: initialRoute.customerLocation,
        })
      ).data;

      deliveryIdRef.current = delivery._id;
      setEtaToRestaurant(delivery.estimatedTimeToRestaurant);
      setEtaToCustomer(delivery.estimatedTimeToCustomer);
      setExpectedDeliveryTime(delivery.expectedDeliveryTime);
      setRoute(initialRoute);
      setStatus("Assigned");
      setMapPathStage("toRestaurant");
    } catch (e) {
      console.error("Assign error:", e);
    }
  }, [
    initialRoute,
    driverAddress,
    restaurantAddress,
    customerAddress,
    state.mode,
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
        <div className="col-span-2 h-96 border-4 border-blue-800 border-double">
          <DeliveryMap
            route={route}
            pathStage={mapPathStage}
            dynamicPath={pathCoords}
          />
        </div>
        <div className="space-y-4">
          <DriverInfoCard
            name="Alex Rider"
            imageUrl="https://images.pexels.com/photos/28955594/pexels-photo-28955594/free-photo-of-chimpanzee-at-zoo-in-natural-habitat.jpeg?auto=compress&cs=tinysrgb&w=600"
            vehicleType={route?.vehicleType || "Car"}
            vehicleColor={route?.vehicleColor || "Blue"}
            vehicleNumber={route?.vehicleNumber || "XT-9988"}
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
