import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import mapRoutes from "./routes/map.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send("<h1>API Gateway is running</h1>");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/review", reviewRoutes);
app.use("/map", mapRoutes);

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
