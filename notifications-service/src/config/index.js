import { config } from "dotenv";

config();

export const {
  RABBITMQ_URL,
  EMAIL_USER,
  EMAIL_PASS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = process.env;
