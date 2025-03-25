import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  customerLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['Pending', 'Picked Up', 'In Transit', 'Delivered'],
    default: 'Pending',
  },
});

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
