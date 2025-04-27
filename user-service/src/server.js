import "dotenv/config.js";
import express from "express";
import connectDB from "./db/db-config.js";
import router from "./routes/user.route.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/", router);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
  connectDB();
});
