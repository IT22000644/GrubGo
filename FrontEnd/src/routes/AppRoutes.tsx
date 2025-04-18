import { Routes, Route } from "react-router-dom";
import Home from "../pages/main/Home";
import About from "../pages/main/About";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Profile from "../pages/user/Profile";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
