import { Router } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getActiveRiders,
  updateRiderLocation,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "User service is healthy" });
});

router.get("/", (req, res) => {
  res.json({ success: true, message: "Get All users" });
});

router.get("/:id", (req, res) => {
  // TODO
});

router.get("/email/:email", getUserByEmail);

router.post("/", createUser);

router.put("/:id", getUserById);

router.patch("/update-location/:id", updateRiderLocation);

router.get("/active-riders", getActiveRiders);

export default router;
