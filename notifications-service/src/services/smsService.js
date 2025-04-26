import twilio from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} from "../config/index.js";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendSMS = async ({ to, body }) => {
  try {
    const message = await client.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("[✅] SMS sent:", message.sid);
  } catch (error) {
    console.error("[❌] Failed to send SMS:", error);
    throw error;
  }
};
