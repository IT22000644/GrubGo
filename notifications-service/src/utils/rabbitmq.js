import amqplib from "amqplib";
import { NOTIFICATION_QUEUE } from "../config";

let channel = null;

export async function connectQueue() {
  try {
    const conn = await amqplib.connect(NOTIFICATION_QUEUE);
    channel = await conn.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`[✅] Connected to RabbitMQ queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        await onMessage(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("[❌] RabbitMQ connection error:", err);
  }
}
