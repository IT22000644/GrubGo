import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import api5004 from "../../api/api5004";
import api5011 from "../../api/api5011";
import { Loader2 } from "lucide-react";

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
        const { fullName: customerName, image: customerImage } =
          customerRes.data;

        // 3. Get Restaurant Info
        const restaurantRes = await axios.get(`restaurants/${restaurantId}`);
        const {
          fullName: restaurantName,
          address: restaurantAddress,
          image: restaurantImage,
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

        // 5. Get All Available Drivers
        const allDriversRes = await axios.get(
          "http://localhost:5002/api/user/",
          {
            params: { isavailable: true, role: "driver" },
          }
        );
        const drivers = allDriversRes.data;

        const driversForSearch = drivers.map((d: any) => ({
          id: d._id,
          address: d.address,
        }));

        // 6. Get Closest Driver
        const closestDriverRes = await api5004.post(`map/closest`, {
          target: restaurantAddress,
          candidates: driversForSearch,
        });
        const {
          id: driverId,
          address: driverAddress,
          latitude,
          longitude,
        } = closestDriverRes.data;

        const driverLocation = { latitude, longitude };

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

        // 8. Navigate to DeliveryAssign.tsx
        navigate("/delivery-assign", {
          state: {
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
