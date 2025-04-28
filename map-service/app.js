import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mapRoutes from "./routes/map.routes.js";

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/", mapRoutes);

const PORT = process.env.PORT || 4009;
app.listen(PORT, () => {
  console.log(`Map service is running on port ${PORT}`);
});

export default app;
