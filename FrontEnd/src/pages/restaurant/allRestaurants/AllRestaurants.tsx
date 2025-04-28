import { useEffect, useState } from "react";
import { Restaurant } from "./AllRestaurants.types";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Search,
  UtensilsCrossed,
  Ban,
} from "lucide-react";
import { Loader } from "../../common/loader";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

export const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/restaurant/status/open");
        setRestaurants(response.data.restaurants);
        console.log(response.data.restaurants);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRestaurants = Array.isArray(restaurants)
    ? restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.town
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    <Loader />;
  }

  return (
    <div className="mt-10 min-h-screen pb-12 pt-20">
      <div className="items-center text-center">
        <h1 className="text-3xl font-bold mb-2 text-text_dark dark:text-text_white">
          Discover Restaurants
        </h1>
        <p className="text-text_dark mb-8 font-semibold text-sm dark:text-text_white">
          Find the perfect place for your next meal
        </p>
        <div className="relative max-w-2xl mx-auto my-8">
          <Search
            className="absolute left-3 top-3 text-text-gray-600 dark:nature"
            size={20}
          />
          <input
            type="text"
            placeholder="Search restaurants or locations..."
            className="w-full py-3 pl-10 pr-4 rounded-full bg-white text-text-gray-800 shadow-md focus:outline-none focus:ring-1 focus:ring-primary dark:ring-accent dark:bg-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 py-4 overflow-x-auto whitespace-nowrap">
        <div className="inline-flex gap-2">
          {["all", "pizza", "burgers", "sushi", "mexican", "vegetarian"].map(
            (filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === filter
                    ? "bg-primary text-white dark:bg-accent"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-dark dark:text-text_white dark:hover:bg-accent"
                } border border-gray-200 dark:border-black shadow-sm transition`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {restaurant.images[0] && (
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl font-bold text-white">
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-white text-sm">
                      4.5 (120 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-2 mb-3">
                  <MapPin
                    size={18}
                    className="text-gray-500 mt-1 flex-shrink-0"
                  />
                  <p className="text-sm text-gray-600 font-semibold hover:scale-105 transition-transform duration-200 dark:text-text_white/80">
                    {restaurant.address.shopNumber}, {restaurant.address.street}
                    , {restaurant.address.town}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4 font-semibold ">
                  <Phone size={18} className="text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-600 hover:scale-105 transition-transform duration-200 dark:text-text_white/80">
                    {restaurant.phone}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <Clock
                      size={18}
                      className="mr-2 text-primary dark:text-accent"
                    />
                    Menu Highlights
                  </h3>
                  {restaurant.menus && restaurant.menus.length > 0 ? (
                    <div className="flex space-x-2 overflow-x-auto">
                      {restaurant.menus.slice(0, 3).map((menu) => (
                        <div
                          key={menu._id}
                          className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden"
                        >
                          {menu.images[0] && (
                            <img
                              src={menu.images[0]}
                              alt={menu.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <p className="text-white text-xs font-medium px-2 text-center">
                              {menu.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24">
                      <Ban className="mx-auto mb-2" size={20} />
                      <p className="text-sm text-gray-600 font-semibold transition-transform duration-200 dark:text-text_white/80">
                        No menu items available
                      </p>
                    </div>
                  )}
                </div>

                <button
                  className="relative py-2 px-4 text-primary dark:text-accent bg-primary/10 dark:bg-accent/30 hover:bg-primary/40 dark:hover:bg-accent/40 rounded-full flex items-center justify-center font-medium transition-colors text-sm"
                  onClick={() => navigator(`/restaurant/${restaurant._id}`)}
                >
                  View Details
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <UtensilsCrossed className="mx-auto mb-4 text-accent" size={48} />
            <p className="text-xl text-text_dark font-semibold dark:text-text_white">
              No restaurants found matching your search.
            </p>
            <p className="text-text_dark mt-2 dark:text-text_white">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRestaurants;
