import Restaurant from "../../src/schema/Restaurant.js";

export const registerRestaurant = async (restaurantData) => {
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
  restaurant.phone = updateData.phone || restaurant.phone;
  restaurant.restaurantOwner =
    updateData.restaurantOwner || restaurant.restaurantOwner;
  restaurant.menus = updateData.menus || restaurant.menus;
  restaurant.images = updateData.images || restaurant.images;

  return await restaurant.save();
};
