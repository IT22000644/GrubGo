import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicleType: String,
  location: { lat: Number, lng: Number }, // Driver's current location
  isAvailable: { type: Boolean, default: true },
});

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
