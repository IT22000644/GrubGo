import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface OrderItem {
  _id: string;
  foodItemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerId: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "process" | "preparing" | "ready" | "completed" | string;
  iscompleted: boolean;
  Paymentstatus: string;
  address: string;
  createdAt: string;
}

const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "process":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    }
  };

  return (
    <span
      className={`${getStatusStyle()} text-xs font-medium px-3 py-1 rounded-full border`}
    >
      {status.toUpperCase()}
    </span>
  );
};

const OrderCard: React.FC<{
  order: Order;
  onStatusChange: (id: string, status: Order["status"]) => void;
  compact?: boolean;
}> = ({ order, onStatusChange, compact = false }) => {
  const navigate = useNavigate();

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const calculateItemTotal = (item: OrderItem) => item.quantity * item.price;

  const handleSetPreparing = async () => {
    try {
      await api.put(`/order/status/preparing/${order._id}`);
      onStatusChange(order._id, "preparing");
    } catch (error) {
      console.error("Failed to set to preparing", error);
    }
  };

  const handleSetCompleted = async () => {
    try {
      await api.put(`/order/status/completed/${order._id}`);
      onStatusChange(order._id, "completed");
      navigate("/delivery-loader", { state: { orderId: order._id } });
    } catch (error) {
      console.error("Failed to set to completed", error);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md ${
        compact ? "p-3" : "p-5"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Order #{order._id.slice(-6)}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(order.createdAt)}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div
        className={`${
          compact ? "text-xs" : "text-sm"
        } space-y-1 text-gray-600 dark:text-gray-300 mb-4`}
      >
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <span className="font-medium">{order.customerId}</span>
        </div>
        <div className="flex items-start gap-1">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span className="leading-tight">{order.address}</span>
        </div>
      </div>

      <div className={`mb-4 ${compact ? "text-xs" : "text-sm"}`}>
        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
          Items
        </h4>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {order.items.map((item) => (
            <li key={item._id} className="flex justify-between py-1.5">
              <div className="flex items-center">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                  {item.quantity}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <span className="font-medium">
                Rs. {calculateItemTotal(item)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between font-medium py-3 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
        <span className="dark:text-gray-200">Total Amount</span>
        <span className="text-green-600 dark:text-green-400">
          Rs. {order.totalAmount}
        </span>
      </div>

      <div className="space-y-2">
        {order.status === "process" && (
          <button
            onClick={handleSetPreparing}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Start Preparing
          </button>
        )}

        {order.status === "preparing" && (
          <button
            onClick={handleSetCompleted}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Mark Completed & Assign Driver
          </button>
        )}
      </div>
    </div>
  );
};

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Order["status"] | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  // const restaurantId = useSelector(
  // (state: RootState) => state.user.restaurantId
  //   );

  //const restaurantId = "680df103017a68c8b5971ff9";
  const restaurantId = useSelector(
    (state: RootState) => state.restaurant.restaurantData?._id
  );

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/order/getorders/${restaurantId}`);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const activeOrders = orders.filter(
    (order) => order.status !== "pending" && !order.iscompleted
  );
  const completedOrders = orders.filter((order) => order.iscompleted);

  const filteredOrders =
    filter === "all"
      ? activeOrders
      : activeOrders.filter((order) => order.status === filter);

  const orderStats = {
    all: activeOrders.length,
    process: activeOrders.filter((o) => o.status === "process").length,
    preparing: activeOrders.filter((o) => o.status === "preparing").length,
    ready: activeOrders.filter((o) => o.status === "ready").length,
    completed: completedOrders.length,
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Order Management
        </h1>
        <button
          onClick={fetchOrders}
          className="mt-2 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Refresh Orders
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {[
          { key: "all", label: "All Active", color: "bg-blue-500" },
          { key: "process", label: "New", color: "bg-purple-500" },
          { key: "preparing", label: "Preparing", color: "bg-yellow-500" },
          { key: "completed", label: "Completed", color: "bg-gray-500" },
        ].map((item) => (
          <div
            key={item.key}
            className={`bg-white dark:bg-gray-800 border ${
              filter === item.key
                ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900"
                : "border-gray-100 dark:border-gray-700"
            } rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow dark:hover:shadow-lg`}
            onClick={() => setFilter(item.key as Order["status"] | "all")}
          >
            <div className={`w-2 h-2 ${item.color} rounded-full mb-2`}></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {item.label}
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {orderStats[item.key as keyof typeof orderStats]}
            </p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {filter === "all"
              ? "Active Orders"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
          </h2>

          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400 mb-10">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <p className="text-lg font-medium dark:text-gray-300">
                No orders found
              </p>
              <p className="text-sm">
                No orders with the selected status are currently available.
              </p>
            </div>
          )}

          {completedOrders.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Completed Orders
              </h2>
              <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex space-x-4 min-w-max pb-2">
                  {completedOrders.map((order) => (
                    <div
                      key={order._id}
                      className="min-w-[280px] max-w-xs flex-shrink-0"
                    >
                      <OrderCard
                        order={order}
                        onStatusChange={handleStatusChange}
                        compact={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrderPage;
