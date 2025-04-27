// File: src/components/RegistrationForm.tsx
import React, { useState } from "react";
import UserForm from "../../components/RegisterForms/UserForm";
import RiderForm from "../../components/RegisterForms/RiderForm";
import RestaurantOwnerForm from "../../components/RegisterForms/RestaurantOwnerForm";
import RestaurantDetailsForm from "../../components/RegisterForms/RestaurantDetailsForm";
import RoleSelection from "../../components/RegisterForms/RoleSelection";
import { Loader } from "../../pages/common/loader";

type Role = "user" | "rider" | "restaurant";

// Define interfaces for our form data
interface UserData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

interface RiderData extends UserData {
  vehicleType: string;
  licenseNumber: string;
}

interface RestaurantOwnerData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface RestaurantData {
  name: string;
  address: string;
  cuisine: string;
  openingHours: string;
  description: string;
}

interface RegisterProps {
  switchToLogin: () => void;
}

export const Register = ({ switchToLogin }: RegisterProps) => {
  // State for selected role
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // State for form data
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [restaurantStep, setRestaurantStep] = useState<1 | 2>(1);

  const [isLoading, setIsLoading] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call to register user
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsRegistered(true);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle restaurant owner form completion
  const handleOwnerFormComplete = () => {
    setRestaurantStep(2);
  };

  const handleReset = () => {
    setSelectedRole(null);
    setRestaurantStep(1);
    setIsRegistered(false);
  };

  if (isRegistered) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Registration Successful!
        </h2>
        <p className="mb-6">
          Thank you for registering with our restaurant service!
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register Another Account
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-md mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-2 text-center">Sign Up</h1>

      {!selectedRole && <RoleSelection onRoleSelect={handleRoleSelect} />}

      {/* User Registration Form */}
      {selectedRole === "user" && (
        <UserForm
          userData={userData}
          setUserData={setUserData}
          onSubmit={handleUserSubmit}
          onBack={() => setSelectedRole(null)}
        />
      )}

      {/* Rider Registration Form */}
      {selectedRole === "rider" && (
        <RiderForm
          riderData={riderData}
          setRiderData={setRiderData}
          onSubmit={handleUserSubmit}
          onBack={() => setSelectedRole(null)}
        />
      )}

      {/* Restaurant Registration Form - Step 1: Owner Details */}
      {selectedRole === "restaurant" && restaurantStep === 1 && (
        <RestaurantOwnerForm
          onSubmit={handleOwnerFormComplete}
          onBack={() => setSelectedRole(null)}
        />
      )}

      {/* Restaurant Registration Form - Step 2: Restaurant Details */}
      {selectedRole === "restaurant" && restaurantStep === 2 && (
        <RestaurantDetailsForm onBack={() => setRestaurantStep(1)} />
      )}

      <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-primary hover:text-black underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};
