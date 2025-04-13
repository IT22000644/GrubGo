import express from "express";
import { registerNewRestaurant } from "../controllers/restaurantController.js";
import { upload } from "../config/multer.js";
import {
  restaurantValidationRules,
  validateRequest,
} from "../middleware/restaurantValidation.js";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 5),
  restaurantValidationRules,
  validateRequest,

  registerNewRestaurant
);

export default router;
