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
  <div className="border-4 border-blue-800 border-double rounded-lg p-4 shadow space-y-2 bg-blue-50">
    <h2 className="text-lg font-medium text-orange-600">Actions</h2>

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
      <p className="text-orange-600">Waiting for next step…</p>
    )}

    {status === "Delivered" && (
      <p className="text-green-600"> No More Actions To Be Taken!</p>
    )}
  </div>
);

export default ControlsPanel;
