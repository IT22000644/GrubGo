import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import { startDeliveryScheduler } from "./services/delivery-scheduler.service.js";
//import { startDriverLocationUpdater } from "./services/driver-location.service.js";

/*
 * Note: The startDriverLocationUpdater Function is Operational, however
 * is commented out since it could cost money due to running google maps every 30 seconds
 * Driver location is still updated when they reach the Restaurant or Customer however,
 * will not be updated every 30 seconds
 * (Hence Driver location in transit will not be accurate without startDriverLocationUpdater Function)
 */

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/deliveries", deliveryRoutes);

startDeliveryScheduler();
//startDriverLocationUpdater();

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
