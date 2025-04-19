import {
  addCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";

export const categoryController = {
  addCategory: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const category = await addCategoryService({ name, description });

      res.status(201).json({
        message: "Category added successfully!",
        category,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add category",
        error: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCategory = await deleteCategoryService(id);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting category",
        error: error.message,
      });
    }
  },
};
