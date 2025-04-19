import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
  Polyline,
  Libraries,
} from "@react-google-maps/api";
import {
  getVehicleIconUrl,
  VehicleType,
  VehicleColor,
} from "../../utils/delivery/vehicleIcons";

const MAP_ID = import.meta.env.VITE_GOOGLE_CLOUD_MAP_ID;
const DEFAULT_CENTER = { lat: 0, lng: 0 };
const ICON_ZOOM_THRESHOLD = 10;

const libraries: Libraries = ["geometry"];

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface DeliveryRoute {
  driverLocation: LatLng;
  restaurantLocation: LatLng;
  customerLocation: LatLng;
  vehicleType?: string;
  vehicleColor?: string;
  vehicleNumber?: string;
}

interface Props {
  route?: DeliveryRoute;
  pathStage?: "toRestaurant" | "toCustomer";
  dynamicPath?: google.maps.LatLngLiteral[];
}

export default function DeliveryMap({
  route,
  pathStage = "toRestaurant",
  dynamicPath = [],
}: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    mapIds: [MAP_ID],
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(2);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const fetchRoute = useCallback(() => {
    if (!map || !route || dynamicPath.length > 0) return;

    const origin =
      pathStage === "toCustomer"
        ? {
            lat: route.restaurantLocation.latitude,
            lng: route.restaurantLocation.longitude,
          }
        : {
            lat: route.driverLocation.latitude,
            lng: route.driverLocation.longitude,
          };

    const destination =
      pathStage === "toCustomer"
        ? {
            lat: route.customerLocation.latitude,
            lng: route.customerLocation.longitude,
          }
        : {
            lat: route.restaurantLocation.latitude,
            lng: route.restaurantLocation.longitude,
          };

    new google.maps.DirectionsService().route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK && res) {
          setDirections(res);
        } else {
          console.warn("Failed to fetch directions:", status);
        }
      }
    );
  }, [map, route, pathStage, dynamicPath]);

  useEffect(() => {
    if (map && route) {
      fetchRoute();
    }
  }, [map, route, pathStage, fetchRoute]);

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
      {dynamicPath.length > 1 && (
        <Polyline
          path={dynamicPath}
          options={{
            strokeColor: "#4285F4",
            strokeOpacity: 0.9,
            strokeWeight: 5,
          }}
        />
      )}

      {!dynamicPath.length && directions && (
        <DirectionsRenderer
          options={{
            suppressMarkers: true,
            preserveViewport: true,
          }}
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
            icon={{
              url: "https://cdn-icons-png.flaticon.com/128/10309/10309202.png", // 🍴 icon from Flaticon
              scaledSize: new google.maps.Size(32, 32), // adjust size
            }}
          />
          <Marker
            position={{
              lat: route.customerLocation.latitude,
              lng: route.customerLocation.longitude,
            }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/128/3293/3293413.png", // 🍴 icon from Flaticon
              scaledSize: new google.maps.Size(32, 32), // adjust size
            }}
          />
          <Marker
            position={{
              lat: route.driverLocation.latitude,
              lng: route.driverLocation.longitude,
            }}
            icon={{
              url: getVehicleIconUrl(
                route.vehicleType as VehicleType,
                route.vehicleColor as VehicleColor
              ),
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        </>
      )}
    </GoogleMap>
  );
}
