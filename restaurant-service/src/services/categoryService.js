import Category from "../schema/Category.js";

export const addCategoryService = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

export const deleteCategoryService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) return null;

  await Category.findByIdAndDelete(categoryId);
  return category;
};
