const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);

router.get('/:id', orderController.getOrderById);

router.put('/:id', orderController.updateOrder);

router.get('/customer/:customerId', orderController.getOrdersByCustomer);

router.put('/:id/cancel', orderController.cancelOrder);

router.post('/:orderId/checkout', orderController.checkout);

router.put('/status/preparing/:orderId', orderController.setOrderPreparing);

router.put('/status/completed/:orderId', orderController.setOrderCompleted);

router.put('/status/delivered/:orderId', orderController.setOrderDelivered);

router.get('/getorders/:restaurantId', orderController.getOrdersByRestaurant);

router.put('/isreviewed/:orderId', orderController.Reviewdorder);

module.exports = router;
