import { MapPin, Home } from "lucide-react";

interface Props {
  restaurantAddress: string;
  customerAddress: string;
}

export default function PickupDropInfo({
  restaurantAddress,
  customerAddress,
}: Props) {
  return (
    <div className="bg-neutral dark:bg-accent/30 rounded-2xl shadow-lg p-6 space-y-4 ">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
        Route Details
      </h2>
      <div className="flex items-center space-x-4">
        <MapPin className="w-6 h-6 text-blue-500" />
        <div>
          <p className="text-sm text-gray-500 dark:text-white">
            Picked up from
          </p>
          <p className="text-md font-semibold text-gray-800 dark:text-white">
            {restaurantAddress}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Home className="w-6 h-6 text-green-500" />
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Drop off at</p>
          <p className="text-md font-semibold text-gray-800 dark:text-white">
            {customerAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
