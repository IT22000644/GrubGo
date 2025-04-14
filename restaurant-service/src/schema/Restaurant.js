import mongoose from "mongoose";
import FoodMenu from "./FoodMenu.js";

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      shopNumber: { type: String, required: true },
      street: { type: String, required: true },
      town: { type: String, required: true },
    },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+?\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    images: [{ type: String, required: true }],
    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodMenu",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
