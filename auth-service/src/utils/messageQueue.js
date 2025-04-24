import amqplib from "amqplib";
import { NOTIFICATION_QUEUE } from "../config";

let channel;

export const connectQueue = async () => {
  try {
    const connection = await amqplib.connect(
      NOTIFICATION_QUEUE || "amqp://localhost"
    );
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

export const sendToQueue = async (queue, message) => {
  try {
    if (!channel) {
      console.error(
        "Channel is not initialized. Please connect to RabbitMQ first."
      );
      return;
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message sent to queue ${queue}:`, message);
  } catch (error) {
    console.error("Error sending message to queue:", error);
  }
};
