import User from "../models/user.model.js";
import Rider from "../models/rider.model.js";
import Customer from "../models/customer.model.js";

export const createUser = async (req, res) => {
  const { email, username, passwordHash, phoneNumber, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const newUser = new User({
      email,
      username,
      passwordHash,
      phoneNumber,
      role,
    });

    const savedUser = await newUser.save();

    try {
      if (role === "customer") {
        const { fullName, address } = req.body || {};

        const newCustomer = new Customer({
          userId: savedUser._id,
          fullName,
          address,
        });

        await newCustomer.save();
        savedUser._doc.customerDetails = newCustomer;
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
        savedUser._doc.riderDetails = newRider;
      }
    } catch (err) {
      console.error("Error creating customer/rider:", err.message);

      // 🧹 Rollback: Delete the user if customer/rider creation fails
      await User.findByIdAndDelete(savedUser._id);

      return res.status(500).json({
        success: false,
        message: "Failed to create user details. User rolled back.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let userData = user.toObject();

    if (user.role === "customer") {
      const customer = await Customer.findOne({ userId: user._id });
      if (customer) {
        userData.customerDetails = customer;
      }
    }

    if (user.role === "driver") {
      const rider = await Rider.findOne({ userId: user._id });
      if (rider) {
        userData.riderDetails = rider;
      }
    }

    console.log("User Data:", userData);

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(error);
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
    const user = await User.findOne({ email }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let userData = user.toObject();

    if (user.role === "customer") {
      const customer = await Customer.findOne({ userId: user._id });
      if (customer) {
        userData.customerDetails = customer;
      }
    }

    if (user.role === "driver") {
      const rider = await Rider.findOne({ userId: user._id });
      if (rider) {
        userData.riderDetails = rider;
      }
    }

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRiderLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;

  console.log("Location:", location);

  try {
    const rider = await Rider.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          currentLocation: location || undefined,
        },
      },
      { new: true }
    );

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rider location updated successfully",
      data: rider,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateRiderStatus = async (req, res) => {
  const { id } = req.params;
  const { isAvailable, location } = req.body;
  console.log(location);
  try {
    const rider = await Rider.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          isAvailable,
          currentLocation: location || undefined,
        },
      },
      { new: true }
    );

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Rider status updated to ${
        isAvailable ? "available" : "not available"
      }`,
      data: rider,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
