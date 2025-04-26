const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");
const { connectQueue } = require("./utils/messageQueue");
const { consumePaymentDoneQueue } = require("./utils/paymentQueueConsumer");
const { listenToDeliveryQueue } = require("./utils/deliveryConsumer");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

connectDB();

app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 5011;
const startServer = async () => {
  await connectQueue();
  await consumePaymentDoneQueue();
  // await listenToDeliveryQueue();
  app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
};

startServer();
