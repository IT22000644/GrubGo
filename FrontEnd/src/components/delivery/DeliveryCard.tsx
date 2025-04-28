import React from "react";
import { Clock, Truck, MapPin, Bike, Home } from "lucide-react";

interface DeliveryCardProps {
  orderId: string;
  status: string;
  restaurantAddress: string;
  customerAddress: string;
  assignedAt: string;
  expectedDeliveryTime: string;
  onTrackOrder: () => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  orderId,
  status,
  restaurantAddress,
  customerAddress,
  assignedAt,
  expectedDeliveryTime,
  onTrackOrder,
}) => {
  return (
    <div className="max-w-sm mx-auto bg-primary/15 dark:bg-accent/30 shadow-xl rounded-lg overflow-hidden mb-6 transform">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
          <Truck className="inline-block mr-2 mb-2 text-black dark:text-white " />
          Order Number: #{orderId.slice(-6)}
        </h3>
        <p className="text-sm text-primary/90 dark:text-primary font-extrabold mb-2">
          <span className="font-semibold text-black dark:text-white">
            Current Status:
          </span>{" "}
          {status}
        </p>

        <div className="border-t border-black dark:border-white my-4" />

        <p className="text-sm text-black dark:text-white mt-2">
          <MapPin className="inline-block mr-2 text-red-600" />
          <span className="font-semibold text-black dark:text-white">
            Restaurant Location:
          </span>{" "}
          {restaurantAddress}
        </p>
        <p className="text-sm text-black dark:text-white mt-2">
          <Home className="inline-block mr-2 text-green-300" />
          <span className="font-semibold text-black dark:text-white">
            Customer Location:
          </span>{" "}
          {customerAddress}
        </p>

        <div className="border-t border-black dark:border-white my-4" />

        <p className="text-sm text-black dark:text-white">
          <Clock className="inline-block mr-2 text-primary" />
          <span className="font-semibold text-black dark:text-white">
            Assigned At:
          </span>{" "}
          {new Date(assignedAt).toLocaleString()}
        </p>
        <p className="text-sm text-black dark:text-white mt-2">
          <Clock className="inline-block mr-2 text-primary " />
          <span className="font-semibold text-black dark:text-white">
            Expected Delivery:
          </span>{" "}
          {new Date(expectedDeliveryTime).toLocaleString()}
        </p>
      </div>

      {/* Manage Status section */}
      {status !== "Delivered" && (
        <div className="bg-primary/15 p-4 rounded-b-lg shadow-lg">
          <button
            onClick={onTrackOrder}
            className="w-full py-2 px-4 bg-white dark:bg-gradient-to-r from-yellow-600 via-yellow-600 to-orange-500 
               text-primary dark:text-black rounded-lg shadow-md 
               hover:brightness-90
               focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 
               transition duration-300 transform"
          >
            Manage Status
            <Bike className="inline-block ml-4 mb-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryCard;
