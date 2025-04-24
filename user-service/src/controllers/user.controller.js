import User from "../models/user.model.js";
import Rider from "../models/rider.model.js";
import bcrypt from "bcrypt";
import Customer from "../models/customer.model.js";

export const createUser = async (req, res) => {
  // TODO: user save
  const { email, username, passwordHash, phoneNumber, role } = req.body;
  try {
    const existingUser = await User.find({ email });

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    //save user to db
    const newUser = new User({
      email,
      username,
      passwordHash,
      phoneNumber,
      role,
    });

    const savedUser = await newUser.save();

    // need to add the customer and rider details
    // if the user is customer or rider
    if (role === "customer") {
      const { fullName, address } = req.body.customerDetails;

      const newCustomer = new Customer({
        userId: savedUser._id,
        fullName,
        address,
      });

      await newCustomer.save();
      savedUser.customerDetails = newCustomer;
    } else if (role === "driver") {
      const {
        vehicleType,
        vehicleNumber,
        fullName,
        licenseNumber,
        vehicleModel,
        vehicleColor,
      } = req.body;

      const newRider = new Rider({
        userId: savedUser._id,
        vehicleType,
        vehicleNumber,
        fullName,
        licenseNumber,
        vehicleModel,
        vehicleColor,
      });
      await newRider.save();
      savedUser.riderDetails = newRider;
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "customer") {
      const customer = await Customer.findOne({ userId: user._id });
      if (customer) {
        user.customerDetails = customer;
      }
    }
    if (user.role === "driver") {
      const rider = await Rider.findOne({ userId: user._id });
      if (rider) {
        user.riderDetails = rider;
      }
    }
    if (user.role === "restaurant_admin") {
      const restaurant = await axios.get(
        `${RESTAURANT_SERVICE_URL}/owner/${user._id}`
      );
      if (restaurant) {
        user.restaurantDetails = restaurant;
      }
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {};

export const getActiveRiders = async (req, res) => {
  try {
    const activeRiders = await Rider.find({ isAvailable: true }).select(
      "userId currentLocation"
    );

    if (!activeRiders || activeRiders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active riders found",
      });
    }
    return res.status(200).json({
      success: true,
      data: activeRiders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "customer") {
      const customer = await Customer.findOne({ userId: user._id });
      if (customer) {
        user.customerDetails = customer;
      }
    }

    if (user.role === "driver") {
      const rider = await Rider.findOne({ userId: user._id });
      if (rider) {
        user.riderDetails = rider;
      }
    }

    if (user.role === "restaurant_admin") {
      const restaurant = await axios.get(
        `${RESTAURANT_SERVICE_URL}/owner/${user._id}`
      );
      if (restaurant) {
        user.restaurantDetails = restaurant;
      }
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
