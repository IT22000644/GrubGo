import mongoose from "mongoose";
import Category from "../schema/Category.js";
import Food from "../schema/Food.js";
import FoodMenu from "../schema/FoodMenu.js";

export const addFoodService = async (foodData) => {
  const categoryExists = await Category.findById(foodData.category);
  if (!categoryExists) {
    throw new Error("Category does not exist");
  }

  const newFood = new Food(foodData);
  return await newFood.save();
};

export const updateFoodService = async (id, updatedData) => {
  return await Food.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
};

export const getFoodByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid food ID");
  }

  const food = await Food.findById(id)
    .populate("foodMenu")
    .populate("category");

  if (food && food.foodMenu) {
    const foodMenu = await FoodMenu.findById(food.foodMenu).populate(
      "restaurant"
    );
    return { ...food.toObject(), restaurant: foodMenu?.restaurant };
  }

  return food;
};

export const getFoodsByCategoryService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Error("Invalid category ID");
  }

  const foods = await Food.find({ category: id }).populate("category");
  return foods;
};

export const getFoodsByMenuService = async (menuFoodIds) => {
  return await Food.find({ _id: { $in: menuFoodIds } }).populate("category");
};

export const deleteFoodService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid food ID");
  }

  const food = await Food.findByIdAndDelete(id);
  if (!food) return null;

  await FoodMenu.updateMany({ items: id }, { $pull: { items: id } });

  return food;
};
