import { connectRabbitMQ } from "./config/rabbitmq.js";
import { handleNotification } from "./consumers/notificationConsumer.js";

const QUEUE_NAME = "notification";

const start = async () => {
  const { channel } = await connectRabbitMQ();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(`[✅] Waiting for messages in ${QUEUE_NAME}`);
  channel.consume(QUEUE_NAME, (msg) => handleNotification(channel, msg));
};

start();
