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
  // TODO: user get by id
};

export const getAllUsers = async (req, res) => {};
