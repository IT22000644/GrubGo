import express from 'express';
import {
  addDummyRestaurants,
  getRestaurants,
} from '../controllers/dummy.restaurant.controller.js';

const router = express.Router();

router.get('/', getRestaurants);

router.post('/dummy', addDummyRestaurants);

export default router;
