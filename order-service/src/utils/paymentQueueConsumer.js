const amqp = require('amqplib');
const Order = require('../models/orderModel');
const { publishToQueue } = require('../utils/messageQueue');

const consumePaymentDoneQueue = async () => {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue('paymentdoneQueue');

    channel.consume('paymentdoneQueue', async (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log('Received payment confirmation:', data);

        try {
            const order = await Order.findById(data.orderId);
            if (order) {
                order.Paymentstatus = data.Paymentstatus;
                order.status = data.status;
                order.address
                await order.save();

                console.log(`Order updated in DB. Paymentstatus: ${order.Paymentstatus}, status: ${order.status}`);

                // If payment is completed, notify restaurant service
                if (order.Paymentstatus === 'completed') {
                    const orderPayload = {
                        orderId: order._id,
                        restaurantId: order.restaurantId,
                        items: order.items,
                        status: 'process'
                    };

                    await publishToQueue('orderQueue', orderPayload);
                    console.log('Order pushed to orderQueue:', orderPayload);
                }

            } else {
                console.warn('Order not found for ID:', data.orderId);
            }
        } catch (err) {
            console.error('Error processing payment queue:', err.message);
        }

        channel.ack(msg);
    });
}

module.exports = { consumePaymentDoneQueue };
