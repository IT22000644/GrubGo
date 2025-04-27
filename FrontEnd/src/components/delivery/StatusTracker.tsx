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
    <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral dark:bg-accent/30 shadow-md p-4 rounded-md overflow-x-auto ">
      {STATUSES.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div
            key={status}
            className={clsx(
              "flex items-center space-x-2 transition-all duration-300",
              isCompleted && "text-orange-500 dark:text-white font-semibold",
              isActive && "text-success font-semibold scale-105",
              isUpcoming && "text-orange-500 dark:text-white font-semibold"
            )}
          >
            <div
              className={clsx(
                "w-4 h-4 rounded-full ",
                isCompleted &&
                  "bg-primary/30 dark:bg-accent/50 dark:border-2 dark:border-orange-300 ",
                isActive && "bg-green-300 border-2 border-green-800",
                isUpcoming &&
                  "bg-primary/30 dark:bg-accent/50 dark:border-2 dark:border-orange-300"
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
