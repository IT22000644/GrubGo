import { Routes, Route } from "react-router-dom";
import Home from "../pages/main/Home";
import About from "../pages/main/About";
// import Login from "../features/auth/Login"; // example future page
// import ProtectedRoute from "../components/ProtectedRoute"; // optional

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      {/* Example future routes:
      <Route path="/login" element={<Login />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      /> */}

      {/* 404 Page - Optional */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
