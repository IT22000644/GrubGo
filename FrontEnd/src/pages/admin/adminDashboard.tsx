import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, ShoppingBag, Utensils, DollarSign } from "lucide-react";

export const AdminDashboard = () => {
  const data = [
    { name: "Jan", orders: 400, revenue: 2400 },
    { name: "Feb", orders: 300, revenue: 1398 },
    { name: "Mar", orders: 500, revenue: 9800 },
    { name: "Apr", orders: 780, revenue: 3908 },
    { name: "May", orders: 890, revenue: 4800 },
    { name: "Jun", orders: 390, revenue: 3800 },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: "2,453",
      icon: <Users size={24} className="text-blue-500" />,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: "1,234",
      icon: <ShoppingBag size={24} className="text-green-500" />,
      trend: "+23.1%",
      trendUp: true,
    },
    {
      title: "Restaurants",
      value: "84",
      icon: <Utensils size={24} className="text-yellow-500" />,
      trend: "+5.4%",
      trendUp: true,
    },
    {
      title: "Revenue",
      value: "$32,450",
      icon: <DollarSign size={24} className="text-purple-500" />,
      trend: "-2.3%",
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-10">
          Dashboard Overview
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: Today at 9:41 AM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-dark p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </h3>
                <p className="text-2xl font-semibold mt-1">{card.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark_hover">
                {card.icon}
              </div>
            </div>
            <div
              className={`mt-4 text-sm ${
                card.trendUp ? "text-green-500" : "text-red-500"
              }`}
            >
              {card.trend} from last month
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Orders & Revenue</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#374151"
              />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="orders"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
