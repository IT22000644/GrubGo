import { Router } from "express";
import { reviewProxy } from "../proxies/review.js";

const reviewRoutes = Router();

reviewRoutes.use("/", reviewProxy);

export default reviewRoutes;
