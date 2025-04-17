const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Order = require('../models/orderModel');
const { publishToQueue } = require('../utils/messageQueue');

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
  
    console.log('✅ Checkout session completed:', session);
  
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error('❌ Missing orderId in session metadata');
      return res.status(404).json({ message: 'Order ID missing in metadata' });
    }
  
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
  
    order.Paymentstatus = 'completed';
    order.status = 'process';
    await order.save();
  
    await publishToQueue('paymentdoneQueue', {
      orderId: order._id,
      items: order.items,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      status: order.status,
      Paymentstatus: order.Paymentstatus,
    });
  
    console.log('✅ Order updated and pushed to queue');
  }
  

  res.json({ received: true });
};
