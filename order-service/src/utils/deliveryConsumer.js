const amqp = require('amqplib');
const Order = require('../models/orderModel');

const listenToDeliveryQueue = async () => {
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue('deliveryqueue');

    channel.consume('deliveryqueue', async (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log(`[DeliveryService] Deliver order ${data.orderId} to customer ${data.customerId}`);

        try {
            const order = await Order.findById(data.orderId);
            if (order && order.status === 'completed') {
                order.status = 'done';
                await order.save();
                console.log(`[DeliveryService] Order ${order._id} marked as done.`);
            } else if (!order) {
                console.warn(`[DeliveryService] Order not found for ID: ${data.orderId}`);
            } else {
                console.log(`[DeliveryService] Order ${order._id} is not completed yet (current status: ${order.status}).`);
            }
        } catch (err) {
            console.error(`[DeliveryService] Error updating order status:`, err.message);
        }

        channel.ack(msg);
    });
};

module.exports = { listenToDeliveryQueue };