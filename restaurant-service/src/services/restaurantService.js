import Restaurant from "../../src/schema/Restaurant.js";
import FoodMenu from "../../src/schema/FoodMenu.js";
import Food from "../../src/schema/Food.js";

export const registerRestaurantService = async (restaurantData) => {
  try {
    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    return restaurant;
  } catch (error) {
    throw new Error("Error while adding restaurant: " + error.message);
  }
};

export const updateRestaurantService = async (id, updateData) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) throw new Error("Restaurant not found");
  restaurant.name = updateData.name || restaurant.name;
  restaurant.address = updateData.address || restaurant.address;
  restaurant.description = updateData.description || restaurant.description;
  restaurant.phone = updateData.phone || restaurant.phone;
  restaurant.restaurantOwner =
    updateData.restaurantOwner || restaurant.restaurantOwner;
  restaurant.menus = updateData.menus || restaurant.menus;
  restaurant.images = updateData.images || restaurant.images;

  return await restaurant.save();
};

export const getRestaurantByIdService = async (id) => {
  return await Restaurant.findById(id)
    .populate("restaurantOwner", "-password")
    .populate("menus");
};

export const getAllRestaurantsService = async () => {
  return await Restaurant.find()
    .populate("restaurantOwner", "name email")
    .populate("menus");
};

export const toggleRestaurantStatusService = async (
  restaurantId,
  newStatus
) => {
  return await Restaurant.findByIdAndUpdate(
    restaurantId,
    { status: newStatus },
    { new: true }
  );
};

export const deleteRestaurantService = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return null;
  const menus = await FoodMenu.find({ _id: { $in: restaurant.menus } });

  for (const menu of menus) {
    if (menu.food) {
      await Food.findByIdAndDelete(menu.food);
    }
  }

  if (restaurant.menus?.length > 0) {
    await FoodMenu.deleteMany({ _id: { $in: restaurant.menus } });
  }
  const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

  return deletedRestaurant;
};
