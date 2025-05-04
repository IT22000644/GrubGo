const amqp = require('amqplib');
const Order = require('../models/orderModel');
const { publishToQueue } = require('../utils/messageQueue');

const consumePaymentDoneQueue = async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
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

                if (order.Paymentstatus === 'completed') {
                    const orderPayload = {
                        orderId: order._id,
                        restaurantId: order.restaurantId,
                        items: order.items,
                        status: 'process'
                    };

                    await publishToQueue('orderQueue', orderPayload);
                    console.log('Order pushed to orderQueue:', orderPayload);
                    const itemList = order.items.map(item =>
                        `- ${item.name} (x${item.quantity})`
                    ).join('\n');

                    await publishToQueue("notification", {
                        type: "EMAIL",
                        payload: {
                            to: "pererajude00@gmail.com",
                            subject: `Payment Successful for Order #${order._id}`,
                            body: `Dear Customer,
                                    Your payment has been successfully processed. Here are the details of your order:
                                    Items Ordered:
                                    ${itemList}
                                    We are now processing your order and will notify you once it's out for delivery.
                                    Thank you for choosing GrubGo!
                                    GrubGo Team`
                        }
                    });
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
