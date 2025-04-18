import express from "express";
import { foodMenuController } from "../controllers/foodMenuController.js";
import {
  foodMenuValidationRules,
  validateRequest,
} from "../middleware/restaurantValidation.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 5),
  foodMenuValidationRules,
  validateRequest,
  foodMenuController.addFoodMenu
);

router.put(
  "/:id",
  upload.array("images", 5),
  foodMenuValidationRules,
  validateRequest,
  foodMenuController.updateFoodMenu
);

router.get("/:id", foodMenuController.getFoodMenuById);
router.get("/", foodMenuController.getFoodsByMenu);
router.delete("/:id", foodMenuController.deleteFoodMenu);

export default router;
