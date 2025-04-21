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
    <div className="bg-blue-50 rounded-2xl shadow-lg p-6 space-y-4 border-4 border-blue-800 border-double">
      <h2 className="text-lg font-semibold text-gray-700">Route Details</h2>
      <div className="flex items-center space-x-4">
        <MapPin className="w-6 h-6 text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">Picked up from</p>
          <p className="text-md font-medium text-gray-800">
            {restaurantAddress}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Home className="w-6 h-6 text-green-500" />
        <div>
          <p className="text-sm text-gray-500">Drop off at</p>
          <p className="text-md font-medium text-gray-800">{customerAddress}</p>
        </div>
      </div>
    </div>
  );
}
