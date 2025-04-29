import { useEffect, useState } from "react";

import { Category } from "../ManageRestaurant.types";
import api from "../../../../api/api";

type Props = {
  onCategorySelect: (categoryId: string) => void;
};

const CategorySelector = ({ onCategorySelect }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/restaurant/categories/");
        console.log("Categories fetched:", res.data?.categories);
        setCategories(res.data?.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <div className="mb-4">
      <label htmlFor="category" className="block mb-1 font-medium">
        Select Category
      </label>
      {categories?.length === 0 ? (
        <select
          id="category"
          value={selectedCategory}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Choose a category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      ) : (
        <div className="text-center text-gray-500">No categories available</div>
      )}
    </div>
  );
};

export default CategorySelector;
