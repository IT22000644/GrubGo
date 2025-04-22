import { Bike, Store, User } from "lucide-react";
import React, { useState } from "react";

interface RoleSelectionProps {
  onRoleSelect: (role: "user" | "rider" | "restaurant") => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const handleSelect = (role: any) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h2 className="text-sm font-bold my-4 text-left">Select your role</h2>

      <button
        onClick={() => handleSelect("user")}
        className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium transition-all duration-200 shadow-sm w-full
          ${
            selectedRole === "user"
              ? "bg-blue-600 text-white ring-4 ring-primary-200"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-primary/10"
          }`}
      >
        <User size={20} />
        <span>Customer</span>
      </button>

      <button
        onClick={() => handleSelect("rider")}
        className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium transition-all duration-200 shadow-sm w-full
          ${
            selectedRole === "rider"
              ? "bg-green-600 text-white ring-4 ring-primary-200"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-primary/10"
          }`}
      >
        <Bike size={20} />
        <span>Delivery Rider</span>
      </button>

      <button
        onClick={() => handleSelect("restaurant")}
        className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium transition-all duration-200 shadow-sm w-full
          ${
            selectedRole === "restaurant"
              ? "bg-purple-600 text-white ring-4 ring-primary-200"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-primary/10"
          }`}
      >
        <Store size={20} />
        <span>Restaurant Owner</span>
      </button>
    </div>
  );
};

export default RoleSelection;
