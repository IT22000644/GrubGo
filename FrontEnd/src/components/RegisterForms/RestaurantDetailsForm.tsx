import {
  ChevronLeft,
  Clock,
  FileText,
  MapPin,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import React from "react";

interface RestaurantData {
  name: string;
  address: string;
  cuisine: string;
  openingHours: string;
  description: string;
}

interface RestaurantDetailsFormProps {
  restaurantData: RestaurantData;
  setRestaurantData: React.Dispatch<React.SetStateAction<RestaurantData>>;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const RestaurantDetailsForm: React.FC<RestaurantDetailsFormProps> = ({
  restaurantData,
  setRestaurantData,
  onSubmit,
  onBack,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRestaurantData({
      ...restaurantData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-md font-bold text-gray-800 my-6 flex items-center">
        Restaurant Information
      </h2>

      <div className="flex items-center mb-6">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600">
            Step 2 of 2: Restaurant Details
          </p>
        </div>
      </div>

      <div className="h-96 overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Store size={15} className="mr-1 text-gray-500" />
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your restaurant name"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <MapPin size={15} className="mr-1 text-gray-500" />
            Restaurant Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Enter full restaurant address"
            rows={3}
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="cuisine"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <UtensilsCrossed size={15} className="mr-1 text-gray-500" />
            Cuisine Type
          </label>
          <select
            id="cuisine"
            name="cuisine"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors appearance-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">Select Cuisine Type</option>
            <option value="italian">Italian</option>
            <option value="chinese">Chinese</option>
            <option value="indian">Indian</option>
            <option value="mexican">Mexican</option>
            <option value="japanese">Japanese</option>
            <option value="thai">Thai</option>
            <option value="french">French</option>
            <option value="american">American</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="openingHours"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Clock size={15} className="mr-1 text-gray-500" />
            Opening Hours
          </label>
          <input
            type="text"
            id="openingHours"
            name="openingHours"
            placeholder="e.g., Mon-Fri: 9am-10pm, Sat-Sun: 10am-11pm"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <FileText size={15} className="mr-1 text-gray-500" />
            Restaurant Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell customers about your restaurant..."
            rows={4}
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          className="flex justify-center item-center w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          onClick={onBack}
        >
          <ChevronLeft size={18} className="mr-1" />
          <span>Back</span>
        </button>
        <button
          type="submit"
          className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          onClick={onSubmit}
        >
          Register Restaurant
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetailsForm;
