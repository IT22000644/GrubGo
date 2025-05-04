import amqp from "amqplib";

let channel, connection;

// Connect to RabbitMQ
export const connectQueue = async () => {
  try {
    const amqpUrl = process.env.RABBITMQ_URL || "amqp://localhost";
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    await channel.assertQueue("notification");

    console.log("[RabbitMQ] Connected and Queues asserted.");
  } catch (error) {
    console.error("[RabbitMQ] Connection error:", error.message);
  }
};

// Send to a queue
export const publishToQueue = async (queueName, data) => {
  if (!channel) {
    console.error("[RabbitMQ] Channel is not initialized.");
    return;
  }

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log(`[RabbitMQ] Message sent to ${queueName}:`, data);
};
