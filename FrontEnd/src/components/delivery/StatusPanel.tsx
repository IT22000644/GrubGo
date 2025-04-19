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
    <div className="border rounded-lg p-4 shadow">
      <h2 className="text-xl font-medium mb-2">Current Status</h2>
      <p className="mb-4">
        <strong>{status}</strong>
      </p>

      {status === "Assigned" && (
        <p>
          ETA to Restaurant: <strong>{formatEta(etaToRestaurant)}</strong>
        </p>
      )}

      {etaToCustomer > 0 && status === "Assigned" && (
        <p>
          ETA to Customer: <strong>{formatEta(etaToCustomer)}</strong>
        </p>
      )}

      <p>
        Expected Delivery: <strong>{formattedTime}</strong>
      </p>

      {status === "Delivered" && (
        <p className="text-green-600 font-semibold">Delivery Completed!</p>
      )}
    </div>
  );
};

export default StatusPanel;
