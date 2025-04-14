import FoodMenu from "../../src/schema/FoodMenu.js";
import Restaurant from "../../src/schema/Restaurant.js";

export const addFoodMenuService = async (menuData) => {
  const newMenu = await FoodMenu.create(menuData);

  await Restaurant.findByIdAndUpdate(
    newMenu.restaurant,
    { $push: { menus: newMenu._id } },
    { new: true }
  );

  return newMenu;
};

export const updateFoodMenuService = async (menuId, updateData) => {
  const updatedMenu = await FoodMenu.findByIdAndUpdate(menuId, updateData, {
    new: true,
  });
  return updatedMenu;
};

export const getFoodMenuByIdService = async (id) => {
  return await FoodMenu.findById(id)
    .populate("restaurant", "name address")
    .populate("items");
};
