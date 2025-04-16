import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Star, Search } from "lucide-react";

const Home = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const featuredRestaurants = [
    {
      id: 1,
      name: "Pasta Paradise",
      cuisine: "Italian",
      rating: 4.8,
      deliveryTime: "25-35",
      image: "/api/placeholder/400/300",
      tags: ["Pasta", "Pizza", "Salads"],
    },
    {
      id: 2,
      name: "Sushi Station",
      cuisine: "Japanese",
      rating: 4.7,
      deliveryTime: "30-40",
      image: "/api/placeholder/400/300",
      tags: ["Sushi", "Ramen", "Bento"],
    },
    {
      id: 3,
      name: "Burger Bliss",
      cuisine: "American",
      rating: 4.6,
      deliveryTime: "20-30",
      image: "/api/placeholder/400/300",
      tags: ["Burgers", "Fries", "Shakes"],
    },
    {
      id: 4,
      name: "Taco Fiesta",
      cuisine: "Mexican",
      rating: 4.5,
      deliveryTime: "25-35",
      image: "/api/placeholder/400/300",
      tags: ["Tacos", "Burritos", "Quesadillas"],
    },
  ];

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
      image: "/api/placeholder/1200/600",
      title: "Delicious food delivered to your door",
      subtitle:
        "Order from the best local restaurants with easy, contactless delivery",
      cta: "Order Now",
    },
    {
      image: "/api/placeholder/1200/600",
      title: "Fresh ingredients, amazing taste",
      subtitle:
        "Discover new flavors from hundreds of restaurants in your area",
      cta: "Explore Restaurants",
    },
    {
      image: "/api/placeholder/1200/600",
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
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        <img
          src={heroContent[heroIndex].image}
          alt="Hero"
          className="absolute h-full w-full object-cover transition-transform duration-1000 transform scale-105"
        />

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
                  className="w-full py-3 pl-12 pr-4 bg-white dark:bg-gray-800 rounded-l-full border-0 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-r-full flex items-center transition-colors"
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

      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
          Popular Categories
        </h2>
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
              <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
              Featured Restaurants
            </h2>
            <Link
              to="/restaurants"
              className="text-orange-400 dark:text-orange-500 font-medium flex items-center hover:underline"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm font-medium flex items-center">
                    <Star
                      size={14}
                      className="text-yellow-400 mr-1"
                      fill="#facc15"
                    />
                    {restaurant.rating}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {restaurant.cuisine}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Clock size={14} className="mr-1" />
                    {restaurant.deliveryTime} min
                  </div>
                </div>
              </Link>
            ))}
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

      <section className="py-16 bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Hungry? We've got you covered
          </h2>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto">
            Download the GrubGo app today and get your first delivery free!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.05 20.28c-.98.95-2.05.02-3.16-.89-1.14-.91-2.3-1.83-3.47-2.74-1.16-.9-2.33-1.81-3.5-2.72-1.15-.9-2.28-1.91-1.42-3.21.29-.44.79-.69 1.29-.93 1.96-.97 3.96-1.88 5.97-2.76 1.04-.46 2.04-.97 3.15-.63 1.13.35 1.83 1.46 2.36 2.46.56 1.07 1.1 2.15 1.63 3.23.53 1.08 1.05 2.17 1.58 3.25.48.98.97 2.09.43 3.08a5.35 5.35 0 01-1.9 1.61c-.83.43-1.92.6-2.96-.75zm-9.79-8.66a.89.89 0 00-.89.89c0 .29.14.56.38.72.84.58 1.7 1.14 2.55 1.71 1.59 1.05 3.19 2.11 4.76 3.17.82.55 1.65 1.14 2.49 1.68.28.18.66.1.84-.18.18-.28.1-.66-.18-.84-.84-.54-1.67-1.12-2.49-1.68-1.57-1.06-3.16-2.12-4.76-3.17-.85-.57-1.71-1.13-2.55-1.71a.888.888 0 00-1.15.41z" />
                <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0-2C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z" />
              </svg>
              App Store
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186c-.18.18-.44.233-.667.137C2.717 22.156 2.5 21.88 2.5 21.562V2.438c0-.317.217-.594.443-.76.227-.097.486-.044.666.136zm9.752 10.934l2.66-1.543 3.573 2.086c.515.3.516 1.044.002 1.345l-3.575 2.086-2.66-1.545 2.683-1.213-2.683-1.216z" />
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
