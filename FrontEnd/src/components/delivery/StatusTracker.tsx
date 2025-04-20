import React from "react";
import clsx from "clsx";

const STATUSES = [
  "Assigned",
  "In Transit",
  "Arrived Restaurant",
  "Picked Up",
  "In Transit - Picked Up",
  "Arrived Customer",
  "Delivered",
];

interface StatusTrackerProps {
  currentStatus: string;
}

const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentIndex = STATUSES.indexOf(currentStatus);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-white shadow-md p-4 rounded-2xl overflow-x-auto border-4 border-blue-800">
      {STATUSES.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div
            key={status}
            className={clsx(
              "flex items-center space-x-2 transition-all duration-300",
              isCompleted && "text-orange-500",
              isActive && "text-green-600 font-semibold scale-105",
              isUpcoming && "text-blue-500"
            )}
          >
            <div
              className={clsx(
                "w-4 h-4 rounded-full ",
                isCompleted && "bg-orange-200 border-2 border-orange-300 ",
                isActive && "bg-green-500 border-2 border-green-800",
                isUpcoming && "bg-blue-100 border-2 border-blue-300"
              )}
            ></div>
            <span className="whitespace-nowrap text-sm">{status}</span>
            {index < STATUSES.length - 1 && (
              <div className="w-4 h-0.5 bg-gray-300 mx-2"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTracker;
