import { Router } from "express";
import {
  register,
  verifyToken,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from auth service!");
});

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.post("/verify-token", verifyToken);

export default router;
