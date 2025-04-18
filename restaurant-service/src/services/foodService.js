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
  return await Food.findById(id).populate("foodMenu").populate("category");
};

export const getFoodsByCategoryService = async (categoryId) => {
  return await Food.find({ category: categoryId }).populate("category");
};

export const getFoodsByMenuService = async (menuFoodIds) => {
  return await Food.find({ _id: { $in: menuFoodIds } }).populate("category");
};

export const deleteFoodService = async (foodId) => {
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    throw new Error("Invalid food ID");
  }

  const food = await Food.findByIdAndDelete(foodId);
  if (!food) return null;

  await FoodMenu.updateMany({ items: foodId }, { $pull: { items: foodId } });

  return food;
};
