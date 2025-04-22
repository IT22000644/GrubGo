import { Mail, User, Lock, Phone, MapPin } from "lucide-react";
import React from "react";

interface UserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

interface UserFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  userData,
  setUserData,
  onSubmit,
  onBack,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-md font-bold text-gray-800 my-6 flex items-center">
        Customer Registration
      </h2>

      <form className="space-y-5">
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
            placeholder="Enter your full address"
            rows={3}
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
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

export default UserForm;
