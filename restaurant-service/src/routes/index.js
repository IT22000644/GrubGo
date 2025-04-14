import express from "express";
const router = express.Router();

import restaurantRoutes from "./restaurantRoutes.js";
import foodRoutes from "./foodRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

router.use("/restaurants", restaurantRoutes);
router.use("/foods", foodRoutes);
router.use("/reviews", reviewRoutes);

export default router;
