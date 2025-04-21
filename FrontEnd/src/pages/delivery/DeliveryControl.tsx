import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryRoute } from "../../components/delivery/DeliveryMap";
import axios from "axios";

export default function DeliveryControl() {
  const [deliveryId, setDeliveryId] = useState("");
  const navigate = useNavigate();

  const handleTrackCustomerOrder = async () => {
    const id = deliveryId.trim();
    if (!id) return alert("Please enter a Delivery ID.");

    try {
      const { data } = await axios.get(
        `http://localhost:5005/api/deliveries/status/${id}`
      );

      const { driverAddress, restaurantAddress, customerAddress } = data;

      navigate("/customer-tracking", {
        state: {
          mode: "track",
          deliveryId: id,
          driverAddress,
          restaurantAddress,
          customerAddress,
        },
      });
    } catch (error) {
      console.error("Error fetching delivery details:", error);
      alert("Failed to fetch delivery details. Please try again.");
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const response = await axios.post("http://localhost:5004/api/map/", {
        address,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to get coordinates");
      return { latitude: 0, longitude: 0 };
    }
  };

  const handleStartSimulation = async () => {
    const driverAddress =
      "Dinlo Lanka Pvt Ltd, Malabe, Western Province, Sri Lanka";
    const restaurantAddress =
      "Spar Supermarket, Malabe, Western Province, Sri Lanka";
    const customerAddress = "SLIIT Malabe, Malabe, Western Province, Sri Lanka";

    const driverCoords = await getCoordinates(driverAddress);
    const restaurantCoords = await getCoordinates(restaurantAddress);
    const customerCoords = await getCoordinates(customerAddress);

    const initialRoute: DeliveryRoute = {
      driverLocation: driverCoords,
      restaurantLocation: restaurantCoords,
      customerLocation: customerCoords,
      vehicleType: "bike",
      vehicleColor: "black",
      vehicleNumber: "XT-9988",
    };

    navigate("/delivery-assign", {
      state: {
        mode: "assign",
        initialRoute,
        driverAddress,
        restaurantAddress,
        customerAddress,
      },
    });
  };

  const handleTrackOrder = () => {
    const id = deliveryId.trim();
    if (!id) return alert("Please enter a Delivery ID.");
    navigate("/delivery-tracking", {
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

      <h2 className="text-base font-semibold text-center">
        Restaurant and Driver Tracking Delivery
      </h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)}
          placeholder="Enter Delivery ID"
          className="flex-1 border rounded px-3 py-2 text-black"
        />
        <button
          onClick={handleTrackOrder}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Track Order
        </button>
      </div>

      <h2 className="text-base font-semibold text-center">
        Customer Tracking Delivery
      </h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)}
          placeholder="Enter Delivery ID"
          className="flex-1 border rounded px-3 py-2 text-black"
        />
        <button
          onClick={handleTrackCustomerOrder}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Track Order
        </button>
      </div>
    </div>
  );
}
