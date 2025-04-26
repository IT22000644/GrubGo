import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Restaurant, Food } from "../allRestaurants/AllRestaurants.types";

import { api1, api2 } from "../../../api/axios";
import api5011 from "../../../api/api5011";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  ChevronLeft,
  Utensils,
  Heart,
  Share2,
  ShoppingBag,
  UtensilsCrossed,
  Ban,
  DoorOpen,
  DoorClosed,
  CookingPot,
  Images,
  ShoppingCart,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { Loader } from "../../common/loader";
import { AnimatePresence, motion } from "framer-motion";
type Review = {
  _id: string;
  user: string;
  restaurant: string;
  food: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("menu");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [cart, setCart] = useState<{ item: Food; quantity: number }[]>([]);

  const [current, setCurrent] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [average, setAverage] = useState<number>(0);

  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState<boolean>(false);

  const customerId = localStorage.getItem("customerId") || "6611e8f4a1fbb93be88a1a5c";

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const response = await api1.get(`/restaurants/${id}`);
        setRestaurant(response.data.restaurant);
        if (response.data.restaurant?.menus?.length > 0) {
          setSelectedMenu(response.data.restaurant.menus[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
      } finally {
        setLoading(false);
      }
      if (!autoplayEnabled) return;
    };

    const fetchReview = async () => {
      try {
        setReviewLoading(true);
        const reviewsResponse = await api2.get(`/restaurantreviews/${id}`);
        setReviews(reviewsResponse.data);
        const averageRating = getAverageRating(reviewsResponse.data);
        setAverage(averageRating);
        const interval = setInterval(() => {
          setCurrent((prev) => (prev + 1) % reviewsResponse.data.length);
        }, 5000);
        return () => clearInterval(interval);
      } catch (err) {
        console.log("Review fetching error", err);
      } finally {
        setReviewLoading(false);
      }
    };

    if (id) {
      fetchRestaurantDetails();
      fetchReview();
    }
  }, [id]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReview = reviews[current];
  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () =>
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  const toggleAutoplay = () => {
    setAutoplayEnabled(!autoplayEnabled);
  };

  const renderStars = (rating: any) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={18}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  function getAverageRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  }

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const addItemToLocalCart = (item: Food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.item._id === item._id
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  const addToCartAPI = async (item: Food) => {
    try {
      setCartLoading(true);
      setCartError(null);
      addItemToLocalCart(item);
      const cartItems = [
        {
          foodItemId: item._id,
          name: item.name,
          price: calculateFinalPrice(item.price, item.discount),
          quantity: 1,
        },
      ];

      const response = await api5011.post(`/cart/${customerId}/items`, {
        restaurantId: id,
        items: cartItems,
      });

      // Show success feedback
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);

      console.log("Item added to cart successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setCartError("Failed to add item to cart. Please try again.");
      return null;
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = (item: Food) => {
    addToCartAPI(item);
  };

  const calculateFinalPrice = (price: number, discount: number) => {
    if (!discount) return price;
    return price - price * (discount / 100);
  };

  const CartNotification = () => {
    if (!cartSuccess) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
        Item added to cart successfully!
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Restaurant Not Found
        </h2>
        <p className="text-primary mb-6">
          The restaurant you're looking for doesn't exist or was removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const selectedMenuData = restaurant.menus.find(
    (menu) => menu._id === selectedMenu
  );

  return (
    <div className="min-h-screen pb-12 mt-20">
      <div>
        <div className="container mx-auto py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center font-semibold text-primary hover:text-text_dark dark:text-text_white dark:hover:text-accent transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Restaurants</span>
          </button>
        </div>
      </div>

      <div className="relative h-64 md:h-80 overflow-hidden">
        {restaurant.images && restaurant.images.length > 0 ? (
          <img
            src={restaurant.images[activeImageIndex]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex flex-col items-center justify-center">
            <Ban className="mx-auto mb-2" size={20} />
            <p className="text-primary font-semibold text-sm">
              No image available
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {restaurant.images && restaurant.images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            {restaurant.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${index === activeImageIndex
                    ? "border-primary/90 dark:border-accent/90 scale-110"
                    : "border-white/80"
                  }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-dark rounded-md shadow-md p-6 -mt-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-text_white">
                {restaurant.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 text-sm font-medium dark:text-text_white/80">
                  {average} ({reviews.length} reviews)
                </span>
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

            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="flex items-center text-text_dark font-semibold dark:text-text_white dark:hover:text-accent">
                <Heart size={18} className="mr-2 text-accent dark:text-white" />
                <span>Save</span>
              </button>
              <div>|</div>
              <button className="flex items-center text-text_dark font-semibold dark:text-text_white dark:hover:text-accent">
                <Share2
                  size={18}
                  className="mr-2 text-primary dark:text-white"
                />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin
                  size={20}
                  className="text-gray_800 dark:text-text_white mt-1 flex-shrink-0"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary dark:text-accent">
                    Address
                  </h3>
                  <p className="text-gray_600 font-medium dark:text-text_white/80 text-sm">
                    {restaurant.address.shopNumber}, {restaurant.address.street}
                    , {restaurant.address.town}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone
                  size={20}
                  className="text-gray_800 dark:text-text_white mt-1 flex-shrink-0"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary dark:text-accent">
                    Contact
                  </h3>
                  <p className="text-gray_600 font-medium dark:text-text_white/80 text-sm">
                    {restaurant.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Utensils
                  size={20}
                  className="text-gray_800 dark:text-text_white mt-1 flex-shrink-0"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary dark:text-accent">
                    Available Menus
                  </h3>
                  <p className="text-gray_600 font-medium dark:text-text_white/80 text-sm">
                    {restaurant.menus.length} Menu
                    {restaurant.menus.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock
                  size={20}
                  className="text-gray_800 dark:text-text_white mt-1 flex-shrink-0"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary dark:text-accent">
                    Last Updated
                  </h3>
                  <p className="text-gray_600 font-medium dark:text-text_white/80 text-sm">
                    {new Date(restaurant.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray_500 dark:border-white w-full" />

          <div className="flex flex-wrap gap-6 mt-8">
            <a
              href={`https://maps.google.com/?q=${restaurant.address.street},${restaurant.address.town}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-text_dark hover:text-accent font-semibold dark:text-text_white dark:hover:text-accent"
            >
              <MapPin size={18} className="mr-2 text-accent" />
              <span>Get Directions</span>
            </a>
            <div className="flex items-center">|</div>
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center text-text_dark font-semibold hover:text-success dark:text-text_white dark:hover:text-success"
            >
              <Phone size={18} className="mr-2 text-success" />
              <span>Call Restaurant</span>
            </a>

            {cart.length > 0 && (
              <button className="flex px-6 items-center ml-auto text-primary font-semibold hover:text-dark dark:text-accent dark:hover:text-white">
                <ShoppingBag size={18} className="mr-2" />
                <span>
                  View Cart{" | "}
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      {cartSuccess && <CartNotification />}
      {/* Show error if any */}
      {cartError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          {cartError}
        </div>
      )}

      <div className="container mx-auto px-4 mt-8">
        <div className="border-b border-gray-300">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange("menu")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "menu"
                  ? "border-dark text-dark dark:text-text_white dark:border-white"
                  : "border-transparent text-primary hover:text-text_gray_600 hover:border-gray-300 dark:text-accent dark:hover:text-white"
                }`}
            >
              Menu
            </button>
            <button
              onClick={() => handleTabChange("photos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "photos"
                  ? "border-dark text-dark dark:text-text_white dark:border-white"
                  : "border-transparent text-primary hover:text-text_gray_600 hover:border-gray-300 dark:text-accent dark:hover:text-white"
                }`}
            >
              Photos
            </button>
            <button
              onClick={() => handleTabChange("about")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "about"
                  ? "border-dark text-dark dark:text-text_white dark:border-white"
                  : "border-transparent text-primary hover:text-text_gray_600 hover:border-gray-300 dark:text-accent dark:hover:text-white"
                }`}
            >
              Information
            </button>
          </nav>
        </div>

        <div className="py-6">
          {activeTab === "menu" && (
            <div>
              {restaurant.menus.length > 0 && (
                <div className="mb-6 flex overflow-x-auto space-x-2 pb-2">
                  {restaurant.menus.map((menu) => (
                    <button
                      key={menu._id}
                      onClick={() => setSelectedMenu(menu._id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${selectedMenu === menu._id
                          ? "bg-primary text-white dark:bg-accent"
                          : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-dark dark:text-text_white dark:hover:bg-accent"
                        } border border-gray-200 dark:border-black shadow-sm transition`}
                    >
                      {menu.title}
                      {menu.offers && (
                        <span className="ml-2 inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {menu.offerDiscount}% OFF
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {selectedMenuData && (
                <div className="bg-white dark:bg-dark_bg rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-dark dark:text-text_white">
                      {selectedMenuData.title}
                    </h2>
                    <p className="text-md text-text_gray_800 mt-2 dark:text-text_white/80">
                      {selectedMenuData.description}
                    </p>

                    {selectedMenuData.offers && (
                      <div className="mt-4 bg-accent/20 border border-accent/10 rounded-lg p-4">
                        <p className="text-accent/70 font-semibold text-sm ">
                          Special Offer: {selectedMenuData.offerDiscount}% off
                          on this menu...
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedMenuData.images &&
                    selectedMenuData.images.length > 0 && (
                      <div className="border-b border-gray-200">
                        <div className="p-6">
                          <h3 className="flex flex-row text-md font-medium mb-4 dark:text-text_white">
                            {" "}
                            <Images
                              size={20}
                              className="mr-2 text-accent dark:text-white"
                            />{" "}
                            Menu Photos
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {selectedMenuData.images.map((img, idx) => (
                              <div
                                key={idx}
                                className="rounded-lg overflow-hidden"
                              >
                                <img
                                  src={img}
                                  alt={`${selectedMenuData.title} image ${idx + 1
                                    }`}
                                  className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="p-6">
                    <h3 className="flex flex-row text-md font-medium mb-4 dark:text-text_white">
                      {" "}
                      <CookingPot
                        size={20}
                        className="mr-2 text-accent dark:text-white"
                      />{" "}
                      Food Items
                    </h3>

                    {selectedMenuData.items &&
                      selectedMenuData.items.length > 0 ? (
                      <div className="space-y-6">
                        {Array.from(
                          new Set(
                            selectedMenuData.items.map(
                              (item) => item.category?.name
                            )
                          )
                        ).map((categoryName) => (
                          <div key={categoryName} className="mb-6">
                            <h4 className="text-lg font-medium mb-3 pb-1 border-b border-gray-200">
                              {categoryName}
                            </h4>
                            <div
                              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                              key={categoryName}
                            >
                              {selectedMenuData.items
                                .filter(
                                  (item) => item.category?.name === categoryName
                                )
                                .map((item) => (
                                  <div
                                    key={item._id}
                                    className="bg-white dark:bg-dark_bg border border-gray-200 dark:border-black rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                  >
                                    {item.images && item.images.length > 0 ? (
                                      <div
                                        className="w-80 h-60"
                                        key={item.images[0]}
                                      >
                                        <img
                                          src={item.images[0]}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : null}

                                    <div className="p-3" key={item.name}>
                                      <h5 className="font-medium text-sm truncate text-dark dark:text-text_white">
                                        {item.name}
                                      </h5>
                                      <p className="text-gray-600 text-xs h-8 overflow-hidden dark:text-text_white/80">
                                        {item.description}
                                      </p>

                                      <div
                                        className="flex items-center justify-between mt-2"
                                        key={item.price}
                                      >
                                        <div>
                                          {item.discount > 0 ? (
                                            <>
                                              <span className="text-sm font-bold text-primary dark:text-text_white">
                                                <span className="text-dark dark:text-text_white font-bold text-sm">
                                                  Price{" "}
                                                </span>
                                                {calculateFinalPrice(
                                                  item.price,
                                                  item.discount
                                                ).toFixed(2)}
                                              </span>
                                              <span className="text-xs text-gray-500 line-through ml-1">
                                                ${item.price.toFixed(2)}
                                              </span>
                                            </>
                                          ) : (
                                            <span className="text-xl font-bold text-primary">
                                              <span className="text-dark dark:text-text_white font-bold text-sm">
                                                Price{" "}
                                              </span>
                                              ${item.price?.toFixed(2)}
                                            </span>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => addToCart(item)}
                                          className="flex px-2 items-center text-text_dark hover:text-primary font-semibold dark:text-text_white dark:hover:text-accent hover:scale-105 transition-transform duration-200"
                                        >
                                          <span className="px-2 text-semibold text-md text-dark dark:text-text_white">
                                            Add to
                                          </span>
                                          <ShoppingCart
                                            size={24}
                                            className="mr-2 text-primary dark:text-white"
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <UtensilsCrossed
                          className="mx-auto mb-4 text-accent"
                          size={48}
                        />
                        <p className="text-primary">
                          No food items available in this menu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {restaurant.menus.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-primary">
                    This restaurant has no menus available.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="bg-white dark:bg-dark_bg rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Photos</h2>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Restaurant Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {restaurant.images &&
                    restaurant.images.map((img, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Restaurant image ${idx + 1}`}
                          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {restaurant.menus.map(
                (menu) =>
                  menu.images &&
                  menu.images.length > 0 && (
                    <div key={menu._id} className="mb-8">
                      <h3 className="text-lg font-medium mb-4">
                        {menu.title} Photos
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {menu.images.map((img, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden">
                            <img
                              src={img}
                              alt={`${menu.title} image ${idx + 1}`}
                              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}

              <div>
                <h3 className="text-lg font-medium mb-4">Food Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {restaurant.menus.flatMap((menu) =>
                    menu.items.flatMap((item) =>
                      item.images.map((img, idx) => (
                        <div
                          key={`${item._id}-${idx}`}
                          className="rounded-lg overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`${item.name} image`}
                            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                          />
                          <div className="p-2 bg-white dark:bg-dark_bg border-t border-gray-200">
                            <p className="text-sm font-medium">{item.name}</p>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white dark:bg-dark_bg rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">
                Restaurant Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-primary">Name</p>
                      <p>{restaurant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Contact Number
                      </p>
                      <p>{restaurant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Address
                      </p>
                      <p>
                        {restaurant.address.shopNumber},{" "}
                        {restaurant.address.street}, {restaurant.address.town}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">Status</p>
                      <p className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                        {restaurant.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Registered Since
                      </p>
                      <p>
                        {new Date(restaurant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Last Updated
                      </p>
                      <p>
                        {new Date(restaurant.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Available Menus
                      </p>
                      <p>{restaurant.menus.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Total Food Items
                      </p>
                      <p>
                        {restaurant.menus.reduce(
                          (total, menu) => total + menu.items.length,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {currentReview ? (
        <div className="w-full max-w-3xl mx-auto p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            What Our Customers Say
          </h2>

          <div className="w-full relative min-h-40 mb-5">
            <div className="absolute -left-3 top-8 text-gray-300 opacity-20">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.48 2.13-2.02l-1.65-2.88c-.62.38-1.24.88-1.86 1.5-.62.62-1.19 1.32-1.7 2.1-.51.78-.92 1.65-1.24 2.61-.32.96-.48 1.95-.48 2.97 0 1.43.28 2.6.84 3.51.56.91 1.26 1.58 2.1 2.01.85.43 1.72.65 2.64.65.92 0 1.78-.15 2.58-.45.8-.3 1.45-.75 1.96-1.35.51-.6.77-1.34.77-2.22v-.67h-4.41c.01 1.48.52 2.22 1.51 2.22.23 0 .48-.05.75-.15.27-.1.53-.25.78-.45l.72 1.78c-.21.23-.48.44-.81.63-.33.19-.67.33-1.02.42-.35.09-.7.13-1.05.13-.5 0-.95-.08-1.37-.25-.42-.17-.78-.39-1.08-.67-.29-.28-.52-.61-.67-.99-.15-.38-.22-.8-.22-1.26z" />
                <path d="M22.442 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.48 2.13-2.02l-1.65-2.88c-.62.38-1.24.88-1.86 1.5-.62.62-1.19 1.32-1.7 2.1-.51.78-.92 1.65-1.24 2.61-.32.96-.48 1.95-.48 2.97 0 1.43.28 2.6.84 3.51.56.91 1.26 1.58 2.1 2.01.85.43 1.72.65 2.64.65.92 0 1.78-.15 2.58-.45.8-.3 1.45-.75 1.96-1.35.51-.6.77-1.34.77-2.22v-.67h-4.41c.01 1.48.52 2.22 1.51 2.22.23 0 .48-.05.75-.15.27-.1.53-.25.78-.45l.72 1.78c-.21.23-.48.44-.81.63-.33.19-.67.33-1.02.42-.35.09-.7.13-1.05.13-.5 0-.95-.08-1.37-.25-.42-.17-.78-.39-1.08-.67-.29-.28-.52-.61-.67-.99-.15-.38-.22-.8-.22-1.26z" />
              </svg>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex space-x-1 mb-4">
                  {renderStars(currentReview.rating)}
                </div>

                <p className="text-gray-700 text-lg italic mb-6 font-light">
                  "{currentReview.comment}"
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <UserCircle size={24} className="text-gray-400" />
                  <p className="font-medium text-gray-800">
                    {currentReview?.food}
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  {formatDate(currentReview.createdAt)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prevReview}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center"
              aria-label="Next review"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <button
            onClick={toggleAutoplay}
            className={`mt-4 text-sm px-3 py-1 rounded-full transition-colors duration-200 ${autoplayEnabled
                ? "bg-primary/30 text-primary/90"
                : "bg-primary/20 text-primary/60"
              }`}
          >
            {autoplayEnabled ? "Pause Autoplay" : "Enable Autoplay"}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-full mx-4 p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center">
          <p className="text-xl font-semibold mb-2 text-gray-800">
            No Reviews Yet
          </p>
          <p className="text-gray-600 italic mb-4">
            Be the first to leave a review!
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
