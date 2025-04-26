import { handleNotification } from "./consumers/notificationConsumer.js";
import { connectQueue } from "./utils/rabbitmq.js";

const start = async () => {
  try {
    const channel = await connectQueue();
    const QUEUE_NAME = "notification";
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[✅] Waiting for messages in ${QUEUE_NAME}`);
    channel.consume(QUEUE_NAME, (msg) => handleNotification(channel, msg));
  } catch (error) {
    console.error("[❌] Error in starting the consumer:", error);
  }
};

start();
