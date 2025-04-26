import mongoose from "mongoose";

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
