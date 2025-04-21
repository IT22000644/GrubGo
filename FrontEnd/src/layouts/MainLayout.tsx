import { Outlet } from "react-router-dom";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer";
import "../index.css";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark_bg text-black dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
