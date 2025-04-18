import express from "express";
import {
  foodValidationRules,
  validateRequest,
} from "../middleware/restaurantValidation.js";
import { foodController } from "../controllers/foodController.js";
import { handleMulterError, upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 5),
  foodValidationRules,
  validateRequest,
  foodController.addFood
);

router.put(
  "/:id",
  upload.array("images", 5),
  foodValidationRules,
  validateRequest,
  foodController.updateFood
);

router.get("/category/:id", foodController.getFoodsByCategory);
router.get("/:id", foodController.getFoodById);
router.delete("/:id", foodController.deleteFood);

router.use(handleMulterError);

export default router;
