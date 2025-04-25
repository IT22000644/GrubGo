import { Router } from "express";
import { restaurantProxy } from "../proxies/restaurant.js";

const restaurantRoutes = Router();

restaurantRoutes.use("/", restaurantProxy);

export default restaurantRoutes;
