import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DeliveryMap, {
  DeliveryRoute,
} from "../../components/delivery/DeliveryMap";
import StatusPanel from "../../components/delivery/StatusPanel";
import ControlsPanel from "../../components/delivery/ControlsPanel";
import { fetchRoadPath } from "../../utils/delivery/mapHelpers";

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

interface DeliveryStatusResponse {
  _id: string;
  orderId: string;
  driverId: string;
  driverLocation: {
    latitude: number;
    longitude: number;
  };
  restaurantLocation: {
    latitude: number;
    longitude: number;
  };
  customerLocation: {
    latitude: number;
    longitude: number;
  };
  status: string;
  expectedDeliveryTime: string;
  etaToNext: number;
  pickedUpAt: string;
  inTransitPickedUpAt: string;
  arrivedCustomerAt: string;
  createdAt: string;
  updatedAt: string;
}

type LocationState = { mode: "assign"; initialRoute: DeliveryRoute };

export default function DeliveryAssign() {
  const loc = useLocation();
  const state = (loc.state as LocationState) || undefined;

  const [route, setRoute] = useState<DeliveryRoute>();
  const [status, setStatus] = useState("Not Assigned");
  const [etaToRestaurant, setEtaToRestaurant] = useState(0);
  const [etaToCustomer, setEtaToCustomer] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [pathCoords, setPathCoords] = useState<google.maps.LatLngLiteral[]>([]);

  const deliveryIdRef = useRef<string>("");
  const assignCalledRef = useRef(false);
  const [mapPathStage, setMapPathStage] = useState<
    "toRestaurant" | "toCustomer"
  >("toRestaurant");

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

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];

      for (let step = 0; step <= updatesPerSegment; step++) {
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

  const assignDelivery = useCallback(async () => {
    if (!state || state.mode !== "assign") return;
    try {
      const { initialRoute } = state;
      const res = await axios.post<AssignPayload>(
        "http://localhost:5005/api/deliveries/assign",
        {
          orderId: "41ga21e5624f2dfbc4126h22",
          driverId: "34ga21e5624f2dfbc3284h65",
          driverLocation: initialRoute.driverLocation,
          restaurantLocation: initialRoute.restaurantLocation,
          customerLocation: initialRoute.customerLocation,
        }
      );
      const { delivery } = res.data;
      const etd = delivery.expectedDeliveryTime;

      console.log("AssignDelivery - expectedDeliveryTime from backend:", etd);
      console.log("Type of etd:", typeof etd);

      deliveryIdRef.current = delivery._id;
      setEtaToRestaurant(delivery.estimatedTimeToRestaurant);
      setEtaToCustomer(delivery.estimatedTimeToCustomer);
      setExpectedDeliveryTime(etd);
      setRoute(initialRoute);
      setStatus("Assigned");
      setMapPathStage("toRestaurant");

      setTimeout(async () => {
        setStatus("In Transit");
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
        await animateAlong(path, delivery.estimatedTimeToRestaurant * 1000);
        setStatus("Arrived Restaurant");
      }, 10_000);
    } catch (e) {
      console.error("Assign error:", e);
    }
  }, [state]);

  const handlePickedUp = useCallback(async () => {
    if (!route) return;

    try {
      await axios.put("http://localhost:5005/api/deliveries/status/picked-up", {
        deliveryId: deliveryIdRef.current,
      });
    } catch (error) {
      console.error("Error updating status to 'Picked Up':", error);
      return;
    }

    const updated = await axios.get<DeliveryStatusResponse>(
      `http://localhost:5005/api/deliveries/status/${deliveryIdRef.current}`
    );

    const updatedDelivery = updated.data;

    setStatus("Picked Up");
    setExpectedDeliveryTime(updatedDelivery.expectedDeliveryTime);

    setMapPathStage("toCustomer");

    setTimeout(async () => {
      setStatus("In Transit - Picked Up");

      const path = await fetchRoadPath(
        {
          lat: route.restaurantLocation.latitude,
          lng: route.restaurantLocation.longitude,
        },
        {
          lat: route.customerLocation.latitude,
          lng: route.customerLocation.longitude,
        }
      );

      await animateAlong(path, etaToCustomer * 1000);
      setStatus("Arrived Customer");
    }, 10_000);
  }, [route, etaToCustomer]);

  const handleDelivered = useCallback(async () => {
    setStatus("Delivered");
    await axios.put("http://localhost:5005/api/deliveries/status/delivered", {
      deliveryId: deliveryIdRef.current,
    });
  }, []);

  useEffect(() => {
    if (!assignCalledRef.current) {
      assignCalledRef.current = true;
      assignDelivery();
    }
  }, [assignDelivery]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Delivery</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 h-96">
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
