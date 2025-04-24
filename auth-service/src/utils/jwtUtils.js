import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET, JWT_EXPIRATION } from "../config.js";

export const signToken = (user, type) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  if (type === "refresh") {
    return crypto.randomBytes(32).toString("hex");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
