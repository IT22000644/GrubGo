import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DeliveryMap from "../../components/delivery/DeliveryMap";
import StatusPanel from "../../components/delivery/StatusPanel";

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
  vehicleType: string;
  vehicleColor: string;
  vehicleNumber: string;
}

export default function CustomerTracking() {
  const loc = useLocation();
  const state = loc.state as TrackingState;

  const [route, setRoute] = useState<any>(null);
  const [status, setStatus] = useState("Loading");
  const [etaToRestaurant, setEtaToRestaurant] = useState(0);
  const [etaToCustomer, setEtaToCustomer] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState({
    type: "",
    color: "",
    number: "",
  });

  const fetchStatus = async () => {
    try {
      const res = await axios.get<DeliveryStatusResponse>(
        `http://localhost:5005/api/deliveries/status/${state.deliveryId}`
      );
      const data = res.data;

      setRoute({
        driverLocation: data.driverLocation,
        restaurantLocation: data.restaurantLocation,
        customerLocation: data.customerLocation,
      });
      setStatus(data.status);
      setExpectedDeliveryTime(data.expectedDeliveryTime);
      setEtaToRestaurant(data.etaToNext);
      setEtaToCustomer(data.etaToNext);
      setVehicleInfo({
        type: data.vehicleType,
        color: data.vehicleColor,
        number: data.vehicleNumber,
      });
    } catch (err) {
      console.error("Error tracking delivery:", err);
      setStatus("Failed to fetch");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Customer Delivery Tracking</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 h-96">
          <DeliveryMap route={route} />
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
          <div className="border p-4 rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            <p>
              <strong>Vehicle Type:</strong> {vehicleInfo.type}
            </p>
            <p>
              <strong>Vehicle Color:</strong> {vehicleInfo.color}
            </p>
            <p>
              <strong>Vehicle Number:</strong> {vehicleInfo.number}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
