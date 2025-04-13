const express = require("express");
const connectDB = require("../src/config/db_config");
require("dotenv").config();

const app = express();
app.use(express.json());

const mongoURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_TEST_URI
    : process.env.MONGO_URI;

// Connect to DB
connectDB(mongoURI);

app.get("/health", (req, res) => {
  res.send("Restaurant service is healthy!");
});

const restaurantRoutes = require("./routes/restaurantRoutes");
app.use("/api/restaurants", restaurantRoutes);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Restaurant service running on port ${PORT}`)
  );
}

module.exports = app; // export for test files
