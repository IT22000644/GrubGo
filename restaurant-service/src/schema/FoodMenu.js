import mongoose from "mongoose";
import Food from "./Food.js";
import Restaurant from "./Restaurant.js";

const FoodMenuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: false },
    items: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: false },
    ],
  },
  { timestamps: true }
);

const FoodMenu = mongoose.model("FoodMenu", FoodMenuSchema);

export default FoodMenu;
