import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListFilter } from 'lucide-react';
import OrderFilter from '../../components/Order/OrderFilter';
import OrderCard from '../../components/Order/OrderCard';

import type { Order } from '../../components/Order/types'; 

const OrderPage: React.FC<{ customerId: string }> = ({ customerId }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [status, setStatus] = useState('pending');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');

        try {
            const params: any = {};
            if (status) params.status = status;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await axios.get(`http://localhost:5000/api/orders/customer/${customerId}`, { params });
            setOrders(res.data);
        } catch (err: any) {
            setOrders([]);
            if (err.response?.status === 404) {
                setError('No orders found.');
            } else {
                setError(err.response?.data?.message || 'Error fetching orders');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders();
        if (window.innerWidth < 768) {
            setShowFilters(false);
        }
    };

    const handleCheckout = async (orderId: string) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/orders/${orderId}/checkout/`);
            if (res.data?.url) {
                window.location.href = res.data.url;
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            alert("Failed to initiate checkout.");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${month} ${day} at ${time}`;
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const getStatusBadge = (status: string) => {
        const base = "text-xs font-semibold px-2.5 py-0.5 rounded inline-block";
        switch (status) {
            case "pending":
                return `${base} bg-yellow-100 text-yellow-800`;
            case "process":
                return `${base} bg-blue-100 text-blue-800`;
            case "preparing":
                return `${base} bg-indigo-100 text-indigo-800`;
            case "delivering":
                return `${base} bg-orange-100 text-orange-800`;
            case "completed":
            case "done":
                return `${base} bg-green-100 text-green-800`;
            case "cancelled":
                return `${base} bg-red-100 text-red-800`;
            default:
                return `${base} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-end items-center mb-6">
    <button
        onClick={toggleFilters}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-md transition-colors"
        aria-expanded={showFilters}
        aria-controls="filter-panel"
    >
        <ListFilter size={18} />
        <span className="hidden sm:inline">Filters</span>
    </button>
</div>


            {showFilters && (
                <OrderFilter
                    status={status}
                    startDate={startDate}
                    endDate={endDate}
                    setStatus={setStatus}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowFilters(false)}
                />
            )}

            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-pulse text-gray-500">Loading your orders...</div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {!loading && orders.length === 0 && !error && (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-2 text-gray-500">Try changing your filter settings or check back later.</p>
                </div>
            )}

            <div className="space-y-6 sm:space-y-8">
                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onCheckout={handleCheckout}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrderPage;
