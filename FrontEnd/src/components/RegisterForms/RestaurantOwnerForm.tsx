import { Mail, User, Lock, Phone, ChevronRight } from "lucide-react";
import React from "react";

interface RestaurantOwnerData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface RestaurantOwnerFormProps {
  ownerData: RestaurantOwnerData;
  setOwnerData: React.Dispatch<React.SetStateAction<RestaurantOwnerData>>;
  onSubmit: (data: RestaurantOwnerData) => void;
  onBack: () => void;
}

const RestaurantOwnerForm: React.FC<RestaurantOwnerFormProps> = ({
  ownerData,
  setOwnerData,
  onSubmit,
  onBack,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerData({
      ...ownerData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(ownerData);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-md font-bold text-gray-800 my-6 flex items-center">
        Restaurant Owner Information
      </h2>

      <div className="flex items-center mb-6">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 ">
            Step 1 of 2: Owner Details
          </p>
        </div>
      </div>

      <div className="h-96 overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <User size={15} className="mr-1 text-gray-500" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Mail size={15} className="mr-1 text-gray-500" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Lock size={15} className="mr-1 text-gray-500" />
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <Phone size={15} className="mr-1 text-gray-500" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1 (123) 456-7890"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="flex justify-center item-center w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          onClick={handleSubmit}
        >
          <span>Next</span>
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RestaurantOwnerForm;
