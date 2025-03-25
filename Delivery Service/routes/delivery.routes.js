import express from 'express';
import {
  assignDelivery,
  simulateDeliveryMovement,
} from '../controllers/delivery.controller.js';

const router = express.Router();
router.post('/assign', assignDelivery);
router.get('/simulate/:deliveryId', simulateDeliveryMovement);

export default router;
