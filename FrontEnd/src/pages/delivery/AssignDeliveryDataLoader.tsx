import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api5004 from "../../api/api5004";
import api5011 from "../../api/api5011";

type LocationState = {
  orderId: string;
};

export default function AssignDeliveryDataLoader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state as LocationState;

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get Order by ID
        const orderRes = await api5011.get(`orders/${orderId}`);
        const { customerId, restaurantId } = orderRes.data;

        // 2. Get Customer Info
        const customerRes = await axios.get(
          `http://localhost:5002/api/user/${customerId}`
        );
        const {
          fullName: customerName,
          address: customerAddress,
          image: customerImage,
        } = customerRes.data;

        // 3. Get Restaurant Info
        const restaurantRes = await axios.get(
          `http://localhost:5003/api/restaurant/${restaurantId}`
        );
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

        const customerLocation = customerCoordRes.data; // { latitude, longitude }
        const restaurantLocation = restaurantCoordRes.data; // { latitude, longitude }

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

        // 8. Navigate to DeliveryAssign.tsx
        navigate("/assign-driver/run", {
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
      }
    };

    loadData();
  }, [orderId, navigate]);

  return (
    <div className="p-8 text-center text-lg font-medium text-gray-700">
      Preparing delivery assignment...
    </div>
  );
}
