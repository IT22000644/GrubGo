import express from "express";
const router = express.Router();
import { reviewsController } from "../controllers/reviewsController.js";

router.post("/", reviewsController.addReview);
router.put("/:id", reviewsController.updateReview);
router.get("/:id", reviewsController.getReviewById);
router.get(
  "/restaurant/:restaurantId",
  reviewsController.getReviewsByRestaurant
);
router.get("/food/:foodId", reviewsController.getReviewsByFood);
router.delete("/:id", reviewsController.deleteReview);

export default router;
