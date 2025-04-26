import express from "express";
import connectDB from "./db/db-config.js";
import router from "./routes/auth.route.js";
import { connectQueue } from "./utils/messageQueue.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.use("/", router);

const startServer = async () => {
  try {
    await connectDB();
    await connectQueue();

    app.listen(PORT, () => {
      console.log(`Auth service is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // exit if something critical failed
  }
};

startServer();
