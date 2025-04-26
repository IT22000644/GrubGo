import amqplib from "amqplib";
import { RABBITMQ_URL } from "../config/index.js";

let channel = null;
const queueName = "notification";

export async function connectQueue() {
  try {
    const conn = await amqplib.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`[✅] Connected to RabbitMQ queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        await onMessage(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      }
    });

    return channel;
  } catch (err) {
    console.error("[❌] RabbitMQ connection error:", err);
  }
}
