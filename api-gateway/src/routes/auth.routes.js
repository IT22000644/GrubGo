import { Router } from "express";
import { mapProxy } from "../proxies/map.js";

const mapRoutes = Router();

mapRoutes.use("/", mapProxy);

export default mapRoutes;
