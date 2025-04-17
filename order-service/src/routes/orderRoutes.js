const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);

router.get('/:id', orderController.getOrderById);

router.put('/:id', orderController.updateOrder);

router.get('/customer/:customerId', orderController.getOrdersByCustomer);

router.put('/:id/cancel', orderController.cancelOrder);

router.post('/checkout', orderController.checkout);

module.exports = router;
