import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { updateRiderStatus } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";

const AvailabilitySwitch: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  console.log("User from Redux:", user);
  console.log("Token from Redux:", token);

  // ❗ No local state for isAvailable anymore, take from Redux directly:
  const isAvailable = user?.riderDetails?.isAvailable ?? false;

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not available"));
      }
    });
  };

  const handleToggle = async () => {
    const newAvailability = !isAvailable;

    if (!user || !token) {
      console.error("User or token missing");
      return;
    }

    const { lat, lng } = await getCurrentLocation();

    try {
      console.log("Toggling availability to:", newAvailability);
      await dispatch(
        updateRiderStatus({
          id: user._id,
          isAvailable: newAvailability,
          location: { lat, lng },
          token,
        })
      ).unwrap();

      // ❗ No need to manually update isAvailable, Redux will update it inside authSlice
      console.log("Availability updated successfully");
    } catch (error) {
      console.error("Failed to update rider status:", error);
    }
  };

  return (
    <div className="inline-flex items-center space-x-3">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isAvailable}
          onChange={handleToggle}
        />
        <div
          className="w-11 h-6 shadow-lg bg-gray-300 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-primary dark:peer-checked:bg-accent relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5
         after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"
        ></div>
      </label>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {isAvailable ? "Available" : "Unavailable"}
      </span>
    </div>
  );
};

export default AvailabilitySwitch;
