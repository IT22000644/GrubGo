import express from "express";
import http from "http";
import { Server } from "socket.io";
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
app.use(cors());
app.use(express.json());
app.use("/api/deliveries", deliveryRoutes);

startDeliveryScheduler(io);
//startDriverLocationUpdater(io);

// WebSocket connection listener
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("WebSocket server is now listening for connections...");
});
