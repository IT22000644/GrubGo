import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// navigate("/assign-driver", { state: { orderId: ORDER_ID } });

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
        const orderRes = await axios.get(
          `http://localhost:5001/api/order/${orderId}`
        );
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
        const customerCoordRes = await axios.post(
          `http://localhost:5004/api/map/coordinate`,
          {
            address: customerAddress,
          }
        );
        const restaurantCoordRes = await axios.post(
          `http://localhost:5004/api/map/coordinate`,
          {
            address: restaurantAddress,
          }
        );

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
        const closestDriverRes = await axios.post(
          `http://localhost:5004/api/map/closest`,
          {
            target: restaurantAddress,
            candidates: driversForSearch,
          }
        );
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
