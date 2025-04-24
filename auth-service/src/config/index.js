import { config } from "dotenv";

config();

export const {
  JWT_SECRET,
  JWT_EXPIRATION, // 1h
  NOTIFICATION_QUEUE,
  USER_SERVICE_URL,
  RESTAURANT_SERVICE_URL,
  MONGODB_URI,
} = process.env;
