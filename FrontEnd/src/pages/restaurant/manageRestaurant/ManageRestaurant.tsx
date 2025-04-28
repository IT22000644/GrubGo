import { RootState } from "../../../app/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Ban,
  CookingPot,
  DoorClosed,
  DoorOpen,
  Images,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import Modal from "../../../components/modal/Modal";
import MenuTable from "./MenuTable";
import { FoodMenu, Restaurant } from "./ManageRestaurant.types";
import CategorySelector from "./categorySelector/CategorySelector";
import api from "../../../api/api";

type Review = {
  _id: string;
  user: string;
  restaurant: string;
  food: string;
  rating: number;
  comment: string;
  createdAt: string;
};
export const ManageRestaurant = () => {
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [updateRestaurant, setUpdateRestaurant] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [menus, setMenus] = useState<FoodMenu[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [offers, setOffers] = useState(false);
  const [offerDiscount, setOfferDiscount] = useState(0);
  const [images, setImages] = useState<FileList | null>(null);
  const [singleMenu, setSingleMenu] = useState<FoodMenu | null>(null);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const [foodTitle, setFoodTitle] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodPrice, setFoodPrice] = useState(0);
  const [foodDiscount, setFoodDiscount] = useState(0);
  const [foodImages, setFoodImages] = useState<FileList | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const ownerId = useSelector((state: RootState) => state.auth.user?._id);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurant/owner/${ownerId}`);
      setRestaurant(response.data.restaurant);
      setRestaurantId(response.data.restaurant._id);
      setMenus(response.data.restaurant.menus);
      if (response.data.restaurant?.menus?.length > 0) {
        setSelectedMenu(response.data.restaurant.menus[0]._id);
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails();
    }
    console.log(menus);
  }, [restaurantId]);

  const handleEdit = (id: string) => {
    console.log("Edit menu", id);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/foodMenu/${id}`);
    fetchRestaurantDetails();
  };

  function getAverageRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (restaurantId) {
      formData.append("restaurant", restaurantId);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("available", available.toString());
    formData.append("offers", offers.toString());
    formData.append("offerDiscount", offerDiscount.toString());

    if (images) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const response = await api.post("/foodMenu/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      alert("Menu added successfully!");
      setShowAddMenu(false);
      console.log("Menu added:", response.data);
      fetchRestaurantDetails();
    } catch (error) {
      console.error("Error uploading menu:", error);
    }
  };

  const handleFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (singleMenu?._id) {
      formData.append("foodMenu", singleMenu._id);
    }
    formData.append("description", foodDescription);
    formData.append("name", foodTitle);
    formData.append("price", foodPrice.toString());
    formData.append("discount", foodDiscount.toString());
    formData.append("category", selectedCategoryId);

    if (foodImages) {
      Array.from(foodImages).forEach((image) => {
        formData.append("images", image);
      });
    }
    try {
      const response = await api.post("/food/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      alert("Food item added successfully!");
      setShowAddFood(false);
      fetchRestaurantDetails();
    } catch (error) {
      console.error("Error uploading food item:", error);
    }
  };

  const selectedMenuData = restaurant?.menus.find(
    (menu) => menu._id === selectedMenu
  );

  const calculateFinalPrice = (price: number, discount: number) => {
    if (!discount) return price;
    return price - price * (discount / 100);
  };

  return (
    <div className="min-h-screen pb-12 mt-20">
      <div className="relative h-64 md:h-80 overflow-hidden">
        {restaurant && restaurant.images && restaurant.images.length > 0 ? (
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

        {restaurant && restaurant.images && restaurant.images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            {restaurant.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  index === activeImageIndex
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

      <div className="mt-12 relative z-10">
        <h2 className="text-3xl font-bold mb-6">
          Welcome back,{" "}
          <span className="text-sm text-success">{restaurant?.name}</span>
        </h2>
        <h2 className="text-xl font-bold mb-6">Restaurant Information</h2>

        <div className="w-full">
          {restaurant && restaurant.images && restaurant.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-1">
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
                  <p className="text-sm font-medium text-primary">Address</p>
                  <p>
                    {restaurant.address.shopNumber}, {restaurant.address.street}
                    , {restaurant.address.town}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Status</p>
                  <p className="inline-block text-sm font-medium ">
                    {restaurant.status === "open" ? (
                      <span className="flex items-center gap-1 text-green-500 bg-green-100 px-2 py-1 rounded-md">
                        <DoorOpen size={16} /> Open
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 bg-red-100 px-2 py-1 rounded-md">
                        <DoorClosed size={16} /> Closed
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    Overall Rating
                  </p>
                  <div className="flex flex-row items-center">
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
                    <p>{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Last Updated
                    </p>
                    <p>{new Date(restaurant.updatedAt).toLocaleDateString()}</p>
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

              <div>
                <h3 className="text-lg font-medium mb-4">Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setUpdateRestaurant(true)}
                    className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
                  >
                    Update Restaurant
                  </button>
                  <button
                    onClick={() => setShowAddMenu(true)}
                    className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
                  >
                    Add Menu
                  </button>
                  <button
                    onClick={() => setShowAllMenu(true)}
                    className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
                  >
                    See All Menus
                  </button>
                  <button
                    onClick={() => setShowAddMenu(true)}
                    className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
                  >
                    Owner Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mt-20 text-xl font-bold mb-6">
          Menus & Foods Information
        </h2>
        {restaurant && restaurant.menus.length > 0 && (
          <div className=" my-6 flex overflow-x-auto space-x-2 pb-2">
            {restaurant.menus.map((menu) => (
              <button
                key={menu._id}
                onClick={() => setSelectedMenu(menu._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedMenu === menu._id
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

        {selectedMenu && (
          <div className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-dark dark:text-text_white">
                {selectedMenuData?.title}
              </h2>
              <p className="text-md text-text_gray_800 mt-2 dark:text-text_white/80">
                {selectedMenuData?.description}
              </p>

              {selectedMenuData?.offers && (
                <div className="mt-4 bg-accent/20 border border-accent/10 rounded-lg p-4">
                  <p className="text-accent/70 font-semibold text-sm ">
                    Special Offer: {selectedMenuData.offerDiscount}% off on this
                    menu...
                  </p>
                </div>
              )}
            </div>

            {selectedMenuData?.images && selectedMenuData.images.length > 0 && (
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
                      <div key={idx} className="rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`${selectedMenuData.title} image ${idx + 1}`}
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

              {selectedMenuData?.items && selectedMenuData.items.length > 0 ? (
                <div className="space-y-6">
                  {Array.from(
                    new Set(
                      selectedMenuData.items.map((item) => item.category?.name)
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
                              className="overflow-hidden transition-shadow mt-6"
                            >
                              {item.images && item.images.length > 0 ? (
                                <div className="w-80 h-60" key={item.images[0]}>
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

        {restaurant?.menus.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-primary">
              This restaurant has no menus available.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        title="Add Menu"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Menu Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Menu Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="Menu Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1 flex flex-row">
            <label
              htmlFor="available"
              className="text-sm font-medium text-gray-700 flex items-center mr-4"
            >
              Available
            </label>

            <input
              type="checkbox"
              name="available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
          </div>

          <div className="space-y-1 flex flex-row justify-start">
            <label
              htmlFor="offers"
              className="text-sm font-medium text-gray-700 flex items-center mr-4"
            >
              Offers
            </label>
            <input
              type="checkbox"
              name="offers"
              checked={offers}
              onChange={(e) => setOffers(e.target.checked)}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="discount"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Discount (if any)
            </label>
            <input
              type="number"
              name="offerDiscount"
              placeholder="Offer Discount %"
              value={offerDiscount}
              onChange={(e) => setOfferDiscount(+e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="menuImages"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Menu Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          >
            Add Menu
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        title="Add Food"
      >
        <form
          onSubmit={handleFoodSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Food Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Food Title"
              value={foodTitle}
              onChange={(e) => setFoodTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="Food Description"
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Food Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Food Price"
              value={foodPrice}
              onChange={(e) => setFoodPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="discount"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Discount (if any)
            </label>
            <input
              type="number"
              name="Food Discount"
              placeholder="Offer Discount %"
              value={foodDiscount}
              onChange={(e) => setFoodDiscount(Number(e.target.value) + 0.0)}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="foodImages"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Menu Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFoodImages(e.target.files)}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
            />
          </div>

          <CategorySelector onCategorySelect={setSelectedCategoryId} />

          <button
            type="submit"
            className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
          >
            Add Menu
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={showAllMenu}
        onClose={() => setShowAllMenu(false)}
        title="All Menus"
      >
        <MenuTable
          menus={menus}
          onView={(menu) => {
            setShowAllMenu(false);
            setSingleMenu(menu);
            setShowViewMenu(true);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddFood={(menu) => {
            setShowAllMenu(false);
            setSingleMenu(menu);
            setShowAddFood(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={showViewMenu}
        onClose={() => setShowViewMenu(false)}
        title="View Menu"
      >
        {singleMenu ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{singleMenu.title}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span>{" "}
              {singleMenu.description}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Available:</span>{" "}
              {singleMenu.available ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Offers: </span>
              {singleMenu.offers ? "Yes" : "No"}
            </p>
            {singleMenu.offers && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Offer Discount: </span>{" "}
                {singleMenu.offerDiscount}%
              </p>
            )}
            <div>
              <h4 className="text-md font-medium mb-2">Items:</h4>
              <ul className="list-disc list-inside space-y-1">
                {singleMenu.items.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {item.name} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            {singleMenu.images && singleMenu.images.length > 0 && (
              <div>
                <h4 className="text-md font-medium mb-2">Images:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {singleMenu.images.map((image, index) => (
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
