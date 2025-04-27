import React from "react";
import { useNavigate } from "react-router-dom";

const JudaButton: React.FC = () => {
  const navigate = useNavigate();
  const orderId = "680db93d802387aabfec173a";

  const handleLoad = () => {
    navigate("/tracking-loader", { state: { orderId } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Deliveries Data Loader
        </h2>
        <p className="text-center text-gray-700 mb-4">
          Click below to load data for Order:
        </p>
        <p className="text-center font-mono text-lg text-gray-900 mb-8">
          {orderId}
        </p>
        <button
          onClick={handleLoad}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Load Order Data
        </button>
      </div>
    </div>
  );
};

export default JudaButton;
