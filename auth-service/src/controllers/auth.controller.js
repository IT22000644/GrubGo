import axios from "axios";
import bcrypt from "bcrypt";
import Session from "../models/session.model.js";
import LoginAttempt from "../models/loginAttempt.model.js";
import { signToken, verifyJwtToken } from "../utils/jwtUtils.js";
import { USER_SERVICE_URL } from "../config/index.js";
import { sendToQueue } from "../utils/messageQueue.js";

export const register = async (req, res) => {
  const {
    email,
    username,
    password,
    phoneNumber,
    role,
    fullName,
    address,
    licenseNumber,
    vehicleType,
    vehicleModel,
    vehicleColor,
    vehicleNumber,
  } = req.body;

  if (!email || !username || !password || !phoneNumber || !role) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: email, username, password, phoneNumber, or role",
    });
  }

  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const userPayload = {
      email,
      username,
      passwordHash,
      phoneNumber,
      role,
      fullName,
      address,
      licenseNumber,
      vehicleType,
      vehicleModel,
      vehicleColor,
      vehicleNumber,
    };

    const userServiceResponse = await axios.post(
      `${USER_SERVICE_URL}/`,
      userPayload
    );

    const { success, data: user, message } = userServiceResponse.data;

    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    // Sessions & Tokens
    const accessToken = signToken(user);
    const refreshToken = signToken(user, "refresh");

    const session = new Session({
      userId: user._id,
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      deviceInfo: userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await session.save();

    // Notify
    await sendToQueue("notification", {
      type: "EMAIL",
      payload: {
        to: user.email,
        subject: "Welcome to our service",
        body: `Hello ${user.username}, welcome to our service!`,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.error("Error creating user in User-Service:", err.message);

    if (err.response && err.response.data) {
      const { message } = err.response.data;
      return res.status(400).json({
        success: false,
        message: message || "Error from User-Service",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  try {
    let user;
    let success = false;

    try {
      const response = await axios.get(`${USER_SERVICE_URL}/email/${email}`);
      // Check if response contains success and data fields
      if (
        response.data &&
        response.data.success !== undefined &&
        response.data.data
      ) {
        success = response.data.success;
        user = response.data.data;
      } else {
        throw new Error("Invalid response structure from user service");
      }
    } catch (err) {
      console.error("[❌] Error from User Service:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching user data" });
    }

    if (!success || !user) {
      await LoginAttempt.create({ ipAddress, userAgent, success: false });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("[Login] User found:", user);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await LoginAttempt.create({
        userId: user._id,
        ipAddress,
        userAgent,
        success: false,
      });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const existingSession = await Session.findOne({ userId: user._id });

    if (existingSession) {
      // Existing session found -> return the stored refreshToken
      return res.status(400).json({
        success: false,
        message: "User already logged in",
      });
    }

    // Generate tokens
    const accessToken = signToken(user);
    const refreshToken = signToken(user, "refresh");

    // Save session
    await Session.create({
      userId: user._id,
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      deviceInfo: userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Save login attempt
    await LoginAttempt.create({
      userId: user._id,
      ipAddress,
      userAgent,
      success: true,
    });

    // Optionally send notification
    await sendToQueue("notification", {
      type: "EMAIL",
      payload: {
        to: user.email,
        subject: "Login Successful",
        body: `Hello ${user.username}, you just logged in from ${ipAddress}`,
      },
    });

    await sendToQueue("notification", {
      type: "SMS",
      payload: {
        to: user.phoneNumber,
        body: `Hello ${user.username}, you just logged in from ${ipAddress}`,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (err) {
    console.error("[❌] Login error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  let user = null;
  const userInfo = req.headers["x-user-info"];
  if (userInfo) {
    user = JSON.parse(userInfo);
    console.log("User Info:", user);
  } else {
    return res.status(400).json({ message: "No user info provided" });
  }

  const session = await Session.findOne({ userId: user._id });
  if (!session) {
    return res.status(400).json({ message: "No active session found" });
  }

  await Session.deleteOne({ userId: user._id });
  console.log("Session deleted for user:", user._id);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;

  console.log("[🔑] Verifying token:", token);

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = verifyJwtToken(token);
    console.log("[🔑] Token decoded:", decoded);
    return res.status(200).json({
      success: true,
      data: {
        userId: decoded.id,
        role: decoded.role,
        email: decoded.email,
        username: decoded.username,
      },
    });
  } catch (err) {
    console.error("[❌] Token verification failed:", err.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
