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
    available: { type: Boolean, default: true },
    offers: { type: Boolean, default: false },
    offerDiscount: { type: Number, default: 0, required: false },
    description: { type: String, required: false },
    images: [{ type: String, required: true }],
    items: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: false },
    ],
  },
  { timestamps: true }
);

const FoodMenu = mongoose.model("FoodMenu", FoodMenuSchema);

export default FoodMenu;
