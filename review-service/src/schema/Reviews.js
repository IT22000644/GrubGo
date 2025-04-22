import mongoose from "mongoose";
import Food from "../../../restaurant-service/src/schema/Food.js";
import Restaurant from "../../../restaurant-service/src/schema/Restaurant.js";
//import User from "../../../user-service/src/models/user.model.js";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
