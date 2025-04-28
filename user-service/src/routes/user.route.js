import { Router } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getActiveRiders,
  updateRiderLocation,
  updateRiderStatus,
  getAllUsers,
  updateUser,
  deleteUser,
  increaseOrderCount,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "User service is healthy" });
});

router.get("/", getAllUsers);

router.post("/", createUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.get("/email/:email", getUserByEmail);

router.get("/active-riders", getActiveRiders);

router.patch("/update-location/:id", updateRiderLocation);

router.patch("/rider-status/:id", updateRiderStatus);

router.post("/delivery-count/:id", increaseOrderCount);

export default router;
