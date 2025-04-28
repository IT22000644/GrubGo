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
import { UserData, RestaurantData } from "./types";

type Role = "user" | "rider" | "restaurant";

// Define interfaces for our form data
interface RegisterProps {
  switchToLogin: () => void;
}

export const Register = ({ switchToLogin }: RegisterProps) => {
  const dispatch = useAppDispatch();
  // State for selected role
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // State for form data
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    address: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    role: "customer",
  });

  const [riderData, setRiderData] = useState<UserData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    role: "driver",
    licenseNumber: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleColor: "",
    vehicleNumber: "",
  });

  const [ownerData, setOwnerData] = useState<UserData>({
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    role: "restaurant_admin",
  });

  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: "",
    address: "",
    cuisine: "",
    openingHours: "",
    description: "",
    phone: "",
    images: [],
  });

  // State for multi-step form (restaurant registration)
  const [restaurantStep, setRestaurantStep] = useState<1 | 2>(1);

  const [isLoading, setIsLoading] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);

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

  // Handle restaurant owner form completion
  const handleOwnerFormComplete = async (ownerData: UserData) => {
    setIsLoading(true);

    console.log("User Data:", ownerData);
    try {
      const actionResult = await dispatch(registerUser(ownerData));
      if (registerUser.fulfilled.match(actionResult)) {
        setOwnerData(ownerData);
        setRestaurantStep(2);
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
        {/* <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register Another Account
        </button> */}
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
          userData={riderData}
          setRiderData={setRiderData}
          onSubmit={handleUserSubmit}
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
