import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
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
      // 1. Get Order by ID
      let orderRes;
      try {
        orderRes = await api.get(`order/${orderId}`);
        console.log("1️⃣ Order API response:", orderRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Order details cannot be found." },
        });
      }
      const {
        customerId,
        restaurantId,
        address: customerAddress,
      } = orderRes.data;

      // 2. Get Customer Info
      let customerRes;
      try {
        customerRes = await api.get(`user/${customerId}`);
        console.log("2️⃣ Customer API response:", customerRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Customer details cannot be found." },
        });
      }
      const { username: customerName, profilePicture: customerImage } =
        customerRes.data;

      // 3. Get Restaurant Info
      let restaurantRes;
      try {
        restaurantRes = await api.get(`restaurant/${restaurantId}`);
        console.log("3️⃣ Restaurant API response:", restaurantRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Restaurant details cannot be found." },
        });
      }

      const {
        name: restaurantName,
        address: restaurantAddress,
        images = [],
      } = restaurantRes.data.restaurant ?? {};
      console.log("   Parsed restaurantName, address, images:", {
        restaurantName,
        restaurantAddress,
        images,
      });
      const restaurantImage = images[0] ?? "";

      // 4. Get Coordinates
      const customerPayload = { address: customerAddress };
      const restaurantPayload = { addressParts: restaurantAddress };
      console.log("→ map/coordinate payloads:", {
        customerPayload,
        restaurantPayload,
      });

      let customerCoordRes, restaurantCoordRes;
      try {
        [customerCoordRes, restaurantCoordRes] = await Promise.all([
          api.post("map/coordinate", customerPayload),
          api.post("map/coordinate", restaurantPayload),
        ]);
        console.log("4️⃣ Customer coord:", customerCoordRes.data);
        console.log("   Restaurant coord:", restaurantCoordRes.data);
      } catch (err) {
        console.error("Coordinate lookup error:", err);
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Could not resolve one or more addresses." },
        });
      }
      const customerLocation = customerCoordRes.data;
      const restaurantLocation = restaurantCoordRes.data;

      // 5. Get Active Riders
      let allDriversRes;
      try {
        allDriversRes = await api.get("user/active-riders");
        console.log("5️⃣ Active Riders API response:", allDriversRes);
        if (!allDriversRes.data.success) throw new Error("No active riders");
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "No active riders available right now." },
        });
      }
      const payloadRiders = allDriversRes.data.data.map((r: any) => ({
        userId: r._id,
        currentLocation: r.currentLocation,
      }));
      console.log("   Mapped payloadRiders:", payloadRiders);
      console.log(" RestaurantAddress:", restaurantLocation);

      // 6. Find the closest driver
      let closestDriverRes;
      try {
        closestDriverRes = await api.post(`map/closest-rider`, {
          baseLocation: restaurantLocation,
          data: payloadRiders,
        });
        console.log("6️⃣ Closest Rider API response:", closestDriverRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Could not find the closest rider." },
        });
      }
      const { id: driverId, currentLocation: driverLocation } =
        closestDriverRes.data;

      // 7. Get Driver Info
      let driverRes;
      try {
        driverRes = await api.get(`user/${driverId}`);
        console.log("7️⃣ Driver API response:", driverRes);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Driver details cannot be found." },
        });
      }
      const {
        fullName: driverName,
        image: driverImage,
        vehicleNumber,
        vehicleType,
        vehicleModel,
        vehicleColor,
      } = driverRes.data;

      // 8. Get Driver's Address
      let driverAddress = "";
      try {
        const driverAddressRes = await api.post("map/address", {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
        });
        console.log("8️⃣ Driver Address API response:", driverAddressRes);
        driverAddress = driverAddressRes.data.address;
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Driver Address cannot be converted." },
        });
      }

      // Final state dump
      console.log("🚀 All gathered data:", {
        orderId,
        customerName,
        customerAddress,
        customerImage,
        restaurantName,
        restaurantAddress,
        restaurantImage,
        customerLocation,
        restaurantLocation,
        payloadRiders,
        driverId,
        driverLocation,
        driverName,
        driverImage,
        vehicleNumber,
        vehicleType,
        vehicleModel,
        vehicleColor,
        driverAddress,
      });

      clearTimeout(timeoutId);
      navigate("/delivery-assign", {
        state: {
          orderId,
          driverId,
          restaurantAddress,
          customerAddress,
          driverAddress,
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
