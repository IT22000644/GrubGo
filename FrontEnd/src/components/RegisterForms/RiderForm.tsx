import { Mail, User, Lock, Phone, MapPin, CreditCard } from "lucide-react";
import React, { useState } from "react";
import { UserData } from "../../features/auth/types";

interface RiderFormProps {
  userData: UserData;
  setRiderData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: (userData: UserData) => Promise<void>;
  onBack: () => void;
}

const RiderForm: React.FC<RiderFormProps> = ({ onBack, onSubmit }) => {
  const [riderData, setRiderData] = useState<UserData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    role: "driver",
    vehicleType: "",
    vehicleModel: "",
    vehicleColor: "",
    vehicleNumber: "",
    licenseNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRiderData({
      ...riderData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(riderData);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-md font-bold text-gray-800 my-6 flex items-center">
        Delivery Rider Registration
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="h-[400px] overflow-y-auto space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <User size={15} className="mr-1 text-gray-500" />
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={riderData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="userName"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <User size={15} className="mr-1 text-gray-500" />
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="username"
              value={riderData.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
              value={riderData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="passwordHash"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Lock size={15} className="mr-1 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={riderData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Phone size={15} className="mr-1 text-gray-500" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={riderData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="licenseNumber"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <CreditCard size={15} className="mr-1 text-gray-500" />
              License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={riderData.licenseNumber}
              onChange={handleChange}
              placeholder="Enter license number"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="vehicleType"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={riderData.vehicleType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            >
              <option value="">Select vehicle type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="vehicleModel"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Vehicle Model
            </label>
            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              value={riderData.vehicleModel}
              onChange={handleChange}
              placeholder="Enter vehicle model"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="vehicleColor"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Vehicle Color
            </label>
            <input
              type="text"
              id="vehicleColor"
              name="vehicleColor"
              value={riderData.vehicleColor}
              onChange={handleChange}
              placeholder="Enter vehicle color"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="vehicleNumber"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={riderData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter vehicle number"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiderForm;
