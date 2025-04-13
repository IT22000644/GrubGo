const mongoose = require("mongoose");

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

module.exports = mongoose.model("FoodMenu", FoodMenuSchema);
