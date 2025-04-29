import { useImperativeHandle, forwardRef } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export interface DriversAvailabilityRef {
  checkAvailability: () => void;
}

interface DriversAvailabilityProps {
  orderId: string;
  onSuccess: () => void;
}

const DriversAvailability = forwardRef<
  DriversAvailabilityRef,
  DriversAvailabilityProps
>(({ onSuccess }, ref) => {
  const token = useSelector((state: RootState) => state.auth.token);

  useImperativeHandle(ref, () => ({
    checkAvailability: async () => {
      try {
        const response = await api.get("/user/active-riders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data.length > 0) {
          onSuccess();
        }
      } catch (error) {
        console.error("No active riders or server error:", error);
      }
    },
  }));

  return null;
});

export default DriversAvailability;
