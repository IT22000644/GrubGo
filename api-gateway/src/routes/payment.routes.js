import { Router } from "express";
import { paymentProxy } from "../proxies/payment.js";

const paymentRoutes = Router();

paymentRoutes.use("/", paymentProxy);

export default paymentRoutes;
