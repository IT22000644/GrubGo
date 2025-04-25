import { sendEmail } from "../services/emailService.js";
import { sendSMS } from "../services/smsService.js";

export const handleNotification = async (channel, msg) => {
  const content = JSON.parse(msg.content.toString());

  try {
    switch (content.type) {
      case "EMAIL":
        await sendEmail(content.payload);
        break;
      case "SMS":
        await sendSMS(content.payload);
        break;
      default:
        console.warn(`Unknown notification type: ${content.type}`);
    }

    channel.ack(msg);
  } catch (error) {
    console.error("Error processing notification:", error);
    channel.nack(msg);
  }
};
