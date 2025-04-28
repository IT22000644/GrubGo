import { Router } from "express";
import { userProxy } from "../proxies/user.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import actionGuard from "../middlewares/role.middleware.js";

const userRoutes = Router();

userRoutes.use("/email/:email", authMiddleware);
userRoutes.use(
  "/:id",
  authMiddleware,
  actionGuard({
    GET: ["any"],
    PUT: ["admin", "owner"],
    DELETE: ["owner"],
  })
);

userRoutes.use(
  "/update-location/:id",
  authMiddleware,
  actionGuard({ PATCH: ["owner"] })
);
userRoutes.use("/", userProxy);

export default userRoutes;
