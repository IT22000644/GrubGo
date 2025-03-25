import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: { lat: Number, lng: Number }, // Restaurant location
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
