import { Router } from "express";
import { deliveryProxy } from "../proxies/delivery.js";

const deliveryRoutes = Router();

deliveryRoutes.use("/", deliveryProxy);

export default deliveryRoutes;
