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
  <div className="rounded-lg p-4 shadow-lg space-y-2 bg-neutral dark:bg-accent/30">
    <h2 className="text-lg font-medium text-primary">Actions</h2>

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
        className="w-full py-2 bg-success text-white rounded hover:bg-green-600"
      >
        Delivered
      </button>
    )}

    {(status === "Assigned" ||
      status === "In Transit" ||
      status === "Picked Up") && (
      <p className="text-gray-500 dark:text-white">Waiting for next step…</p>
    )}

    {status === "Delivered" && (
      <p className="text-success font-semibold">
        {" "}
        No More Actions To Be Taken!
      </p>
    )}
  </div>
);

export default ControlsPanel;
