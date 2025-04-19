import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 relative mx-auto w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 shadow-inner"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white dark:bg-gray-700 shadow-lg border-8 border-gray-100 dark:border-gray-800"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="text-6xl animate-bounce-slow">🍽️</div>
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-2 text-orange-400 dark:text-orange-500">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Order Not Found!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
          Looks like this dish isn't on our menu. The page you're looking for
          has been moved or doesn't exist.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 mb-8">
          <h3 className="font-medium mb-3">Why not try:</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>• Checking the URL for typos</li>
            <li>• Exploring our menu from the homepage</li>
            <li>• Searching for something delicious</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <Home size={18} className="mr-2" />
            Back to Menu
          </Link>
          <Link
            to="/search"
            className="flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
          >
            <Search size={18} className="mr-2" />
            Search for Food
          </Link>
        </div>
      </div>

      <div className="fixed left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🍕
      </div>
      <div className="fixed right-1/4 top-1/3 transform translate-x-1/2 -translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🍔
      </div>
      <div className="fixed left-1/3 bottom-1/4 transform -translate-x-1/2 translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🌮
      </div>
      <div className="fixed right-1/3 bottom-1/3 transform translate-x-1/2 translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🍜
      </div>
    </div>
  );
};

export default NotFound;
