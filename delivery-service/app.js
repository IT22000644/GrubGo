import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import deliveryRoutes from "./routes/delivery.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api/deliveries", deliveryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
