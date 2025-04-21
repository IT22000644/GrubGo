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
    createdAt: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
}

interface OrderCardProps {
    order: Order;
    onCheckout: (orderId: string) => void;
    formatDate: (dateString: string) => string;
    getStatusBadge: (status: string) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCheckout, formatDate, getStatusBadge }) => {
    return (
        <div className="border-b pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                <div className="w-full sm:w-64 h-32 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0 mb-4 sm:mb-0" />

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold mb-1">{order.restaurantId}</h2>
                        <span className={getStatusBadge(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2 flex flex-wrap gap-1">
                        <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                        <span>•</span>
                        <span>LKR {order.totalAmount.toFixed(2)}</span>
                        <span>•</span>
                        <span>{formatDate(order.createdAt)}</span>
                    </p>

                    <div className="space-y-1">
                        {order.items.map((item) => (
                            <div key={item._id} className="flex items-center">
                                <span className="mr-4 text-sm font-medium">{item.quantity}</span>
                                <span className="text-sm truncate">{item.foodItemId}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {order.status === "pending" && (
                <div className="mt-4">
                    <button
                        onClick={() => onCheckout(order._id)}
                        className="px-2 py-2 w-full bg-orange-400 hover:bg-orange-500 text-white rounded-md shadow"
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderCard;
