import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/main/Home";
import About from "../pages/main/About";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Profile from "../pages/user/Profile";

import MainLayout from "../layouts/MainLayout";

import DeliveryAssign from "../pages/delivery/DeliveryAssign";
import TempDelivery from "../pages/delivery/Delivery-temp";
import DeliveryTracking from "../pages/delivery/DeliveryTracking";
import CustomerTracking from "../pages/delivery/CustomerTracking";
import NotFound from "../pages/common/NotFound";
import Contact from "../pages/main/ContactUs";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/delivery" element={<DeliveryAssign />} />
        <Route path="/delivery-temp" element={<TempDelivery />} />
        <Route path="/delivery-tracking" element={<DeliveryTracking />} />
        <Route path="/customer-tracking" element={<CustomerTracking />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
