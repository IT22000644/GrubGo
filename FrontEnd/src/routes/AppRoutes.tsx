import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/main/Home";
import About from "../pages/main/About";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Profile from "../pages/user/Profile";

import MainLayout from "../layouts/MainLayout";

import DeliveryAssign from "../pages/delivery/DeliveryAssign";
import DeliveryTracking from "../pages/delivery/DeliveryTracking";
import CustomerTracking from "../pages/delivery/CustomerTracking";
import DeliveryDataLoader from "../pages/delivery/DeliveryDataLoader";
import CustomerTrackingLoader from "../pages/delivery/CustomerTrackingLoader";
import DriverTrackingLoader from "../pages/delivery/DriverTrackingLoader";
import DriverView from "../pages/delivery/DriverView";

import NotFound from "../pages/common/NotFound";
import Contact from "../pages/main/ContactUs";
import { AllRestaurants } from "../pages/restaurant/allRestaurants/AllRestaurants";

import OrderPage from "../pages/order/OrderPage";
import CartPage from "../pages/order/CartPage";
import { ManageRestaurant } from "../pages/restaurant/manageRestaurant/ManageRestaurant";
import AdminLayout from "../layouts/AdminLayout";
import { AdminDashboard } from "../pages/admin/adminDashboard";
import { AdminRestaurants } from "../pages/restaurant/adminRestaurants/AdminRestaurants";

import RestaurantOrderPage from "../pages/restaurant/showingorders/Orderpage";
import RestaurantDetails from "../pages/restaurant/restaurantDetails/restaurantDetails";

import { AdminUser } from "../pages/user/adminUser/AdminUser";
import Payment from "../pages/admin/Payement";

//import OrderPage from "../pages/restaurent/showingorders/Orderpage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/allRestaurants" element={<AllRestaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        <Route path="/restaurant/manage" element={<ManageRestaurant />} />

        <Route path="/restaurant/orders" element={<RestaurantOrderPage />} />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/orders"
          element={<OrderPage />}
        />

        <Route path="/delivery-assign" element={<DeliveryAssign />} />
        <Route path="/delivery-tracking" element={<DeliveryTracking />} />
        <Route path="/customer-tracking" element={<CustomerTracking />} />
        <Route path="/delivery-loader" element={<DeliveryDataLoader />} />
        <Route
          path="/customer-tracking-loader"
          element={<CustomerTrackingLoader />}
        />
        <Route
          path="/driver-tracking-loader"
          element={<DriverTrackingLoader />}
        />

        <Route
          path="/driver-activity"
          element={
            <ProtectedRoute>
              <DriverView />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="restaurant" element={<AdminRestaurants />} />
        <Route path="user" element={<AdminUser />} />

        <Route path="payments" element={<Payment />} />

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
