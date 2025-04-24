const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'process', 'preparing', 'completed', 'delivering', 'done', 'cancelled'],
    default: 'pending'
  },
  Paymentstatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  iscompleted: {
    type: Boolean,
    default: false
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
