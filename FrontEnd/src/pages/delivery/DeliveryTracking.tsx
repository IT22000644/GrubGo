import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DeliveryMap, {
  DeliveryRoute,
} from "../../components/delivery/DeliveryMap";
import StatusPanel from "../../components/delivery/StatusPanel";
import ControlsPanel from "../../components/delivery/ControlsPanel";
import { fetchRoadPath } from "../../utils/delivery/mapHelpers";

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
}

export default function DeliveryTracking() {
  const loc = useLocation();
  const state = loc.state as TrackingState;

  const deliveryIdRef = useRef<string>(state.deliveryId);
  const [route, setRoute] = useState<DeliveryRoute>();
  const [status, setStatus] = useState("Loading");
  const [etaToRestaurant, setEtaToRestaurant] = useState(0);
  const [etaToCustomer, setEtaToCustomer] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [pathCoords, setPathCoords] = useState<google.maps.LatLngLiteral[]>([]);
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

  const fetchStatusAndResume = useCallback(async () => {
    try {
      const res = await axios.get<DeliveryStatusResponse>(
        `http://localhost:5005/api/deliveries/status/${deliveryIdRef.current}`
      );

      const data = res.data;

      const deliveryRoute: DeliveryRoute = {
        driverLocation: data.driverLocation,
        restaurantLocation: data.restaurantLocation,
        customerLocation: data.customerLocation,
        vehicleType: "bike",
        vehicleColor: "red",
        vehicleNumber: "XT-9988",
      };

      setRoute(deliveryRoute);
      setExpectedDeliveryTime(data.expectedDeliveryTime);
      setStatus(data.status);

      if (data.status === "Assigned" || data.status === "In Transit") {
        setEtaToRestaurant(data.etaToNext);
        setMapPathStage("toRestaurant");
      }

      if (
        data.status === "Picked Up" ||
        data.status === "In Transit - Picked Up"
      ) {
        setEtaToCustomer(data.etaToNext);
        setMapPathStage("toCustomer");
      }

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
        await animateAlong(path, data.etaToNext * 60_000, () => {
          setStatus("Arrived Restaurant");
        });
      }

      if (data.status === "In Transit - Picked Up") {
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
        await animateAlong(path, data.etaToNext * 60_000, () => {
          setStatus("Arrived Customer");
        });
      }
    } catch (err) {
      console.error("Error tracking delivery:", err);
      setStatus("Failed to fetch");
    }
  }, []);

  const handlePickedUp = useCallback(async () => {
    if (!route) return;

    setStatus("Picked Up");
    setMapPathStage("toCustomer");

    await axios.put("http://localhost:5005/api/deliveries/status/picked-up", {
      deliveryId: deliveryIdRef.current,
    });

    const updated = await axios.get<DeliveryStatusResponse>(
      `http://localhost:5005/api/deliveries/status/${deliveryIdRef.current}`
    );

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

    setExpectedDeliveryTime(updated.data.expectedDeliveryTime);
    setEtaToCustomer(updated.data.etaToNext);
    setRoute((r) =>
      r ? { ...r, driverLocation: route.restaurantLocation } : r
    );

    await animateAlong(path, updated.data.etaToNext * 60_000, () => {
      setStatus("Arrived Customer");
    });
  }, [route]);

  const handleDelivered = useCallback(async () => {
    setStatus("Delivered");
    await axios.put("http://localhost:5005/api/deliveries/status/delivered", {
      deliveryId: deliveryIdRef.current,
    });
  }, []);

  useEffect(() => {
    fetchStatusAndResume();
  }, [fetchStatusAndResume]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Delivery Tracking</h1>
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
