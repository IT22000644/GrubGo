import amqp from "amqplib";

let channel;

export const connectQueue = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  channel = await connection.createChannel();
};

export const publishToQueue = async (queueName, data) => {
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};

export const consumeFromQueue = async (queueName, callback) => {
  await channel.assertQueue(queueName);
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      callback(data);
      channel.ack(msg);
    }
  });
};
