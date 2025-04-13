const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      shopNumber: { type: String, required: true },
      street: { type: String, required: true },
      town: { type: String, required: true },
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
    images: [{ type: String, required: false }],
    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodMenu" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);
