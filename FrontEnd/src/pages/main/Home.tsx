import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Clock,
  Star,
  Search,
  DoorOpen,
  DoorClosed,
  UtensilsCrossed,
} from "lucide-react";
import { api1, api2 } from "../../api/axios";
import { Restaurant } from "../restaurant/allRestaurants/AllRestaurants.types";
import image1 from "../../assets/Images/daniel-T_PbUhfwd0U-unsplash.jpg";
import image2 from "../../assets/Images/daniel-eUhCKM0ntrg-unsplash.jpg";
import image3 from "../../assets/Images/vinn-koonyosying-vBOxsZrfiCw-unsplash.jpg";
import appStore from "../../assets/Images/app-store-logo-transparent-5.png";
import playStore from "../../assets/Images/google-play-store-icon-logo-symbol-free-png.webp";

const Home = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await api1.get("/restaurants/status/open");
        setRestaurants(res1.data.restaurants);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: "Pizza", icon: "🍕", bgColor: "bg-orange-100 dark:bg-orange-900" },
    { name: "Sushi", icon: "🍣", bgColor: "bg-red-100 dark:bg-red-900" },
    {
      name: "Burgers",
      icon: "🍔",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    { name: "Tacos", icon: "🌮", bgColor: "bg-green-100 dark:bg-green-900" },
    { name: "Pasta", icon: "🍝", bgColor: "bg-blue-100 dark:bg-blue-900" },
    { name: "Dessert", icon: "🍰", bgColor: "bg-pink-100 dark:bg-pink-900" },
  ];

  const heroContent = [
    {
      image: image1,
      title: "Delicious food delivered to your door",
      subtitle:
        "Order from the best local restaurants with easy, contactless delivery",
      cta: "Order Now",
    },
    {
      image: image2,
      title: "Fresh ingredients, amazing taste",
      subtitle:
        "Discover new flavors from hundreds of restaurants in your area within ",
      cta: "Explore Restaurants",
    },
    {
      image: image3,
      title: "Special offers every day",
      subtitle:
        "Save big with exclusive deals and discounts on your favorite meals",
      cta: "View Deals",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroContent.length]);

  const handleSearch = (e: any) => {
    e.preventDefault();

    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative h-96 md:h-[500px] overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {heroContent.map((content, idx) => (
          <img
            key={idx}
            src={content.image}
            alt={`Hero ${idx + 1}`}
            className={`absolute h-full w-full object-cover transition-all duration-1500 
      ${
        idx === heroIndex
          ? "opacity-100 transform scale-105 animate-kenBurns"
          : "opacity-0 transform scale-100"
      }`}
          />
        ))}

        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fadeIn">
            {heroContent[heroIndex].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fadeUp">
            {heroContent[heroIndex].subtitle}
          </p>

          <div
            className={`w-full max-w-2xl transition-all duration-300 transform ${
              isSearchFocused ? "scale-105" : "scale-100"
            }`}
          >
            <form onSubmit={handleSearch} className="relative flex">
              <div className="relative flex-grow">
                <MapPin
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="w-full py-3 pl-12 pr-4 bg-white rounded-l-full border-0 border-none focus:outline-none text-dark"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 text-white px-6 py-3 rounded-r-full flex items-center transition-colors"
              >
                <Search size={18} className="mr-2" />
                Find Food
              </button>
            </form>
          </div>

          <div className="absolute bottom-6 flex space-x-2">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === heroIndex ? "bg-white w-8" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 container mx-auto px-4 mt-10 bg-primary/10 dark:bg-black rounded-lg">
        <h2 className="text-xl md:text-xl font-bold text-gray-800 dark:text-white">
          Popular Categories
        </h2>
        <div className="border-t border-white dark:border-accent my-3"></div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name.toLowerCase()}`}
              className="flex flex-col items-center p-4 rounded-lg transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div
                className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center text-2xl mb-3`}
              >
                {category.icon}
              </div>
              <span className="text-sm md:text-base font-medium text-gray-700 dark:text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
              Featured Restaurants
            </h2>
            <Link
              to="/allRestaurants"
              className="text-orange-400 dark:text-white font-medium flex items-center hover:scale-105 transition-transform duration-300"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants && restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurant/${restaurant._id}`}
                  className="bg-white dark:bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.images[0]}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm font-medium flex items-center">
                      <Star
                        size={14}
                        className="text-yellow-400 mr-1"
                        fill="#facc15"
                      />
                      {/* {restaurant.status} */} 4.7
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {restaurant.address.shopNumber},{" "}
                      {restaurant.address.street}, {restaurant.address.town}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.menus.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                        >
                          {tag.title}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-row justify-between mt-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Clock size={14} className="mr-1" />
                        30-40 min
                      </div>
                      <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md dark:bg-green-800 dark:text-green-100">
                        {restaurant.status === "open" ? (
                          <span className="flex items-center text-success">
                            <DoorOpen className="mr-1" /> Open
                          </span>
                        ) : (
                          <span className="flex items-center text-accent">
                            <DoorClosed className="mr-1" /> Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <UtensilsCrossed className="mb-4 text-accent" size={48} />
                <p className="text-accent">No Restaurants available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-6 text-orange-500 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Choose your food
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse restaurants and menus to find your favorite dishes
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-6 text-orange-500 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Place your order
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your meal and securely checkout in just a few taps
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-6 text-orange-500 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Enjoy delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your order and enjoy your meal delivered to your doorstep
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 ">
        <div className="border-t border-gray-200 dark:border-white dark:border-dark_hover mb-8"></div>

        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-dark dark:text-gray-200">
            Hungry? We've got you covered
          </h2>
          <p className="text-md mb-8 text-dark max-w-2xl mx-auto dark:text-gray-400">
            Download the GrubGo app today and get your first delivery free!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="text-dark bg-white py-2 px-2 rounded-lg flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-md font-semibold">
              <img src={appStore} alt="App Store" className="w-10 h-10 mr-2" />
              App Store
            </button>
            <button className="text-dark bg-white py-2 px-2 rounded-lg flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-md font-semibold">
              <img
                src={playStore}
                alt="Google Play"
                className="w-10 h-10 mr-2"
              />
              Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
