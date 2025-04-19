import React from "react";

interface Props {
  status: string;
  onPickedUp: () => void;
  onDelivered: () => void;
}

const ControlsPanel: React.FC<Props> = ({
  status,
  onPickedUp,
  onDelivered,
}) => (
  <div className="border rounded-lg p-4 shadow space-y-2">
    <h2 className="text-lg font-medium">Actions</h2>

    {status === "Arrived Restaurant" && (
      <button
        onClick={onPickedUp}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Pick Up
      </button>
    )}

    {status === "Arrived Customer" && (
      <button
        onClick={onDelivered}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Delivered
      </button>
    )}

    {(status === "Assigned" ||
      status === "In Transit" ||
      status === "Picked Up") && (
      <p className="text-gray-600">Waiting for next step…</p>
    )}

    {status === "Delivered" && <p className="text-green-600"> Done!</p>}
  </div>
);

export default ControlsPanel;
