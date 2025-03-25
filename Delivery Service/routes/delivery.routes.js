import express from 'express';
import deliveryController from '../controllers/delivery.controller.js';

const router = express.Router();

router.post('/assign', deliveryController.assignDelivery);

router.post('/route', deliveryController.getRoute);

export default router;
