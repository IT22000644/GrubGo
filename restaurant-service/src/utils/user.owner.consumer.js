import amqp from "amqplib";
import mongoose from "mongoose";
import { User } from "./models/User.js"; // Your Mongoose model

mongoose.connect("mongodb://mongo:27017/users"); // Replace with your MongoDB setup

const start = async () => {
  const connection = await amqp.connect("amqp://rabbitmq");
  const channel = await connection.createChannel();
  await channel.assertQueue("get-user", { durable: false });

  console.log(" [*] Waiting for messages in get-user queue");

  channel.consume("get-user", async (msg) => {
    const userId = msg.content.toString();
    const user = await User.findById(userId);

    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(user)),
      { correlationId: msg.properties.correlationId }
    );

    channel.ack(msg);
  });
};

start();
