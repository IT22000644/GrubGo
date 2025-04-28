import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Loader2 } from "lucide-react";

type LocationState = {
  orderId: string;
};

export default function CustomerTrackingLoader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state as LocationState;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/error", {
        state: { message: "Customer tracking timed out." },
      });
    }, 60000);

    const loadData = async () => {
      // 1. Get Delivery by Order ID
      let deliveryRes;
      try {
        deliveryRes = await api.get(`delivery/order/${orderId}`);
        console.log("1️⃣ Delivery API response:", deliveryRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Could not find delivery for the order." },
        });
      }

      const delivery = deliveryRes.data.deliveries[0];
      if (!delivery) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "No delivery found for this order." },
        });
      }
      const deliveryId = delivery._id;
      console.log("→ deliveryId:", deliveryId);

      // 2. Get Delivery Status
      let statusRes;
      try {
        statusRes = await api.get(`delivery/status/${deliveryId}`);
        console.log("2️⃣ Delivery Status API response:", statusRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Could not fetch delivery status." },
        });
      }

      const {
        driverId,
        status,
        driverAddress,
        restaurantAddress,
        customerAddress,
        driverLocation,
        restaurantLocation,
        customerLocation,
        nextDestination,
        nextLocation,
        distanceToNext,
        etaToNext,
        expectedDeliveryTime,
        estimatedTimeToRestaurant,
        estimatedTimeToCustomer,
      } = statusRes.data;

      console.log("→ Status info extracted:", {
        driverId,
        status,
        driverAddress,
        restaurantAddress,
        customerAddress,
      });

      // 3. Get Driver Info
      let driverRes;
      try {
        driverRes = await api.get(`user/${driverId}`);
        console.log("3️⃣ Driver API response:", driverRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Driver information could not be found." },
        });
      }

      const driverData = driverRes.data.data;
      const { profilePicture: driverImage } = driverData;

      const {
        fullName: driverName,
        vehicleType,
        vehicleColor,
        vehicleModel,
        vehicleNumber,
      } = driverData.riderDetails;

      console.log("🚀 All gathered data:", {
        orderId,
        deliveryId,
        driverId,
        status,
        driverAddress,
        restaurantAddress,
        customerAddress,
        driverLocation,
        restaurantLocation,
        customerLocation,
        nextDestination,
        nextLocation,
        distanceToNext,
        etaToNext,
        expectedDeliveryTime,
        estimatedTimeToRestaurant,
        estimatedTimeToCustomer,
        driverName,
        driverImage,
        vehicleType,
        vehicleColor,
        vehicleModel,
        vehicleNumber,
      });

      clearTimeout(timeoutId);
      navigate("/customer-tracking", {
        state: {
          orderId,
          deliveryId,
          driverId,
          status,
          driverAddress,
          restaurantAddress,
          customerAddress,
          driverLocation,
          restaurantLocation,
          customerLocation,
          nextDestination,
          nextLocation,
          distanceToNext,
          etaToNext,
          expectedDeliveryTime,
          estimatedTimeToRestaurant,
          estimatedTimeToCustomer,
          driverName,
          driverImage,
          vehicleType,
          vehicleColor,
          vehicleModel,
          vehicleNumber,
        },
      });
    };

    loadData();
  }, [orderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700 dark:text-white">
      <Loader2 className="w-10 h-10 animate-spin text-primary dark:text-accent/30 mb-4" />
      <p className="text-xl font-medium dark:text-white">
        Preparing your delivery tracking...
      </p>
    </div>
  );
}
