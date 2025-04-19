const amqp = require('amqplib');

let channel = null;

async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
}

async function publishToQueue(queueName, data) {
  if (!channel) {
    await connect();
  }
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

module.exports = { publishToQueue };

