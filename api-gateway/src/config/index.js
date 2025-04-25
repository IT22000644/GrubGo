import { config } from "dotenv";

config();

export const {
  AUTH_SERVICE_URL,
  USER_SERVICE_URL,
  RESTAURANT_SERVICE_URL,
  DELIVERY_SERVICE_URL,
  ORDER_SERVICE_URL,
  PAYMENT_SERVICE_URL,
  REVIEW_SERVICE_URL,
} = process.env;
