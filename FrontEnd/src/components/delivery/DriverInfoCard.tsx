import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import {
  getVehicleIconUrl,
  VehicleType,
  VehicleColor,
} from "../../utils/delivery/vehicleIcons";

const isVehicleType = (value: string): value is VehicleType => {
  return ["bike", "car", "threewheel", "van", "lorry", "scooter"].includes(
    value
  );
};

const isVehicleColor = (value: string): value is VehicleColor => {
  return [
    "red",
    "yellow",
    "blue",
    "green",
    "white",
    "black",
    "purple",
  ].includes(value);
};

interface DriverInfoCardProps {
  name: string;
  imageUrl: string;
  vehicleType: string;
  vehicleColor: string;
  vehicleNumber: string;
  vehicleModel: string;
}

const DriverInfoCard: React.FC<DriverInfoCardProps> = ({
  name,
  imageUrl,
  vehicleType,
  vehicleColor,
  vehicleNumber,
  vehicleModel,
}) => {
  const safeType: VehicleType = isVehicleType(vehicleType)
    ? vehicleType
    : "bike";
  const safeColor: VehicleColor = isVehicleColor(vehicleColor)
    ? vehicleColor
    : "red";
  const vehicleIconUrl = getVehicleIconUrl(safeType, safeColor);

  return (
    <div className="flex items-center justify-between p-6 bg-neutral dark:bg-accent/30 rounded-3xl shadow-lg  max-w-xl w-full">
      {/* Avatar + Vehicle Icon */}
      <div className="relative flex flex-col items-center gap-3">
        <img
          src={
            !imageUrl ||
            imageUrl === "https://example.com/default-profile-picture.png"
              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCw6RV343VjEiadcJNk0mbq_2dzMeizoL96g&s"
              : imageUrl
          }
          alt="Driver"
          className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 dark:border-accent shadow-lg"
        />
        <img
          src={vehicleIconUrl}
          alt={`${safeColor} ${safeType}`}
          className="w-12 h-12 absolute -bottom-2 -right-2 bg-white rounded-full border-4 border-gray-300 shadow-md"
        />
      </div>

      {/* Driver Info */}
      <div className="flex flex-col flex-grow ml-6">
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          {name}
        </span>
        <span className="text-sm text-gray-600 dark:text-white capitalize mt-1">
          {vehicleModel}
        </span>
        <span className="text-lg font-medium text-blue-600 dark:text-orange-500 mt-2">
          {vehicleNumber}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 ml-4">
        <button
          className="p-3 border border-gray-300 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
          aria-label="Message Driver"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <button
          className="p-3 border border-green-500 bg-green-500 text-white rounded-full hover:bg-green-600"
          aria-label="Call Driver"
        >
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DriverInfoCard;
