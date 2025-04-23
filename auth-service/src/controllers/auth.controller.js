import axios from "axios";
import Session from "../models/session.model";
import LoginAttempt from "../models/login.attempt";
import { signToken } from "../utils/jwtUtils";

export const register = async (req, res) => {
  const {
    email,
    username,
    password,
    phoneNumber,
    role,
    riderDetails,
    restaurantDetails,
  } = req.body;

  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

export const login = async (req, res) => {
  // TODO: Implement login logic
};

export const logout = async (req, res) => {
  // TODO: Implement logout logic
};

export const verifyToken = async (req, res) => {
  // TODO: Implement token verification logic
};
