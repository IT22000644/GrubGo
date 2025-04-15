const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/:customerId/items', cartController.addToCart);

router.put('/:customerId/:restaurantId', cartController.updateCart);

router.get('/:customerId/:restaurantId?', cartController.getCart);

router.delete('/:customerId/:restaurantId', cartController.clearCart);

module.exports = router;
