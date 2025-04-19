import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Restaurant, Food } from "../allRestaurants/AllRestaurants.types";
import api from "../../../api/axios";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  ChevronLeft,
  Calendar,
  Utensils,
  DollarSign,
  Heart,
  Share2,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { Loader } from "../../common/loader";

export const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("menu");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [cart, setCart] = useState<{ item: Food; quantity: number }[]>([]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data.restaurant);
        console.log(response);
        if (response.data.restaurant?.menus?.length > 0) {
          setSelectedMenu(response.data.restaurant.menus[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurantDetails();
    }
  }, [id]);

  const addToCart = (item: Food) => {
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

  const calculateFinalPrice = (price: number, discount: number) => {
    if (!discount) return price;
    return price - price * (discount / 100);
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
        <p className="text-gray-500 mb-6">
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
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {restaurant.images && restaurant.images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            {restaurant.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  index === activeImageIndex
                    ? "border-blue-500 scale-110"
                    : "border-white/50"
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
        <div className="bg-white rounded-xl shadow-md p-6 -mt-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
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
                <span className="ml-2 text-gray-600 text-sm">
                  4.5 (120 reviews)
                </span>
              </div>
              <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                {restaurant.status}
              </div>
            </div>

            <div className="flex space-x-3 mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart size={18} className="mr-2 text-red-500" />
                <span>Save</span>
              </button>
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 size={18} className="mr-2 text-blue-500" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin
                  size={20}
                  className="text-gray-500 mt-1 flex-shrink-0"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-gray-700">
                    {restaurant.address.shopNumber}, {restaurant.address.street}
                    , {restaurant.address.town}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p className="text-gray-700">{restaurant.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Utensils
                  size={20}
                  className="text-gray-500 mt-1 flex-shrink-0"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">
                    Available Menus
                  </h3>
                  <p className="text-gray-700">
                    {restaurant.menus.length} Menu
                    {restaurant.menus.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <p className="text-gray-700">
                    {new Date(restaurant.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={`https://maps.google.com/?q=${restaurant.address.street},${restaurant.address.town}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <MapPin size={18} className="mr-2" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone size={18} className="mr-2" />
              <span>Call Restaurant</span>
            </a>

            {cart.length > 0 && (
              <button className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ml-auto">
                <ShoppingBag size={18} className="mr-2" />
                <span>
                  View Cart (
                  {cart.reduce((total, item) => total + item.quantity, 0)})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="border-b border-gray-300">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange("menu")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "menu"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => handleTabChange("photos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "photos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => handleTabChange("about")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "about"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                        selectedMenu === menu._id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold">
                      {selectedMenuData.title}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {selectedMenuData.description}
                    </p>

                    {selectedMenuData.offers && (
                      <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-red-700 font-medium">
                          Special Offer: {selectedMenuData.offerDiscount}% off
                          on this menu!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Menu Images */}
                  {selectedMenuData.images &&
                    selectedMenuData.images.length > 0 && (
                      <div className="border-b border-gray-200">
                        <div className="p-6">
                          <h3 className="text-lg font-medium mb-4">
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
                                  alt={`${selectedMenuData.title} image ${
                                    idx + 1
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
                    <h3 className="text-lg font-medium mb-4">Food Items</h3>

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
                          <div key={categoryName} className="mb-8">
                            <h4 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                              {categoryName}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {selectedMenuData.items
                                .filter(
                                  (item) => item.category?.name === categoryName
                                )
                                .map((item) => (
                                  <div
                                    key={item._id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex flex-col sm:flex-row">
                                      {/* Food image */}
                                      {item.images && item.images.length > 0 ? (
                                        <div className="sm:w-1/3">
                                          <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-32 sm:h-full object-cover"
                                          />
                                        </div>
                                      ) : null}

                                      {/* Food details */}
                                      <div
                                        className={`p-4 ${
                                          item.images && item.images.length > 0
                                            ? "sm:w-2/3"
                                            : "w-full"
                                        }`}
                                      >
                                        <h5 className="font-medium text-lg">
                                          {item.name}
                                        </h5>
                                        <p className="text-gray-600 text-sm mb-2">
                                          {item.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-4">
                                          <div>
                                            {item.discount > 0 ? (
                                              <>
                                                <span className="text-lg font-bold text-blue-600">
                                                  $
                                                  {calculateFinalPrice(
                                                    item.price,
                                                    item.discount
                                                  ).toFixed(2)}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                  ${item.price.toFixed(2)}
                                                </span>
                                              </>
                                            ) : (
                                              <span className="text-lg font-bold text-blue-600">
                                                ${item.price?.toFixed(2)}
                                              </span>
                                            )}
                                          </div>

                                          <button
                                            onClick={() => addToCart(item)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                          >
                                            Add to Cart
                                          </button>
                                        </div>
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
                        <p className="text-gray-500">
                          No food items available in this menu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {restaurant.menus.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">
                    This restaurant has no menus available.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="bg-white rounded-xl shadow-md p-6">
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

              {/* Food Images */}
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
                          <div className="p-2 bg-white border-t border-gray-200">
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">
                Restaurant Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p>{restaurant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Contact Number
                      </p>
                      <p>{restaurant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p>
                        {restaurant.address.shopNumber},{" "}
                        {restaurant.address.street}, {restaurant.address.town}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
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
                      <p className="text-sm font-medium text-gray-500">
                        Registered Since
                      </p>
                      <p>
                        {new Date(restaurant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Updated
                      </p>
                      <p>
                        {new Date(restaurant.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Available Menus
                      </p>
                      <p>{restaurant.menus.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
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
    </div>
  );
};

export default RestaurantDetails;
