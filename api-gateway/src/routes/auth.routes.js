import { Router } from "express";
import { authProxy } from "../proxies/auth.js";

const authRoutes = Router();

authRoutes.use("/", authProxy);

export default authRoutes;
