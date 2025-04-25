import express from "express";
import { RestaurantController } from "../controllers/restaurantController.js";
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
  RestaurantController.registerNewRestaurant
);

router.put(
  "/:id",
  upload.array("images", 5),
  restaurantValidationRules,
  validateRequest,
  RestaurantController.updateRestaurant
);

router.get("/:id", RestaurantController.getRestaurantById);
router.get("/", RestaurantController.getAllRestaurants);
router.get("/status/open", RestaurantController.getAllRestaurantsByStatus);
router.patch("/status/:id", RestaurantController.updateRestaurantStatus);
router.delete("/:id", RestaurantController.deleteRestaurant);

export default router;
