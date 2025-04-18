import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const MAP_ID = import.meta.env.VITE_GOOGLE_CLOUD_MAP_ID;
const DEFAULT_CENTER = { lat: 0, lng: 0 };
const ICON_ZOOM_THRESHOLD = 10;

export interface LatLng {
  latitude: number;
  longitude: number;
}
export interface DeliveryRoute {
  driverLocation: LatLng;
  restaurantLocation: LatLng;
  customerLocation: LatLng;
}

interface Props {
  route?: DeliveryRoute;
}

export default function DeliveryMap({ route }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    mapIds: [MAP_ID],
    libraries: ["geometry"],
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(2);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const fetchRoute = useCallback(() => {
    if (!map || !route) return;
    new google.maps.DirectionsService().route(
      {
        origin: {
          lat: route.driverLocation.latitude,
          lng: route.driverLocation.longitude,
        },
        destination: {
          lat: route.customerLocation.latitude,
          lng: route.customerLocation.longitude,
        },
        waypoints: [
          {
            location: {
              lat: route.restaurantLocation.latitude,
              lng: route.restaurantLocation.longitude,
            },
            stopover: true,
          },
        ],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK && res) {
          setDirections(res);
        }
      }
    );
  }, [map, route]);

  useEffect(() => {
    if (map && route) fetchRoute();
  }, [map, route, fetchRoute]);

  if (loadError) return <div className="text-red-600">Map error</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={
        route
          ? {
              lat: route.driverLocation.latitude,
              lng: route.driverLocation.longitude,
            }
          : DEFAULT_CENTER
      }
      zoom={route ? 14 : 2}
      onLoad={(m) => {
        setMap(m);
        setZoom(m.getZoom() || 2);
        m.addListener("zoom_changed", () => setZoom(m.getZoom() || 2));
      }}
      options={{ mapId: MAP_ID }}
    >
      {directions && (
        <DirectionsRenderer
          options={{ suppressMarkers: true }}
          directions={directions}
        />
      )}

      {route && zoom >= ICON_ZOOM_THRESHOLD && (
        <>
          <Marker
            position={{
              lat: route.restaurantLocation.latitude,
              lng: route.restaurantLocation.longitude,
            }}
            label={{ text: "🍴", fontSize: "24px" }}
          />
          <Marker
            position={{
              lat: route.customerLocation.latitude,
              lng: route.customerLocation.longitude,
            }}
            label={{ text: "🏠", fontSize: "24px" }}
          />
          <Marker
            position={{
              lat: route.driverLocation.latitude,
              lng: route.driverLocation.longitude,
            }}
            label={{ text: "🚚", fontSize: "24px" }}
          />
        </>
      )}
    </GoogleMap>
  );
}
