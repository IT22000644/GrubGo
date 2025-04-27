import React from "react";

const formatEta = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

interface Props {
  status: string;
  etaToRestaurant: number;
  etaToCustomer: number;
  expectedDeliveryTime: string;
}

const StatusPanel: React.FC<Props> = ({
  status,
  etaToRestaurant,
  etaToCustomer,
  expectedDeliveryTime,
}) => {
  const formattedTime = (() => {
    try {
      if (!expectedDeliveryTime || typeof expectedDeliveryTime !== "string") {
        return "Unavailable";
      }

      const isoString = expectedDeliveryTime.trim();
      const date = new Date(isoString);

      if (isNaN(date.getTime())) {
        return "Invalid time";
      }

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch (err) {
      return "Error";
    }
  })();

  return (
    <div className="rounded-2xl bg-neutral dark:bg-accent/30 shadow-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Delivery Status
            </h2>
            <p className="text-base text-orange-600 font-semibold mt-1">
              {status}
            </p>
          </div>

          {status === "Assigned" && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                ETA to Restaurant:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatEta(etaToRestaurant)}
                </span>
              </p>
              {etaToCustomer > 0 && (
                <p>
                  ETA to Customer:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatEta(etaToCustomer)}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Expected Delivery
            </h2>
            <p className="text-sm text-gray-800 mt-1">
              <span className="font-semibold text-black dark:text-white">
                {formattedTime}
              </span>
            </p>
          </div>

          {status === "Delivered" && (
            <div className="text-success font-bold text-sm">
              Delivery Completed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
