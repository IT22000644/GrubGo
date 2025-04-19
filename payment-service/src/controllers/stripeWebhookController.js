const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    
    const orderId = metadata.orderId;
    const customerId = metadata.customerId;
    const restaurantId = metadata.restaurantId;

    if (!orderId) {
      console.error('Missing orderId in metadata');
      return res.status(400).json({ message: 'Missing orderId in metadata' });
    }

    // Push to queue
    await publishToQueue('paymentdoneQueue', {
        orderId,
        customerId,
        restaurantId,
        Paymentstatus: 'completed', 
        status: 'process',
      });
  
      console.log(`Payment verified for order: ${orderId}, customer: ${customerId}, restaurant: ${restaurantId}. Pushed to paymentdoneQueue`);
    }

  res.json({ received: true });
};
