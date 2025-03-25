import express from 'express';
import restaurantController from '../controllers/dummy.restaurant.controller.js';

const router = express.Router();

router.get('/', restaurantController.getRestaurants);
router.post('/dummy', restaurantController.addDummyRestaurants);

export default router;
