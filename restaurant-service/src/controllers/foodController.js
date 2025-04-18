import { updateFoodMenuService } from "../services/foodMenuService.js";
import {
  addFoodService,
  deleteFoodService,
  getFoodByIdService,
  getFoodsByCategoryService,
  updateFoodService,
} from "../services/foodService.js";

export const foodController = {
  addFood: async (req, res) => {
    try {
      const { name, description, price, category, foodMenu } = req.body;

      const imagePaths = req.files
        ? req.files.map(
            (file) =>
              `${req.protocol}://${req.get("host")}/${file.path.replace(
                /\\/g,
                "/"
              )}`
          )
        : [];

      const foodData = {
        name,
        description,
        price,
        category,
        images: imagePaths,
        foodMenu,
      };

      const newFood = await addFoodService(foodData);
      if (foodMenu) {
        await updateFoodMenuService(foodMenu, {
          $push: { items: newFood._id },
        });
      }

      res.status(201).json({
        message: "Food item added successfully",
        food: newFood,
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to add food item",
        error: error.message,
      });
    }
  },
  updateFood: async (req, res) => {
    const { id } = req.params;
    const { name, price, description, discount, category } = req.body;
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    try {
      const updatedData = {
        name,
        price,
        description,
        discount,
        category,
        images: imagePaths.length > 0 ? imagePaths : existingFood.images,
      };

      const updatedFood = await updateFoodService(id, updatedData);

      res.status(200).json({
        message: "Food item updated successfully",
        food: updatedFood,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update food item",
        error: error.message,
      });
    }
  },
  getFoodsByCategory: async (req, res) => {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID",
        field: "categoryId",
      });
    }

    try {
      const foods = await getFoodsByCategoryService(categoryId);
      res.status(200).json({ foods });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching foods by category",
        error: error.message,
      });
    }
  },
  getFoodById: async (req, res) => {
    const { foodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        message: "Invalid food ID",
        field: "foodId",
      });
    }

    try {
      const food = await getFoodByIdService(foodId);

      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.status(200).json({ food });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching food item",
        error: error.message,
      });
    }
  },
  deleteFood: async (req, res) => {
    const { foodId } = req.params;

    try {
      const deletedFood = await deleteFoodService(foodId);

      if (!deletedFood) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.status(200).json({
        message: "Food item deleted successfully and removed from menus",
        food: deletedFood,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting food item",
        error: error.message,
      });
    }
  },
};
