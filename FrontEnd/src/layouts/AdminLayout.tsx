import { Outlet } from "react-router-dom";
import "../index.css";
import AdminHeader from "../components/common/Header/AdminHeader";
import AdminSidebar from "../components/common/SideBar";
import { useState } from "react";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark_bg text-black dark:text-white transition-colors duration-300">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main
          className={`flex-1 transition-all duration-300 pt-24 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          } px-6 py-6`}
        >
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
