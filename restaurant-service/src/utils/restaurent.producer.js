// restaurant-service/producer.js
import amqp from "amqplib";

export async function requestUser(userId) {
  const connection = await amqp.connect("amqp://rabbitmq");
  const channel = await connection.createChannel();

  const correlationId = generateUuid();
  const replyQueue = await channel.assertQueue("", { exclusive: true });

  return new Promise((resolve) => {
    channel.consume(
      replyQueue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const user = JSON.parse(msg.content.toString());
          resolve(user);
          setTimeout(() => {
            connection.close();
          }, 500);
        }
      },
      { noAck: true }
    );

    channel.sendToQueue("get-user", Buffer.from(userId), {
      correlationId,
      replyTo: replyQueue.queue,
    });
  });
}

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
