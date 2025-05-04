import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/Order/OrderCard";
import api from "../../api/api";
import type { Order } from "../../components/Order/types";
import ReviewForm from "../../components/Review/ReviewForm";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const statusOptions = ["done", "pending", "completed"];

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("done");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  const customerId = useSelector((state: RootState) => state.auth.user?._id);
  const token = useSelector((state: RootState) => state.auth.token);
  
  console.log(token);

  // const customerId = localStorage.getItem('customerId') || "6611e8f4a1fbb93be88a1a5c";

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/order/customer/${customerId}`, {
        params: status ? { status } : {},
      });

      const ordersWithDetails = await Promise.all(
        res.data.map(async (order: Order) => {
          try {
            const restaurantRes = await api.get(
              `/restaurant/${order.restaurantId}`
            );
            const restaurantData = restaurantRes.data?.restaurant;

            return {
              ...order,
              restaurantName: restaurantData?.name || "Unknown Restaurant",
              restaurantImage: restaurantData?.images?.[0] || null,
            };
          } catch (err) {
            console.error(
              `Failed to fetch restaurant ${order.restaurantId}`,
              err
            );
            return {
              ...order,
              restaurantName: "Unknown Restaurant",
              restaurantImage: null,
            };
          }
        })
      );

      setOrders(ordersWithDetails);
    } catch (err: any) {
      setOrders([]);
      if (err.response?.status === 404) {
        setError("No orders found.");
      } else {
        setError(err.response?.data?.message || "Error fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const handleCheckout = async (orderId: string) => {
    try {
      const res = await api.post(`/order/${orderId}/checkout/`);
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout.");
    }
  };

  const markOrderAsReviewed = async (orderId: string) => {
    try {
      await api.put(`/order/isreviewed/${orderId}`);
    } catch (error) {
      console.error("Failed to mark order as reviewed:", error);
    }
  };

  const handleReviewClick = (orderId: string) => {
    const orderToReview = orders.find((o) => o._id === orderId);
    if (orderToReview) setReviewingOrder(orderToReview);
  };

  const trackthedelivary = async (orderId: string) => {
    navigate("/customer-tracking-loader", { state: { orderId } });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${month} ${day} at ${time}`;
  };

  const getStatusBadge = (status: string) => {
    const base = "text-xs font-medium px-3 py-1 rounded-full inline-block";
    switch (status) {
      case "pending":
        return `${base} bg-amber-100 text-amber-800`;
      case "completed":
        return `${base} bg-blue-100 text-blue-800`;
      case "done":
        return `${base} bg-emerald-100 text-emerald-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Your Orders
      </h1>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {statusOptions.map((option) => (
          <button
            key={option}
            onClick={() => setStatus(option)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              status === option
                ? option === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-orange-400 hover:bg-orange-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {option === "completed"
              ? "Delivery"
              : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setStatus("")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            status === ""
              ? "bg-orange-400 hover:bg-orange-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          All Orders
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-orange-400 animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Finding your orders...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-5 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center">
          <div className="mb-5 flex justify-center">
            <svg
              className="h-20 w-20 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
        </div>
      )}

      <div className="h-[65vh] overflow-y-auto space-y-6 sm:space-y-8 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onCheckout={handleCheckout}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            onReview={handleReviewClick}
            onMarkAsReviewed={markOrderAsReviewed}
            trackthedelivary={trackthedelivary}
          />
        ))}
        {reviewingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-lg w-full relative">
              <button
                onClick={() => setReviewingOrder(null)}
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                ✕
              </button>
              <ReviewForm
                restaurantId={reviewingOrder.restaurantId}
                foodId={reviewingOrder.items[0]?.foodItemId}
                userId={reviewingOrder.customerId}
                onClose={() => setReviewingOrder(null)}
                onReviewSubmit={() => markOrderAsReviewed(reviewingOrder._id)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
