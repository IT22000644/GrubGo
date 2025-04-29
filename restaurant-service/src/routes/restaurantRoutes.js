import express from "express";
import { RestaurantController } from "../controllers/restaurantController.js";
import { upload } from "../config/multer.js";
import {
  restaurantValidationRules,
  validateRequest,
} from "../middleware/restaurantValidation.js";

const router = express.Router();

router.get("/owner/:ownerId", RestaurantController.getbyOwnerId);
router.get("/status/open", RestaurantController.getAllRestaurantsByStatus);
router.patch("/status/:id", RestaurantController.updateRestaurantStatus);
router.patch("/verify/:id", RestaurantController.updateRestaurantVerify);

router.get("/:id", RestaurantController.getRestaurantById);
router.put(
  "/:id",
  upload.array("images", 5),
  restaurantValidationRules,
  validateRequest,
  RestaurantController.updateRestaurant
);
router.delete("/:id", RestaurantController.deleteRestaurant);

router.get("/", RestaurantController.getAllRestaurants);
router.post(
  "/",
  upload.array("images", 5),
  restaurantValidationRules,
  validateRequest,
  RestaurantController.registerNewRestaurant
);

export default router;
