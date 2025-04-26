import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mapRoutes from "./routes/map.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", mapRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Map service is running on port ${PORT}`);
});

export default app;
