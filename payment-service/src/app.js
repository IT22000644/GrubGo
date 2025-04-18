const express = require('express');
const dotenv = require('dotenv');
const { stripeWebhook } = require('./controllers/stripeWebhookController');

dotenv.config();

const app = express();

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(` Payment Service running on port ${PORT}`);
});