import { Router } from "express";
import { authProxy } from "../proxies/auth.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import addUserInfoToProxyRequest from "../middlewares/addUserInfo.js";

const authRoutes = Router();

authRoutes.use("/logout", authMiddleware, addUserInfoToProxyRequest);

authRoutes.use("/", authProxy);

export default authRoutes;
