import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <footer className="bg-white dark:bg-gray-900 text-dark_hover dark:text-gray-200 transition-colors duration-300 pt-12 pb-6 border-t border-gray-200 dark:border-dark_hover">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary dark:bg-orange-500 mr-3">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h2 className="text-2xl font-bold">GrubGo</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Delivering delicious experiences to your doorstep, one meal at a
              time.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-row md:gap-0 lg:gap-16 gap-8">
            <div>
              <h3 className="text-md font-semibold mb-4">Quick links</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Restaurants
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-4">Offers</h3>
              <ul className="text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Restaurants
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-all duration-200 hover:opacity-75 text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4">Contact Us</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-4">
              <li className="flex items-start text-sm">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Delivery Street, Foodville, CA 90210</span>
              </li>
              <li className="flex items-center text-sm">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center text-sm">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>support@grubgo.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe for special offers and updates
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-l outline-none bg-light_hover dark:bg-dark_hover border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-primary dark:focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r font-medium bg-primary dark:bg-orange-500 hover:bg-orange-500 dark:hover:bg-orange-600 text-white transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark_hover mb-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 GrubGo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
