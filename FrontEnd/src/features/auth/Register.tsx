// File: src/components/RegistrationForm.tsx
import React, { useState } from "react";
import UserForm from "../../components/RegisterForms/UserForm";
import RiderForm from "../../components/RegisterForms/RiderForm";
import RestaurantOwnerForm from "../../components/RegisterForms/RestaurantOwnerForm";
import RestaurantDetailsForm from "../../components/RegisterForms/RestaurantDetailsForm";
import RoleSelection from "../../components/RegisterForms/RoleSelection";
import { Loader } from "../../pages/common/loader";
import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "./authSlice";

type Role = "user" | "rider" | "restaurant";

// Define interfaces for our form data
interface UserData {
  fullName: string;
  address: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  role: string;
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
  const dispatch = useAppDispatch();
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

  const [riderData, setRiderData] = useState<RiderData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    vehicleType: "",
    licenseNumber: "",
  });

  const [ownerData, setOwnerData] = useState<RestaurantOwnerData>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: "",
    address: "",
    cuisine: "",
    openingHours: "",
    description: "",
  });

  // State for multi-step form (restaurant registration)
  const [restaurantStep, setRestaurantStep] = useState<1 | 2>(1);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Success state
  const [isRegistered, setIsRegistered] = useState(false);

  // Handle role selection
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  // Handle user registration
  const handleUserSubmit = async (userData: UserData) => {
    setIsLoading(true);

    console.log("User Data:", userData);

    try {
      // Dispatch registerUser thunk action
      const actionResult = await dispatch(registerUser(userData));

      // Check if registration was successful (check if the action was fulfilled)
      if (registerUser.fulfilled.match(actionResult)) {
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

  // Handle rider registration
  const handleRiderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call to register rider
      const response = await fetch("/api/riders/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(riderData),
      });

      if (response.ok) {
        setIsRegistered(true);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error registering rider:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle restaurant owner form completion
  const handleOwnerFormComplete = (data: RestaurantOwnerData) => {
    setOwnerData(data);
    setRestaurantStep(2);
  };

  // Handle complete restaurant registration
  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First API call to register restaurant owner
      const ownerResponse = await fetch("/api/restaurant-owners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ownerData),
      });

      if (!ownerResponse.ok) {
        throw new Error("Owner registration failed");
      }

      const ownerResult = await ownerResponse.json();
      const ownerId = ownerResult._id; // MongoDB ObjectId from first response

      // Second API call to register restaurant with owner ID
      const restaurantResponse = await fetch("/api/restaurants/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...restaurantData,
          ownerId,
        }),
      });

      if (restaurantResponse.ok) {
        setIsRegistered(true);
      } else {
        throw new Error("Restaurant registration failed");
      }
    } catch (error) {
      console.error("Error registering restaurant:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to start over
  const handleReset = () => {
    setSelectedRole(null);
    setRestaurantStep(1);
    setIsRegistered(false);
  };

  // Show success message when registered
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

  // Show loader when submitting form
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
          onSubmit={handleRiderSubmit}
          onBack={() => setSelectedRole(null)}
        />
      )}

      {/* Restaurant Registration Form - Step 1: Owner Details */}
      {selectedRole === "restaurant" && restaurantStep === 1 && (
        <RestaurantOwnerForm
          ownerData={ownerData}
          setOwnerData={setOwnerData}
          onSubmit={handleOwnerFormComplete}
          onBack={() => setSelectedRole(null)}
        />
      )}

      {/* Restaurant Registration Form - Step 2: Restaurant Details */}
      {selectedRole === "restaurant" && restaurantStep === 2 && (
        <RestaurantDetailsForm
          restaurantData={restaurantData}
          setRestaurantData={setRestaurantData}
          onSubmit={handleRestaurantSubmit}
          onBack={() => setRestaurantStep(1)}
        />
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
