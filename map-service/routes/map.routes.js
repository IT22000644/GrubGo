import express from "express";
import MapController from "../controllers/map.controller.js";

const router = express.Router();

router.post("/coordinate", MapController.addressToCoordinates);
router.post("/address", MapController.coordinatesToAddress);
router.post("/string", MapController.combineAddressParts);
router.post("/closest-address", MapController.findClosestAddress);
router.post("/closest-rider", MapController.findClosestRider);

export default router;
