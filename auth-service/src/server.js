import express from "express";
import connectDB from "./db/db-config.js";
import router from "./routes/auth.route.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Auth service is running on http://localhost:${PORT}`);
  connectDB();
});
