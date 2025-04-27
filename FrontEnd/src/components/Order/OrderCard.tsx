import React from 'react';

interface OrderItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    foodItemId: string;
}

interface Order {
    _id: string;
    customerId: string;
    restaurantId: string;
    restaurantName: string;
    status: string;
    isreviewed: boolean;
    createdAt: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    restaurantImage?: string;
}

interface OrderCardProps {
    order: Order & { restaurantName?: string };
    onCheckout: (orderId: string) => void;
    formatDate: (dateString: string) => string;
    getStatusBadge: (status: string) => string;
    onReview: (orderId: string) => void;
    onMarkAsReviewed: (orderId: string) => Promise<void>;
    trackthedelivary:(orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onReview, trackthedelivary, onCheckout, formatDate, getStatusBadge }) => {
    return (
        <div className="bg-white dark:bg-gray-800 h-52 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="flex h-full">
                <div className="w-32 h-full bg-gray-100 dark:bg-gray-700 relative flex-shrink-0">
                    {order.restaurantImage ? (
                        <img
                            src={order.restaurantImage}
                            alt={order.restaurantName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c-.5.5-1 1-1.5 1.5M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    <span className={`absolute top-2 right-2 ${getStatusBadge(order.status)} text-xs`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{order.restaurantName}</h2>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>

                        <div className="flex items-center mb-2 text-xs text-gray-600 dark:text-gray-300">
                            <span className="font-medium">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">{order.currency} {order.totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="space-y-1">
                            {order.items.slice(0, 2).map((item) => (
                                <div key={item._id} className="flex items-center">
                                    <span className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 w-5 h-5 rounded-full mr-2 text-xs font-medium">
                                        {item.quantity}
                                    </span>
                                    <span className="text-xs text-gray-800 dark:text-gray-200 truncate">{item.name}</span>
                                </div>
                            ))}
                            {order.items.length > 2 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                    +{order.items.length - 2} more
                                </p>
                            )}
                        </div>
                    </div>

                    {order.status === "pending" && (
                        <button
                            onClick={() => onCheckout(order._id)}
                            className="mt-1 w-full py-2 bg-orange-400 hover:bg-orange-500 text-white rounded text-xs shadow-sm transition-colors duration-200 flex items-center justify-center font-medium"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Checkout
                        </button>
                    )}

                    {order.status === "completed" && (
                        <button
                            onClick={() => trackthedelivary(order._id)}
                            className="mt-1 w-full py-2 bg-orange-400 hover:bg-orange-500 text-white rounded text-xs shadow-sm transition-colors duration-200 flex items-center justify-center font-medium"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Track the Delivery
                        </button>
                    )}

                    {order.status === "done" && !order.isreviewed && (
                        <button
                            onClick={() => onReview(order._id)}
                            className="mt-1 w-full py-2 bg-orange-400 hover:bg-orange-500 text-white rounded text-xs shadow-sm transition-colors duration-200 flex items-center justify-center font-medium"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Review
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;