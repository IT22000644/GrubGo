const amqp = require('amqplib');
const Order = require('../models/orderModel');

async function consumePaymentDoneQueue() {
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
                await order.save();
                console.log(`Order updated in DB ${order.Paymentstatus} and ${order.status = data.status}`);
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
