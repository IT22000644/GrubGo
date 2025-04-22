import React from "react";
import { Clock, Truck, MapPin, Bike, Home } from "lucide-react"; // Import Lucide icons

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
    <div className="max-w-sm mx-auto border-4 border-orange-400 border-double bg-gradient-to-r from-yellow-600 via-yellow-600 to-orange-500 shadow-xl rounded-lg overflow-hidden mb-6 transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-white mb-4">
          <Truck className="inline-block mr-2 mb-2 text-white" />
          Order Number: {orderId}
        </h3>
        <p className="text-sm text-gray-100 mb-2">
          <span className="font-semibold text-white">Current Status:</span>{" "}
          {status}
        </p>

        <div className="border-t border-gray-200 my-4" />

        <p className="text-sm text-gray-100 mt-2">
          <MapPin className="inline-block mr-2 text-red-600" />
          <span className="font-semibold text-white">
            Restaurant Location:
          </span>{" "}
          {restaurantAddress}
        </p>
        <p className="text-sm text-gray-100 mt-2">
          <Home className="inline-block mr-2 text-green-300" />
          <span className="font-semibold text-white">
            Customer Location:
          </span>{" "}
          {customerAddress}
        </p>

        <div className="border-t border-gray-200 my-4" />

        <p className="text-sm text-gray-100">
          <Clock className="inline-block mr-2 text-blue-600" />
          <span className="font-semibold text-white">Assigned At:</span>{" "}
          {new Date(assignedAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-100 mt-2">
          <Clock className="inline-block mr-2 text-blue-600" />
          <span className="font-semibold text-white">
            Expected Delivery:
          </span>{" "}
          {new Date(expectedDeliveryTime).toLocaleString()}
        </p>
      </div>

      <div className="bg-gradient-to-r from-yellow-600 via-yellow-600 to-orange-500 p-4 rounded-b-lg shadow-lg">
        <button
          onClick={onTrackOrder}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          Check Status
          <Bike className="inline-block ml-4 mb-2" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryCard;
