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
      // 1. Get Order by ID
      let orderRes;
      try {
        orderRes = await api5011.get(`orders/${orderId}`);
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
        customerRes = await axios.get(
          `http://localhost:5002/api/user/${customerId}`
        );
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
        restaurantRes = await api1.get(`restaurants/${restaurantId}`);
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Restaurant details cannot be found." },
        });
      }
      const {
        name: restaurantName,
        address: restaurantAddress,
        images: [restaurantImage],
      } = restaurantRes.data;

      // 4. Get Coordinates
      let customerCoordRes, restaurantCoordRes;
      try {
        [customerCoordRes, restaurantCoordRes] = await Promise.all([
          api5004.post(`map/coordinate`, { address: customerAddress }),
          api5004.post(`map/coordinate`, { address: restaurantAddress }),
        ]);
      } catch (err) {
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
        allDriversRes = await axios.get("http://localhost:5002/active-riders");
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

      // 6. Find the closest driver
      let closestDriverRes;
      try {
        closestDriverRes = await axios.post(
          `http://localhost:5004/api/map/closest-rider`,
          {
            baseLocation: restaurantAddress,
            data: payloadRiders,
          }
        );
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
        driverRes = await axios.get(
          `http://localhost:5002/api/user/${driverId}`
        );
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
        const driverAddressRes = await axios.post(
          "http://localhost:5004/api/map/address", 
          {
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
          }
        );
        driverAddress = driverAddressRes.data.address; 
      } catch (err) {
        clearTimeout(timeoutId);
        return navigate("/error", {
          state: { message: "Driver Address cannot be converted." },
        });
      }

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
