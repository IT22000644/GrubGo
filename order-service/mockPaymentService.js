const amqp = require('amqplib');
const Order = require('./src/models/orderModel');
const connectDB = require('./src/config/db');

connectDB();

const listenForOrders = async () => {
  const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  const connection = await amqp.connect(amqpUrl);

  const channel = await connection.createChannel();

  await channel.assertQueue('orderQueue');
  await channel.assertQueue('paymentResponseQueue');

  channel.consume('orderQueue', async (msg) => {
    const { orderId, customerId, amount } = JSON.parse(msg.content.toString());
    console.log(`[PaymentService] Received order ${orderId}, amount: ${amount}`);
    const order = await Order.findById(orderId);

    if (!order || order.status === 'cancelled') {
      console.log(`[PaymentService] Skipping cancelled order: ${orderId}`);
      return channel.ack(msg);
    }
    else {
      const paymentSuccess = true;
      const status = paymentSuccess ? 'completed' : 'failed';

      const result = {
        orderId,
        status,
      };

      channel.sendToQueue('paymentResponseQueue', Buffer.from(JSON.stringify(result)));
      channel.ack(msg);
      console.log(`[PaymentService] Payment ${status} for order ${orderId}`);
    }
  });

};

listenForOrders();
