import { Mail, User, Lock, Phone, MapPin } from "lucide-react";
import React, { useState } from "react";
import { UserData } from "../../features/auth/types";

// interface UserData {
//   fullName: string;
//   address: string;
//   email: string;
//   username: string;
//   password: string;
//   phoneNumber: string;
//   role: string;
// }

interface UserFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: (userData: UserData) => Promise<void>;
  onBack: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onBack, onSubmit }) => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    address: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    role: "customer",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userData);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-md font-bold text-gray-800 my-2 flex items-center">
        Customer Registration
      </h2>

      <div className="space-y-5">
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
              value={userData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <User size={15} className="mr-1 text-gray-500" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
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
              value={userData.email}
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
              value={userData.password}
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
              value={userData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <MapPin size={15} className="mr-1 text-gray-500" />
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={userData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows={3}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
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
          onClick={handleSubmit}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default UserForm;
