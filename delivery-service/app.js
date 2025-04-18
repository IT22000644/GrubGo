import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import { startDeliveryScheduler } from "./services/delivery-scheduler.service.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/deliveries", deliveryRoutes);

startDeliveryScheduler();

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
