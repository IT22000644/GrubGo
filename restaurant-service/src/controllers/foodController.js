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
      const imagePaths = req.files
        ? req.files.map(
            (file) =>
              `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
          )
        : [];

      const deleteUploadedImages = () => {
        imagePaths.forEach((path) => {
          fs.unlink(path, (err) => {
            if (err) console.error("Failed to delete file:", path);
          });
        });
      };

      if (!req.body.name || !req.body.price || !req.body.category) {
        deleteUploadedImages();
        return res.status(400).json({ message: "Image Deleted." });
      }

      const { name, description, price, category, foodMenu } = req.body;

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
    const {
      name,
      price,
      description,
      discount,
      category,
      existingImages = [],
      foodMenu,
    } = req.body;

    const newImagePaths = req.files
      ? req.files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/${file.path.replace(
              /\\/g,
              "/"
            )}`
        )
      : [];

    try {
      const existingFood = await getFoodByIdService(id);
      if (!existingFood) {
        return res.status(404).json({ message: "Food item not found" });
      }

      const updatedImages =
        newImagePaths.length > 0
          ? [...existingImages, ...newImagePaths]
          : existingFood.images;

      const updatedData = {
        name: name ?? existingFood.name,
        price: price ?? existingFood.price,
        description: description ?? existingFood.description,
        discount: discount ?? existingFood.discount,
        category: category ?? existingFood.category,
        images: updatedImages,
        foodMenu: foodMenu ?? existingFood.foodMenu,
      };

      const updatedFood = await updateFoodService(id, updatedData);
      if (foodMenu) {
        await updateFoodMenuService(foodMenu, {
          $addToSet: { items: updatedFood._id },
        });
      }

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
    const { id } = req.params;

    try {
      const foods = await getFoodsByCategoryService(id);
      res.status(200).json({ foods });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching foods by category",
        error: error.message,
      });
    }
  },
  getFoodById: async (req, res) => {
    const { id } = req.params;

    try {
      const food = await getFoodByIdService(id);

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
    const { id } = req.params;

    try {
      const deletedFood = await deleteFoodService(id);

      if (!deletedFood) {
        return res.status(404).json({ message: "Food item not found" });
      }

      if (deletedFood.images?.length) {
        await Promise.all(
          deletedFood.images.map(async (path) => {
            try {
              await fs.promises.unlink(path);
            } catch (err) {
              console.error("Failed to delete file:", path, err);
            }
          })
        );
      }

      res.status(200).json({
        message: "Food item deleted successfully and removed from menus",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting food item",
        error: error.message,
      });
    }
  },
};
