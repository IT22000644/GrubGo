const amqp = require('amqplib');

let channel, connection;

// Connect to RabbitMQ 
const connectQueue = async () => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        const connection = await amqp.connect(amqpUrl);
        
        channel = await connection.createChannel();

        await channel.assertQueue('orderQueue');
        await channel.assertQueue('paymentResponseQueue');
        await channel.assertQueue('restaurant_queue');
        await channel.assertQueue('delivery_queue');

        console.log('[RabbitMQ] Connected and Queues asserted.');
    } catch (error) {
        console.error('[RabbitMQ] Connection error:', error.message);
    }
};

// Send a message to a specific queue
const publishToQueue = async (queueName, data) => {
    if (!channel) {
        console.error('[RabbitMQ] Channel is not initialized.');
        return;
    }

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`[RabbitMQ] Message sent to ${queueName}:`, data);
};

module.exports = {
    connectQueue,
    publishToQueue,
};
