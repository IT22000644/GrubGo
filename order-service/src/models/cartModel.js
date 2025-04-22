const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  items: [
    {
      foodItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      name: { type: String },
      foodImage: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
