import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  fullName: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ["bike", "car", "scooter"],
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehicleColor: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  currentLocation: {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  totalDeliveries: {
    type: Number,
    default: 0,
  },
});

const Rider = mongoose.model("Rider", riderSchema);
export default Rider;
