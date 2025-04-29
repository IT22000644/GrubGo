/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { Restaurant } from "../allRestaurants/AllRestaurants.types";
import Modal from "../../../components/modal/Modal";
import api from "../../../api/api";

export const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showViewMenu, setShowViewMenu] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [verification, setVerification] = useState<boolean>(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/restaurant/");
      setRestaurants(response.data.restaurants);
      console.log("Fetched restaurants:", response.data.restaurants);

      setError(null);
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again later.");
      console.error("Error fetching restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.town
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      restaurant.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      restaurant.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let badgeClass = "";

    switch (status.toLowerCase()) {
      case "open":
        badgeClass =
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        break;
      case "closed":
        badgeClass =
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        break;
      case "paused":
        badgeClass =
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        break;
      default:
        badgeClass =
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}
      >
        {status}
      </span>
    );
  };

  const formatAddress = (address: Restaurant["address"]) => {
    return `${address.shopNumber}, ${address.street}, ${address.town}`;
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${month} ${day} at ${time}`;
  };

  const onViewRestaurant = (restaurantId: string) => {
    const selectedRestaurant = restaurants.find(
      (restaurant) => restaurant._id === restaurantId
    );
    if (selectedRestaurant) {
      setRestaurant(selectedRestaurant);
      setShowViewMenu(true);
    }
  };

  const handleToggle = async (restaurantId: string) => {
    const status = !isOpen ? "open" : "closed";
    if (restaurantId) {
      await api.patch(`/restaurant/status/${restaurantId}`, {
        status,
      });
      fetchRestaurants();
      setIsOpen(!isOpen);
    } else {
      console.error("Restaurant ID is null");
    }
  };

  const handleVerified = async (restaurantId: string) => {
    const verification = !isOpen ? true : false;
    if (restaurantId) {
      await api.patch(`/restaurant/verify/${restaurantId}`, {
        verification,
      });
      fetchRestaurants();
      setVerification(!isOpen);
    } else {
      console.error("Restaurant ID is null");
    }
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Restaurants Management
        </h1>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark_hover w-full sm:w-64 m"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark_hover w-full sm:w-auto"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={18} className="mr-2" />
            Add Restaurant
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading restaurants...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-300">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark_hover">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRestaurants.map((restaurant) => {
                  const isOpen = restaurant.status === "open" ? true : false;
                  return (
                    <tr
                      key={restaurant._id}
                      className="hover:bg-gray-50 dark:hover:bg-dark_hover"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                restaurant.images[0] || "/api/placeholder/40/40"
                              }
                              alt={restaurant.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {restaurant.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500 dark:text-gray-300">
                          {formatAddress(restaurant.address)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500 dark:text-gray-300">
                          {restaurant.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={restaurant.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            title="View Restaurant"
                            onClick={() => onViewRestaurant(restaurant._id)}
                          >
                            <ExternalLink size={18} />
                          </button>
                          <div className="flex items-center space-x-3 px-4 py-2">
                            <span className="text-sm font-medium text-gray-700">
                              <span
                                className={
                                  isOpen ? "text-green-600" : "text-red-600"
                                }
                              >
                                {isOpen ? "open" : "closed"}
                              </span>
                            </span>
                            <button
                              onClick={() => handleToggle(restaurant._id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                restaurant.status === "open"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                              aria-pressed={restaurant.status === "open"}
                              aria-labelledby="toggle-label"
                            >
                              <span className="sr-only">Toggle status</span>
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  restaurant.status === "open"
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center space-x-3 px-4 py-2">
                            <span className="text-sm font-medium text-gray-700">
                              <span
                                className={
                                  verification
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {verification ? "Verified" : "Not Verified"}
                              </span>
                            </span>
                            <button
                              onClick={() => handleVerified(restaurant._id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                restaurant.isVerified === true
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                              aria-pressed={
                                restaurant.isVerified === true
                                  ? "true"
                                  : "false"
                              }
                              aria-labelledby="toggle-label"
                            >
                              <span className="sr-only">Verified status</span>
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  restaurant.isVerified === true
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <button
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="More Options"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRestaurants.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No restaurants found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-dark_hover border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredRestaurants.length} of {restaurants.length}{" "}
                restaurants
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-dark_hover disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-dark_hover">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showViewMenu}
        onClose={() => setShowViewMenu(false)}
        title="View Menu"
      >
        {restaurant ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              <span className="font-bold">Restaurant Name: </span>
              {restaurant.name}
            </h3>
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm text-gray-600 font-semibold text-semibold">
                <span className="font-bold">Address: </span>
                {formatAddress(restaurant.address)}
              </p>
              <a
                href={`https://maps.google.com/?q=${restaurant.address.street},${restaurant.address.town}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-text_dark hover:text-accent font-semibold dark:text-text_white dark:hover:text-accent"
              >
                <span className="text-sm">Get Directions</span>
                <MapPin size={18} className="ml-2 text-accent" />
              </a>
            </div>
            <p className="text-sm text-gray-600 font-semibold text-semibold">
              <span className="font-bold">Phone number: </span>
              {restaurant.phone}
            </p>
            <p className="text-sm text-gray-600 font-semibold text-semibold">
              <span className="font-bold">Status: </span> {restaurant.status}
            </p>
            <p className="text-sm text-gray-600 font-semibold text-semibold">
              <span className="font-bold">Register Date: </span>
              {formatDate(restaurant.createdAt)}
            </p>
            <p className="text-sm text-gray-600 font-semibold text-semibold">
              <span className="font-bold">Last Date: </span>
              {formatDate(restaurant.updatedAt)}`
            </p>
            {restaurant.menus && (
              <p className="text-sm text-gray-600 font-semibold text-semibold">
                <span className="font-bold">Offered Menus: </span>
                {restaurant.menus.length}
              </p>
            )}

            {restaurant.images && restaurant.images.length > 0 && (
              <div>
                <h4 className="text-md font-medium mb-2">Images:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {restaurant.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Menu item ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No menu selected.</p>
        )}
      </Modal>
    </div>
  );
};
