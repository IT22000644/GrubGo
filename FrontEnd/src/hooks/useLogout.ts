// hooks/useLogout.ts
import { useAppDispatch, useAppSelector } from "../app/hooks"; // adjust path
import { RootState } from "../app/store";
import { logoutUser, logout } from "../features/auth/authSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);

  const handleLogout = async () => {
    try {
      if (token) {
        await dispatch(logoutUser({ token })).unwrap();
      }
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return handleLogout;
};
