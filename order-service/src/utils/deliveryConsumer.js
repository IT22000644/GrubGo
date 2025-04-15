const amqp = require('amqplib');

const listenToDeliveryQueue = async () => {
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection = await amqp.connect(amqpUrl);

    const channel = await connection.createChannel();

    await channel.assertQueue('delivery_queue');

    channel.consume('delivery_queue', async (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log(`[DeliveryService] Deliver order ${data.orderId} to customer ${data.customerId}`);
        channel.ack(msg);
    });
};

listenToDeliveryQueue();
