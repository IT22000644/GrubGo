import express from 'express';
import {
  getAvailableDrivers,
  addDummyDrivers,
} from '../controllers/dummy.driver.controller.js';

const router = express.Router();

router.get('/', getAvailableDrivers);
router.post('/dummy', addDummyDrivers);

export default router;
