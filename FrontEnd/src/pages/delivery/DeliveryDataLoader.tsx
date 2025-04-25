import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api1 } from "../../api/axios";
import api5004 from "../../api/api5004";
import api5011 from "../../api/api5011";
import { Loader2 } from "lucide-react";
import axios from "axios";

type LocationState = {
  orderId: string;
};

export default function AssignDeliveryDataLoader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state as LocationState;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/error", {
        state: { message: "Delivery assignment timed out." },
      });
    }, 60000);

    const loadData = async () => {
      try {
        // 1. Get Order by ID
        const orderRes = await api5011.get(`orders/${orderId}`);
        const {
          customerId,
          restaurantId,
          address: customerAddress,
        } = orderRes.data;

        // 2. Get Customer Info
        const customerRes = await axios.get(
          `http://localhost:5002/api/user/${customerId}`
        );
        const { username: customerName, profilePicture: customerImage } =
          customerRes.data;

        // 3. Get Restaurant Info
        const restaurantRes = await api1.get(`restaurants/${restaurantId}`);
        const {
          name: restaurantName,
          address: restaurantAddress,
          images: [restaurantImage],
        } = restaurantRes.data;

        // 4. Get Coordinates
        const customerCoordRes = await api5004.post(`map/coordinate`, {
          address: customerAddress,
        });
        const restaurantCoordRes = await api5004.post(`map/coordinate`, {
          address: restaurantAddress,
        });

        const customerLocation = customerCoordRes.data;
        const restaurantLocation = restaurantCoordRes.data;

        interface ActiveRider {
          _id: string;
          userId: string;
          currentLocation: { lat: number; lng: number };
        }

        const allDriversRes = await axios.get<{
          success: boolean;
          data: ActiveRider[];
        }>("http://localhost:5002/active-riders");

        if (!allDriversRes.data.success) {
          console.error("No active riders found");
          return [];
        }

        const payloadRiders = allDriversRes.data.data.map((r) => ({
          userId: r._id,
          currentLocation: r.currentLocation,
        }));

        // 6. Find the closest driver
        const closestDriverRes = await axios.post<{
          id: string;
          currentLocation: { lat: number; lng: number };
          distance: number;
        }>("http://localhost:5004/api/map/closest-rider", {
          baseLocation: restaurantAddress,
          data: payloadRiders,
        });

        const { id: driverId, currentLocation: driverLocation } =
          closestDriverRes.data;

        // 7. Get Driver Info
        const driverRes = await axios.get(
          `http://localhost:5002/api/user/${driverId}`
        );
        const {
          fullName: driverName,
          image: driverImage,
          vehicleNumber,
          vehicleType,
          vehicleModel,
          vehicleColor,
        } = driverRes.data;

        clearTimeout(timeoutId);

        // 9. Navigate to DeliveryAssign.tsx
        navigate("/delivery-assign", {
          state: {
            orderId,
            driverId,
            //            driverAddress,
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
            customerName,
            customerImage,
            restaurantName,
            restaurantImage,
          },
        });
      } catch (error) {
        console.error("Failed to gather delivery assignment data", error);
        clearTimeout(timeoutId);
        navigate("/error", {
          state: { message: "Failed to assign delivery. Please try again." },
        });
      }
    };

    loadData();
  }, [orderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700">
      <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
      <p className="text-xl font-medium">Preparing delivery assignment...</p>
    </div>
  );
}
