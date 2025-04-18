import mongoose from "mongoose";
import FoodMenu from "../../src/schema/FoodMenu.js";
import Restaurant from "../../src/schema/Restaurant.js";
import Food from "../schema/Food.js";

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

export const getMenuWithItemsService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid menu ID");
  }
  const menuItems = await FoodMenu.findById(id).populate("items");
  return menuItems;
};

export const deleteFoodMenuService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid menu ID");
  }

  const menu = await FoodMenu.findByIdAndDelete(id);
  if (!menu) return null;

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    menu.restaurant,
    { $pull: { menus: id } },
    { new: true }
  );

  if (updatedRestaurant && updatedRestaurant.menus.length === 0) {
    updatedRestaurant.menus = undefined;
    await updatedRestaurant.save();
  }

  if (menu.items && menu.items.length > 0) {
    await Food.deleteMany({ _id: { $in: menu.items } });
  }

  return menu;
};
