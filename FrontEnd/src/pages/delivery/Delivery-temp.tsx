import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryRoute } from "../../components/delivery/DeliveryMap";

export default function DeliveryTemp() {
  const [deliveryId, setDeliveryId] = useState("");
  const navigate = useNavigate();

  const handleStartSimulation = () => {
    const initialRoute: DeliveryRoute = {
      driverLocation: { latitude: 6.927079, longitude: 79.861244 },
      restaurantLocation: { latitude: 6.930079, longitude: 79.858244 },
      customerLocation: { latitude: 6.927079, longitude: 79.861244 },
      vehicleType: "bike",
      vehicleColor: "red",
      vehicleNumber: "XT-9988",
    };

    navigate("/delivery", {
      state: { mode: "assign", initialRoute },
    });
  };

  const handleTrackOrder = () => {
    const id = deliveryId.trim();
    if (!id) return alert("Please enter a Delivery ID.");
    navigate("/delivery", {
      state: { mode: "track", deliveryId: id },
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-center">Delivery Launcher</h1>

      <button
        onClick={handleStartSimulation}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Assign Driver & Start Simulation
      </button>

      <div className="flex space-x-2">
        <input
          type="text"
          value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)}
          placeholder="Enter Delivery ID"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleTrackOrder}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Track Order
        </button>
      </div>
    </div>
  );
}
