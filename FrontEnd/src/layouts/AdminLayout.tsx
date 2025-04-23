import { Outlet } from "react-router-dom";
import "../index.css";
import AdminHeader from "../components/common/Header/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark_bg text-black dark:text-white transition-colors duration-300">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
