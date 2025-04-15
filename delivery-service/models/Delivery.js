import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  driverId: { type: String, required: true },
  customerLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  restaurantLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: [
      "Assigned",
      "In Transit",
      "Arrived Restaurant",
      "Picked Up",
      "In Transit - Picked Up",
      "Arrived Customer",
      "Delivered",
    ],
    default: "Assigned",
  },

  estimatedDeliveryTime: { type: Number },
  estimatedTimeToRestaurant: { type: Number },
  estimatedTimeToCustomer: { type: Number },

  expectedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  actualTimeElapsed: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
