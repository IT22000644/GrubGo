import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryCard from "../../components/delivery/DeliveryCard";
import api5005 from "../../api/api5005";

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
      const driverId = "34ga21e5624f2dfbc3284h65";
      const { data } = await api5005.get(`deliveries/driver/${driverId}`);
      setDeliveries(data.deliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
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
        <p className="text-center font-semibold text-gray-500 text-lg">
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
    navigate("/delivery-tracking", {
      state: {
        mode: "track",
        deliveryId: delivery._id,
        driverAddress: delivery.driverAddress,
        restaurantAddress: delivery.restaurantAddress,
        customerAddress: delivery.customerAddress,
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-20 ">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
