import express from "express";
import connectDB from "./config/db_config.js";
import apiV1Routes from "./routes/index.js";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const mongoURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_TEST_URI
    : process.env.MONGO_URI;

connectDB(mongoURI);

app.use("/api/v1", apiV1Routes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Restaurant service running on port ${PORT}`)
  );
}

export default app;
