import mongoose from "mongoose";
import Category from "./Category.js";
import FoodMenu from "./FoodMenu.js";

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    discount: { type: Number, required: false, default: 0 },
    images: [{ type: String, required: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    foodMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodMenu",
      required: false,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", FoodSchema);

export default Food;
