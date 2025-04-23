import express from "express";

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello from user service!");
});

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
});
