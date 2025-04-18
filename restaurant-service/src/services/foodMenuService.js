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

export const getMenuWithItemsService = async (menuId) => {
  return await FoodMenu.findById(menuId).populate("items");
};

export const deleteFoodMenuService = async (foodMenuId) => {
  if (!mongoose.Types.ObjectId.isValid(foodMenuId)) {
    throw new Error("Invalid food menu ID");
  }

  const menu = await FoodMenu.findByIdAndDelete(foodMenuId);
  if (!menu) return null;

  if (menu.items && menu.items.length > 0) {
    await Food.deleteMany({ _id: { $in: menu.items } });
  }

  return menu;
};
