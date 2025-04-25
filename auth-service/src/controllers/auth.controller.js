import axios from "axios";
import Session from "../models/session.model.js";
import LoginAttempt from "../models/loginAttempt.model.js";
import { signToken, verifyJwtToken } from "../utils/jwtUtils.js";

export const register = async (req, res) => {
  const {
    email,
    username,
    password,
    phoneNumber,
    role,
    fullName,
    address,
    riderDetails,
    restaurantDetails,
  } = req.body;

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
    };

    if (role === "driver" && riderDetails) {
      userPayload.riderDetails = riderDetails;
    }

    if (role === "customer" && fullName && address) {
      userPayload.customerDetails = {
        fullName,
        address,
      };
    }

    const userServiceResponse = await axios.post(
      `${USER_SERVICE_URL}/users`,
      userPayload
    );

    const { success, data: user, message } = userServiceResponse.data;

    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    if (role === "restaurant_admin" && restaurantDetails) {
      const restaurantServiceResponse = await axios.post(
        `${RESTAURANT_SERVICE_URL}/restaurants`,
        {
          ...restaurantDetails,
          restaurantOwner: user._id,
        }
      );

      const { success: restaurantSuccess, message: restaurantMessage } =
        restaurantServiceResponse.data;

      if (!restaurantSuccess) {
        return res
          .status(400)
          .json({ success: false, message: restaurantMessage });
      }

      // Sesions & Tokens
      const accessToken = signToken(user);
      const refreshToken = signToken(user, "refresh");

      const session = new Session({
        userId: user._id,
        refreshTokenHash: await bcrypt.hash(refreshToken, 10),
        deviceInfo: userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Notify
      await publishToQueue("notification", {
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
    }
  } catch (err) {
    console.error("Error creating user in User-Service:", err.message);
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
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/email/${email}`
    );
    const { success, data: user } = response.data;

    if (!success || !user) {
      await LoginAttempt.create({ ipAddress, userAgent, success: false });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

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

    // Generate tokens
    const accessToken = generateToken(user, "access");
    const refreshToken = generateToken(user, "refresh");

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
    await publishToQueue("notification", {
      type: "EMAIL",
      payload: {
        to: user.email,
        subject: "Login Successful",
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
  // TODO: Implement logout logic
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = verifyJwtToken(token);

    return res.status(200).json({
      success: true,
      data: {
        userId: decoded.userId,
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
