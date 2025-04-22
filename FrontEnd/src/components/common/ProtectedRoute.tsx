import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAppSelector((state: any) => state.user.isLoggedIn);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
