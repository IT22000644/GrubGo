import express from "express";
import AssignDeliveryController from "../controllers/assign-delivery.controller.js";
import DeliveryStatusController from "../controllers/delivery-status.controller.js";
import DeliveryCrudController from "../controllers/delivery-crud.controller.js";

const router = express.Router();

router.post("/assign", AssignDeliveryController.assignDelivery);

router.post("/driver", AssignDeliveryController.findClosestDriver);

router.put(
  "/status/picked-up",
  DeliveryStatusController.updateStatusToPickedUp
);

router.put(
  "/status/delivered",
  DeliveryStatusController.updateStatusToDelivered
);

router.get("/status/:deliveryId", DeliveryStatusController.getCurrentStatus);

router.get("/", DeliveryCrudController.getAllDeliveries);
router.get("/:deliveryId", DeliveryCrudController.getDeliveryById);
router.put("/:deliveryId", DeliveryCrudController.updateDelivery);
router.delete("/:deliveryId", DeliveryCrudController.deleteDelivery);
router.get("/driver/:driverId", DeliveryCrudController.getDeliveriesByDriverId);
router.get("/order/:orderId", DeliveryCrudController.getDeliveriesByOrderId);

export default router;
