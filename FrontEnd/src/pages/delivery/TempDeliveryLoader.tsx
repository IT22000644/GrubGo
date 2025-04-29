// src/pages/TempDeliveryLoader.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TempDeliveryLoader() {
  const navigate = useNavigate();

  useEffect(() => {
    const hardcodedOrderId = "680db93d802387aabfec173a";

    navigate("/delivery-loader", {
      state: { orderId: hardcodedOrderId },
    });
  }, [navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-semibold">
        Redirecting to Delivery Loader...
      </h1>
    </div>
  );
}
