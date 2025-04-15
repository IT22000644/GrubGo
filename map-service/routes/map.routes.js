import express from "express";
import mapController from "../controllers/map.controller.js";

const router = express.Router();

router.post("/", mapController.convertAddress);

export default router;
