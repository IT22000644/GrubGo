import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import { startDeliveryScheduler } from "./services/delivery-scheduler.service.js";
import { connectQueue } from "./utils/messageQueue.js";
import { startDriverLocationUpdater } from "./services/driver-location.service.js";

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
app.use("/", deliveryRoutes);

startDeliveryScheduler(io);
startDriverLocationUpdater(io);

// WebSocket connection listener
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4006;
(async () => {
  try {
    await connectQueue();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("WebSocket server is now listening for connections...");
    });
  } catch (err) {
    console.error("Failed to start application:", err);
    process.exit(1);
  }
})();
