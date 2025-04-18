import React from "react";

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
      console.log("Expected Delivery Time Raw:", expectedDeliveryTime);
      console.log("Type of expectedDeliveryTime:", typeof expectedDeliveryTime);

      if (!expectedDeliveryTime || typeof expectedDeliveryTime !== "string") {
        return "Unavailable";
      }

      const isoString = expectedDeliveryTime.trim();
      const date = new Date(isoString);

      console.log("Parsed Date Object:", date);

      if (isNaN(date.getTime())) {
        console.warn("Invalid date format:", isoString);
        return "Invalid time";
      }

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch (err) {
      console.error("Time formatting error:", err);
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
          ETA to Restaurant: <strong>{etaToRestaurant} min</strong>
        </p>
      )}

      {etaToCustomer > 0 && status !== "Delivered" && (
        <p>
          ETA to Customer: <strong>{etaToCustomer} min</strong>
        </p>
      )}

      <p>
        Expected Delivery: <strong>{formattedTime}</strong>
      </p>

      {status === "Delivered" && (
        <p className="text-green-600 font-semibold">✅ Delivery Completed!</p>
      )}
    </div>
  );
};

export default StatusPanel;
