import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../../assets/Theme/ThemeToggle";
import {
  ChevronDown,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import Modal from "../modal/Modal";
import { Login } from "../../features/auth/Login";
import { Register } from "../../features/auth/Register";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Handle scroll effect for sticky header
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

  const toggleDropdown = (name: any) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  // Navigation links with dropdown content
  const navLinks = [
    {
      name: "Home",
      path: "/",
      hasDropdown: false,
    },
    {
      name: "Menu",
      path: "/menu",
      hasDropdown: true,
      dropdownContent: [
        { name: "Pizza", path: "/menu/pizza" },
        { name: "Burgers", path: "/menu/burgers" },
        { name: "Sushi", path: "/menu/sushi" },
        { name: "Vegan", path: "/menu/vegan" },
        { name: "Desserts", path: "/menu/desserts" },
      ],
    },
    {
      name: "Restaurants",
      path: "/allRestaurants",
      hasDropdown: true,
      dropdownContent: [
        { name: "Nearby", path: "/restaurants/nearby" },
        { name: "Popular", path: "/restaurants/popular" },
        { name: "New Partners", path: "/restaurants/new" },
        { name: "All Restaurants", path: "/allRestaurants" },
      ],
    },
    {
      name: "About Us",
      path: "/about",
      hasDropdown: false,
    },
    {
      name: "Contact",
      path: "/contact",
      hasDropdown: false,
    },
  ];

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

          <div className="hidden md:flex items-center space-x-3">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() =>
                  link.hasDropdown && toggleDropdown(link.name)
                }
                onMouseLeave={closeDropdowns}
              >
                {link.hasDropdown ? (
                  <button
                    className="flex items-center px-3 py-2 font-medium hover:text-primary  transition-colors duration-200"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.name}
                    <ChevronDown size={16} className="ml-1 mt-1" />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className="px-3 py-2  font-medium hover:text-primary  transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                )}

                {link.hasDropdown && activeDropdown === link.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-dark_hover rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                    <div className="py-1">
                      {link.dropdownContent?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-light_hover dark:hover:bg-dark_hover"
                          onClick={closeDropdowns}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <button className="p-2 rounded-full hover:bg-light_hover dark:hover:bg-dark_hover transition-colors">
              <Search size={20} />
            </button>

            <Link
              to="/account"
              className="p-2 rounded-full hover:bg-light_hover dark:hover:bg-dark_hover transition-colors"
            >
              <User size={20} />
            </Link>

            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-light_hover dark:hover:bg-dark_hover transition-colors relative"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-primary dark:bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                3
              </span>
            </Link>

            <ThemeToggle />

            <button
              onClick={() => {
                setShowAuthModal(true);
                setIsLogin(true);
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-primary dark:hover:text-primary"
            >
              {" "}
              <LogIn size={18} />
              Login
            </button>
          </div>

          <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
            {isLogin ? (
              <Login switchToRegister={() => setIsLogin(false)} />
            ) : (
              <Register switchToLogin={() => setIsLogin(true)} />
            )}
          </Modal>

          <div className="flex items-center space-x-3 md:hidden">
            <Link to="/cart" className="p-2 relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-primary dark:bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <ThemeToggle />
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              <LogIn size={18} />
              Login
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-light_hover dark:hover:bg-dark_hover transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        } transition-all duration-300`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t dark:border-dark_hover">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className="w-full text-left flex justify-between items-center px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === link.name && (
                    <div className="pl-4 space-y-1 animate-slideDown">
                      {link.dropdownContent?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-light_hover dark:hover:bg-dark_hover"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={link.path}
                  className="block px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-dark_hover">
            <Link
              to="/account"
              className="flex items-center px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} className="mr-2" />
              My Account
            </Link>
            <Link
              to="/search"
              className="flex items-center px-3 py-2 rounded-md font-medium hover:bg-light_hover dark:hover:bg-dark_hover"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} className="mr-2" />
              Search
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
