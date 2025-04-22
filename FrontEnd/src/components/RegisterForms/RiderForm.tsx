import {
  Mail,
  User,
  Lock,
  Phone,
  MapPin,
  Truck,
  CreditCard,
} from "lucide-react";
import React from "react";

interface RiderData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  vehicleType: string;
  licenseNumber: string;
}

interface RiderFormProps {
  riderData: RiderData;
  setRiderData: React.Dispatch<React.SetStateAction<RiderData>>;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const RiderForm: React.FC<RiderFormProps> = ({
  riderData,
  setRiderData,
  onSubmit,
  onBack,
}) => {
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

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-md font-bold text-gray-800 my-6 flex items-center">
        Delivery Rider Registration
      </h2>

      <form>
        <div className="h-[400px] overflow-y-auto space-y-5">
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
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="vehicleType"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Truck size={15} className="mr-1 text-gray-500" />
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
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
              <option value="">Select Vehicle Type</option>
              <option value="bicycle">Bicycle</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
              <option value="scooter">Scooter</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="licenseNumber"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <CreditCard size={15} className="mr-1 text-gray-500" />
              License Number (if applicable)
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              placeholder="Enter license number"
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
            onClick={onSubmit}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiderForm;
