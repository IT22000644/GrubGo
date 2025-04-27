import express from "express";
import connectDB from "./src/config/db_config.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

connectDB(mongoURI);

app.use("/", reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Review service running on port ${PORT}`));

export default app;
