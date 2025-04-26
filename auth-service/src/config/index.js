import { config } from "dotenv";

config();

export const {
  JWT_SECRET,
  JWT_EXPIRATION, // 1h
  RABBIT_MQ,
  USER_SERVICE_URL,
  RESTAURANT_SERVICE_URL,
  MONGODB_URI,
} = process.env;
