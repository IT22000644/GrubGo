import express from "express";
const router = express.Router();

import restaurantRoutes from "./restaurantRoutes.js";
import foodMenuRoutes from "./foodMenuRoutes.js";
import foodsRoutes from "./foodsRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

router.use("/restaurants", restaurantRoutes);
router.use("/foodMenus", foodMenuRoutes);
router.use("/foods", foodsRoutes);
router.use("/categories", categoryRoutes);

export default router;
