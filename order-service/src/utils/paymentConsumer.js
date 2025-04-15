const amqp = require('amqplib');
const Order = require('../models/orderModel');
const { publishToQueue } = require('./messageQueue');

const listenToPayments = async () => {
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection = await amqp.connect(amqpUrl);

    const channel = await connection.createChannel();

    await channel.assertQueue('paymentResponseQueue');

    channel.consume('paymentResponseQueue', async (msg) => {
        const { orderId, status } = JSON.parse(msg.content.toString());
        console.log(`[OrderService] Payment status for ${orderId}: ${status}`);

        await Order.findByIdAndUpdate(orderId, { status });

        if (status === 'completed') {
            const order = await Order.findById(orderId);

            await publishToQueue('restaurant_queue', {
                orderId: order._id,
                restaurantId: order.restaurantId,
                customerId: order.customerId,
                items: order.items
            });

            await publishToQueue('delivery_queue', {
                orderId: order._id,
                customerId: order.customerId,
                restaurantId: order.restaurantId,
            });

            console.log(`[OrderService] Sent order ${orderId} to restaurant {${order.restaurantId}} & delivery queues`);
        }
        else {
            console.log(`[OrderService] Order ${orderId} payment failed`);
        }


        channel.ack(msg);
    });
};

module.exports = listenToPayments;
