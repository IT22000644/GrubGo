import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface OrderItem {
    foodItemId: string;
    quantity: number;
    price: number;
    name: string;
    _id: string;
}

interface Order {
    _id: string;
    customerId: string;
    restaurantId: string;
    items: OrderItem[];
    totalAmount: number;
    iscompleted: boolean;
    createdAt: string;
}

interface RestaurantEarnings {
    restaurantId: string;
    restaurantName: string;
    totalEarnings: number;
    orderCount: number;
    lastUpdated: string;
}

interface DashboardStats {
    totalOrders: number;
    totalEarnings: number;
    completedOrders: number;
    pendingOrders: number;
    averageOrderValue: number;
    hourlyTransactions: { hour: string; count: number; earnings: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const AdminPayments: React.FC = () => {
    const [restaurants, setRestaurants] = useState<RestaurantEarnings[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        totalOrders: 0,
        totalEarnings: 0,
        completedOrders: 0,
        pendingOrders: 0,
        averageOrderValue: 0,
        hourlyTransactions: []
    });

    useEffect(() => {
        fetchRestaurantEarnings();
        // const intervalId = setInterval(fetchRestaurantEarnings, 30000);
        // return () => clearInterval(intervalId);
    }, [selectedDate]);

    const fetchRestaurantEarnings = async () => {
        setLoading(true);
        try {
            const restaurantsRes = await api.get("/restaurant");
            const allRestaurants = restaurantsRes.data.restaurants;

            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const earningsMap: Record<string, RestaurantEarnings> = {};
            allRestaurants.forEach((restaurant: any) => {
                earningsMap[restaurant._id] = {
                    restaurantId: restaurant._id,
                    restaurantName: restaurant.name,
                    totalEarnings: 0,
                    orderCount: 0,
                    lastUpdated: new Date().toISOString()
                };
            });

            const fetchedOrders: Order[] = [];
            for (const restaurant of allRestaurants) {
                try {
                    const ordersRes = await api.get(`/order/getorders/${restaurant._id}`, {
                        params: {
                            startDate: startOfDay.toISOString(),
                            endDate: endOfDay.toISOString()
                        }
                    });
                    fetchedOrders.push(...ordersRes.data);
                } catch (err) {
                    console.error(`Failed to fetch orders for restaurant ${restaurant._id}:`, err);
                }
            }

            setAllOrders(fetchedOrders);
            const completedOrders = fetchedOrders.filter((order: Order) => order.iscompleted);
            completedOrders.forEach((order: Order) => {
                if (earningsMap[order.restaurantId]) {
                    earningsMap[order.restaurantId].totalEarnings += order.totalAmount;
                    earningsMap[order.restaurantId].orderCount += 1;
                }
            });

            setRestaurants(Object.values(earningsMap));
            calculateDashboardStats(fetchedOrders, earningsMap);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDashboardStats = (orders: Order[], restaurantMap: Record<string, RestaurantEarnings>) => {
        const completed = orders.filter(order => order.iscompleted);
        const pending = orders.filter(order => !order.iscompleted);
        const totalEarnings = completed.reduce((sum, order) => sum + order.totalAmount, 0);
        const avgOrderValue = completed.length ? totalEarnings / completed.length : 0;

        const hourlyData: Record<string, { count: number; earnings: number }> = {};
        for (let i = 0; i < 24; i++) {
            const hour = i < 10 ? `0${i}:00` : `${i}:00`;
            hourlyData[hour] = { count: 0, earnings: 0 };
        }

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const hour = orderDate.getHours();
            const hourKey = hour < 10 ? `0${hour}:00` : `${hour}:00`;

            if (hourlyData[hourKey]) {
                hourlyData[hourKey].count++;
                if (order.iscompleted) {
                    hourlyData[hourKey].earnings += order.totalAmount;
                }
            }
        });

        const hourlyTransactions = Object.keys(hourlyData).map(hour => ({
            hour,
            count: hourlyData[hour].count,
            earnings: hourlyData[hour].earnings
        }));

        setDashboardStats({
            totalOrders: orders.length,
            totalEarnings,
            completedOrders: completed.length,
            pendingOrders: pending.length,
            averageOrderValue: avgOrderValue,
            hourlyTransactions
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const topRestaurants = [...restaurants]
        .filter(r => r.orderCount > 0)
        .sort((a, b) => b.totalEarnings - a.totalEarnings)
        .slice(0, 5);

    const pieChartData = topRestaurants.map(restaurant => ({
        name: restaurant.restaurantName,
        value: restaurant.totalEarnings
    }));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Restaurant Earnings Dashboard</h1>
                <div className="flex items-center gap-4">
                    <label htmlFor="date" className="text-gray-700 dark:text-gray-300">Select Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Orders</h3>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalOrders}</div>
                        <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            transactions
                        </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Earnings</h3>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardStats.totalEarnings.toFixed(2)}</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Average Order Value</h3>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardStats.averageOrderValue.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Earnings Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Hourly Transactions</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={dashboardStats.hourlyTransactions.filter(item => item.count > 0)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'earnings') return [`$${Number(value).toFixed(2)}`, 'Earnings'];
                                return [value, 'Orders'];
                            }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="count" name="Orders" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="earnings" name="Earnings" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;