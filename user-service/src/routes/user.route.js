import { Router } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getActiveRiders,
  updateRiderLocation,
  updateRiderStatus,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "User service is healthy" });
});

router.get("/", getAllUsers);

router.get("/active-riders", getActiveRiders);

router.post("/", createUser);

router.get("/:id", getUserById);

router.get("/email/:email", getUserByEmail);

router.patch("/update-location/:id", updateRiderLocation);

router.patch("/rider-status/:id", updateRiderStatus);

export default router;
