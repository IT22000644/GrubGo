import amqplib from "amqplib";
import { RABBITMQ_URL } from "../config/index.js";

const queueName = "notification";

export async function connectQueue() {
  try {
    const conn = await amqplib.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log(`[✅] Connected to RabbitMQ queue: ${queueName}`);
    return channel;
  } catch (err) {
    console.error("[❌] RabbitMQ connection error:", err);
  }
}
