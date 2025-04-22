import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/main/Home";
import About from "../pages/main/About";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Profile from "../pages/user/Profile";

import MainLayout from "../layouts/MainLayout";

import DeliveryAssign from "../pages/delivery/DeliveryAssign";
import DeliveryControl from "../pages/delivery/DeliveryControl";
import DeliveryTracking from "../pages/delivery/DeliveryTracking";
import CustomerTracking from "../pages/delivery/CustomerTracking";
import DriverView from "../pages/delivery/DriverView";
import NotFound from "../pages/common/NotFound";
import Contact from "../pages/main/ContactUs";
import { AllRestaurants } from "../pages/restaurent/allRestaurants/AllRestaurants";
import RestaurantDetails from "../pages/restaurent/restaurantDetails/restaurantDetails";

import CartPage from "../pages/order/CartPage";

import RestaurantAdminMain from "../pages/user/restaurantAdmin/restaurantAdminMain";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/allRestaurants" element={<AllRestaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        <Route path="/delivery" element={<DeliveryAssign />} />

        <Route path="/cart" element={<CartPage customerId="customer123" />} />

        <Route path="/delivery-assign" element={<DeliveryAssign />} />
        <Route path="/delivery-control" element={<DeliveryControl />} />
        <Route path="/delivery-tracking" element={<DeliveryTracking />} />
        <Route path="/customer-tracking" element={<CustomerTracking />} />
        <Route path="/driver-home" element={<DriverView />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin/restaurant"
        element={
          <ProtectedRoute>
            <RestaurantAdminMain />
          </ProtectedRoute>
        }
      />

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
