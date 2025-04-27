import {
  ChevronLeft,
  Clock,
  FileText,
  MapPin,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import React from "react";

interface RestaurantDetailsFormProps {
  onBack: () => void;
}

const RestaurantDetailsForm: React.FC<RestaurantDetailsFormProps> = ({
  onBack,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [restaurantData, setRestaurantData] = React.useState<FormData>(() => {
    const formData = new FormData();
    formData.append("name", "");
    formData.append("address", "");
    formData.append("description", "");
    formData.append("phone", "");
    return formData;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurantData((prevData) => {
      const updatedData = new FormData();
      prevData.forEach((value, key) => {
        updatedData.append(key, value);
      });
      updatedData.set(name, value);
      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can handle the form submission logic
    console.log("Form submitted");
    console.log("Form Data:", restaurantData);
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
        <div className="h-[400px] overflow-y-auto space-y-5">
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Enter full restaurant address"
              rows={3}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
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
              onChange={handleChange}
              placeholder="Tell customers about your restaurant..."
              rows={4}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="space-y-1 mt-4">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Clock size={15} className="mr-1 text-gray-500" />
            Restaurant Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            onChange={handleChange}
            placeholder="+1 (123) 456-7890"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1 mt-4">
          <label
            htmlFor="images"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <UtensilsCrossed size={15} className="mr-1 text-gray-500" />
            Restaurant Images (optional)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            onChange={handleChange}
            multiple
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
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
          onClick={handleSubmit}
        >
          Register Restaurant
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetailsForm;
