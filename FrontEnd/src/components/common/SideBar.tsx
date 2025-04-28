import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Utensils,
  ShoppingBag,
  Settings,
  ChevronRight,
  ChevronLeft,
  CreditCard,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      path: "/admin/user",
    },
    {
      title: "Restaurants",
      icon: <Utensils size={20} />,
      path: "/admin/restaurant",
    },
    {
      title: "Payments",
      icon: <CreditCard size={20} />,
      path: "/admin/payments",
    },
  ];

  return (
    <aside
      className={`bg-white dark:bg-dark shadow-md dark:shadow-gray-800/20 fixed h-full pt-24 z-40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full flex flex-col justify-between pb-6">
        <div className="overflow-y-auto">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark_hover group transition-all ${
                    location.pathname === item.path ||
                    (item.path === "/admin/dashboard" &&
                      location.pathname === "/admin")
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="min-w-[24px]">{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium transition-opacity duration-300">
                      {item.title}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onToggle}
          className="mx-auto flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-dark_hover hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
