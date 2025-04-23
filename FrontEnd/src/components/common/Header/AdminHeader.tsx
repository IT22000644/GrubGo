import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../../../assets/Theme/ThemeToggle";
import { Menu, X, LogIn } from "lucide-react";
import Modal from "../../modal/Modal";
import { Login } from "../../../features/auth/Login";
import { Register } from "../../../features/auth/Register";

const AdminHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-neutral dark:bg-dark backdrop-blur-sm shadow-md"
          : "py-6 bg-neutral dark:bg-dark"
      } text-dark_hover dark:text-gray-200`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary dark:text-primary">Grub</span>
              Go
            </h1>
          </Link>

          <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
            {isLogin ? (
              <Login switchToRegister={() => setIsLogin(false)} />
            ) : (
              <Register switchToLogin={() => setIsLogin(true)} />
            )}
          </Modal>

          <div className="flex items-center space-x-3 md:hidden lg:flex">
            <ThemeToggle />
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              <LogIn size={18} />
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
