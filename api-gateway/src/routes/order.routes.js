import { Router } from "express";
import { orderProxy } from "../proxies/order.js";

const orderRoutes = Router();

orderRoutes.use("/", orderProxy);

export default orderRoutes;
