import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../../api/api";

type LocationState = {
  deliveryId: string;
};

export default function DriverTrackingLoader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryId } = location.state as LocationState;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/error", {
        state: { message: "Tracking request timed out." },
      });
    }, 60000);

    const loadData = async () => {
      // 1. Get Delivery Status
      let deliveryRes;
      try {
        deliveryRes = await api.get(`delivery/status/${deliveryId}`);
        console.log("1️⃣ Delivery Status API response:", deliveryRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Could not find delivery status." },
        });
      }

      const {
        orderId,
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
      } = deliveryRes.data;

      // 2. Get Driver Info
      let driverRes;
      try {
        driverRes = await api.get(`user/${driverId}`);
        console.log("2️⃣ Driver Info API response:", driverRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Driver information cannot be found." },
        });
      }

      const driverData = driverRes.data.data;
      const { profilePicture: driverImage } = driverData;
      const {
        fullName: driverName,
        vehicleType,
        vehicleModel,
        vehicleColor,
        vehicleNumber,
      } = driverData.riderDetails;

      // 3. Get Order Info
      let orderRes;
      try {
        orderRes = await api.get(`order/${orderId}`);
        console.log("3️⃣ Order Info API response:", orderRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Order details cannot be found." },
        });
      }

      const { customerId, restaurantId } = orderRes.data;

      // 4. Get Customer Info
      let customerRes;
      try {
        customerRes = await api.get(`user/${customerId}`);
        console.log("4️⃣ Customer Info API response:", customerRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Customer details cannot be found." },
        });
      }

      const customerData = customerRes.data.data;

      const { fullName: customerName, profilePicture: customerImage } = {
        fullName: customerData.customerDetails?.fullName || "Unknown Customer",
        profilePicture: customerData.profilePicture,
      };

      // 5. Get Restaurant Info
      let restaurantRes;
      try {
        restaurantRes = await api.get(`restaurant/${restaurantId}`);
        console.log("5️⃣ Restaurant Info API response:", restaurantRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Restaurant details cannot be found." },
        });
      }

      const restaurantData = restaurantRes.data.restaurant;
      const restaurantName = restaurantData.name;
      const restaurantImage = restaurantData.images[0] ?? "";

      // 🚀 Final gathered data
      console.log("🚀 All gathered tracking data:", {
        deliveryId,
        orderId,
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
        vehicleModel,
        vehicleColor,
        vehicleNumber,
        customerName,
        customerImage,
        restaurantName,
        restaurantImage,
      });

      clearTimeout(timeoutId);
      navigate("/delivery-tracking", {
        state: {
          deliveryId,
          orderId,
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
          vehicleModel,
          vehicleColor,
          vehicleNumber,
          customerName,
          customerImage,
          restaurantName,
          restaurantImage,
        },
      });
    };

    loadData();
  }, [deliveryId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700">
      <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
      <p className="text-xl font-medium">Loading tracking information...</p>
    </div>
  );
}
