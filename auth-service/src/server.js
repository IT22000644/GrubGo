import express from "express";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from auth service!");
});

app.listen(PORT, () => {
  console.log(`Auth service is running on http://localhost:${PORT}`);
});
