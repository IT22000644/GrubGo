const amqp = require('amqplib');

const listenToRestaurantQueue = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('restaurant_queue');

    channel.consume('restaurant_queue', async (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log(`[RestaurantService] Prepare order ${data.orderId} for restaurant ${data.restaurantId}`);
        channel.ack(msg);
    });
};

listenToRestaurantQueue();
