const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

// Example route
app.get("/health", (req, res) => {
  res.send("Restaurant service is healthy!");
});

// Load other routes
const restaurantRoutes = require("./routes/restaurantRoutes");
app.use("/api/restaurants", restaurantRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
