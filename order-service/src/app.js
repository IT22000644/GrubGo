const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const { connectQueue } = require('./utils/messageQueue');
const listenToPayments = require('./utils/paymentConsumer');
const { stripeWebhook } = require('./utils/stripeWebhookController');

dotenv.config();

const app = express();
app.use(cors());

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

connectDB();

app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5005;
const startServer = async () => {
  await connectQueue();
  await listenToPayments();
  app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
};

startServer();
