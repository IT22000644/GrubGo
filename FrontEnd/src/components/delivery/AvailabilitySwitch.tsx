import React, { useState, useEffect } from "react";

const STORAGE_KEY = "driverAvailability";

const AvailabilitySwitch: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isAvailable));
  }, [isAvailable]);

  const handleToggle = () => {
    setIsAvailable((prev) => !prev);
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
