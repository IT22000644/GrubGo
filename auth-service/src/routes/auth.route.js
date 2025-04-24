import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from auth service!");
});

router.post("/login", (req, res) => {
  // TODO
});

router.post("/register", (req, res) => {
  // TODO
});

router.post("/logout", (req, res) => {
  // TODO
});

router.post("/verify-token", (req, res) => {
  // TODO
});

export default router;
