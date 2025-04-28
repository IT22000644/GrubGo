import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryCard from "../../components/delivery/DeliveryCard";
import AvailabilitySwitch from "../../components/delivery/AvailabilitySwitch";
import api from "../../api/api";

interface Delivery {
  _id: string;
  orderId: string;
  driverId: string;
  driverAddress: string;
  restaurantAddress: string;
  customerAddress: string;
  status: string;
  assignedAt: string;
  expectedDeliveryTime: string;
}

const DriverView = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedTab, setSelectedTab] = useState("Ongoing");
  const navigate = useNavigate();

  const fetchDriverDeliveries = async () => {
    try {
      const driverId = "680db516c1399c9450e93622";
      const { data } = await api.get(`delivery/driver/${driverId}`);

      const driverDeliveries: Delivery[] = Array.isArray(data)
        ? data
        : Array.isArray(data.deliveries)
        ? data.deliveries
        : [];

      setDeliveries(driverDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
    }
  };

  useEffect(() => {
    fetchDriverDeliveries();
  }, []);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const renderDeliveryCards = (statuses: string[]) => {
    const filteredDeliveries = deliveries.filter((delivery) =>
      statuses.includes(delivery.status)
    );

    if (filteredDeliveries.length === 0) {
      return (
        <p className="text-center font-bold text-orange-600 dark:text-accent text-lg">
          No {selectedTab} Deliveries Available
        </p>
      );
    }

    return filteredDeliveries.map((delivery) => (
      <DeliveryCard
        key={delivery._id}
        orderId={delivery.orderId}
        status={delivery.status}
        restaurantAddress={delivery.restaurantAddress}
        customerAddress={delivery.customerAddress}
        assignedAt={delivery.assignedAt}
        expectedDeliveryTime={delivery.expectedDeliveryTime}
        onTrackOrder={() => handleTrackOrder(delivery)}
      />
    ));
  };

  const handleTrackOrder = (delivery: Delivery) => {
    navigate("/driver-tracking-loader", {
      state: {
        mode: "track",
        deliveryId: delivery._id,
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-20 ">
      {/* top-left switch */}
      <div className="absolute top-32 left-12">
        <AvailabilitySwitch />
      </div>
      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => handleTabClick("Ongoing")}
          className={`px-4 py-2 font-semibold rounded-md ${
            selectedTab === "Ongoing"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Ongoing Deliveries
        </button>
        <button
          onClick={() => handleTabClick("Completed")}
          className={`px-4 py-2 font-semibold rounded-md ${
            selectedTab === "Completed"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Completed Deliveries
        </button>
        <button
          onClick={() => handleTabClick("Cancelled")}
          className={`px-4 py-2 font-semibold rounded-md ${
            selectedTab === "Cancelled"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Cancelled Deliveries
        </button>
      </div>

      {/* Deliveries based tabs */}
      {selectedTab === "Ongoing" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderDeliveryCards([
            "Assigned",
            "In Transit",
            "Arrived Restaurant",
            "Picked Up",
            "In Transit - Picked Up",
            "Arrived Customer",
          ])}
        </div>
      )}

      {selectedTab === "Completed" && (
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderDeliveryCards(["Delivered"])}
        </div>
      )}

      {selectedTab === "Cancelled" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderDeliveryCards(["Cancelled"])}
        </div>
      )}
    </div>
  );
};

export default DriverView;
