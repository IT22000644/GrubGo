import mongoose from "mongoose";

const LatLngSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  driverId: { type: String, required: true },
  driverLocation: { type: LatLngSchema, required: true },
  restaurantLocation: { type: LatLngSchema, required: true },
  customerLocation: { type: LatLngSchema, required: true },

  // Stores when each status should occur (for cron job)

  assignedAt: { type: Date, required: true },
  inTransitAt: { type: Date, required: true },
  arrivedRestaurantAt: { type: Date, required: true },

  pickedUpAt: { type: Date },
  inTransitPickedUpAt: { type: Date },
  arrivedCustomerAt: { type: Date },

  deliveredAt: { type: Date },

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

  estimatedTimeToRestaurant: { type: Number },
  estimatedTimeToCustomer: { type: Number },
  expectedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  actualTimeElapsed: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
