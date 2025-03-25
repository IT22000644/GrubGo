import express from 'express';
import driverController from '../controllers/dummy.driver.controller.js';

const router = express.Router();

// Use the methods from the controller object
router.get('/', driverController.getAvailableDrivers);
router.post('/dummy', driverController.addDummyDrivers);

export default router;
