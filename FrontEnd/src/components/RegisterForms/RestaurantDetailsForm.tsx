/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChevronLeft,
  Clock,
  FileText,
  Loader,
  MapPin,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import React, { useState } from "react";
import { RestaurantData } from "../../features/auth/types";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import api from "../../api/api";

interface RestaurantDetailsFormProps {
  onBack: () => void;
  setShowAuthModal: (show: boolean) => void;
}

const RestaurantDetailsForm: React.FC<RestaurantDetailsFormProps> = ({
  onBack,
  setShowAuthModal,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string>("");
  const restaurantOwner = useSelector(
    (state: RootState) => state.auth.user?._id
  );
  const token = useSelector((state: RootState) => state.auth.token);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [restaurantData, setRestaurantData] = React.useState<RestaurantData>({
    name: "",
    cuisine: "",
    address: { shopNumber: "", street: "", town: "" },
    description: "",
    openingHours: "",
    phone: "",
    images: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setRestaurantData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name === "images" && files) {
      setRestaurantData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setRestaurantData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Restaurant Data Submitted:", restaurantData);

    const formData = new FormData();

    formData.append("name", restaurantData.name);
    formData.append("cuisine", restaurantData.cuisine);
    formData.append("description", restaurantData.description);
    formData.append("openingHours", restaurantData.openingHours);
    formData.append("phone", restaurantData.phone);

    // For nested address
    formData.append("address[shopNumber]", restaurantData.address.shopNumber);
    formData.append("address[street]", restaurantData.address.street);
    formData.append("address[town]", restaurantData.address.town);
    formData.append("restaurantOwner", restaurantOwner ?? "");

    console.log("Restaurant Owner:", restaurantOwner);

    // Images (array)
    restaurantData.images.forEach((file) => {
      formData.append(`images`, file);
    });

    try {
      setLoading(true);
      const response = await api.post("/restaurant/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setShowAuthModal(false);
    } catch (error) {
      setLoading(false);
      setError("Error submitting restaurant data. Please try again later.");
      console.error("Error submitting restaurant data:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

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

      {isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {isError}
        </div>
      )}

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

          <div className="space-y-4 pl-4 mt-2">
            <div className="space-y-1">
              <label
                htmlFor="address.shopNumber"
                className="text-sm font-medium text-gray-600 flex items-center"
              >
                Shop Number
              </label>
              <input
                type="text"
                id="address.shopNumber"
                name="address.shopNumber"
                onChange={handleChange}
                placeholder="Enter shop number"
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="address.street"
                className="text-sm font-medium text-gray-600 flex items-center"
              >
                Street
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                onChange={handleChange}
                placeholder="Enter street name"
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="address.town"
                className="text-sm font-medium text-gray-600 flex items-center"
              >
                Town
              </label>
              <input
                type="text"
                id="address.town"
                name="address.town"
                onChange={handleChange}
                placeholder="Enter town/city"
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>
          </div>
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
