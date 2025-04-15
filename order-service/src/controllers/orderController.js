const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const { publishToQueue } = require('../utils/messageQueue');

// Create an order
const createOrder = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.body;

    const cart = await Cart.findOne({ customerId, restaurantId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No items in cart to create order' });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    const newOrder = new Order({
      customerId,
      restaurantId,
      items: cart.items,
      totalAmount,
      status: 'pending'
    });

    await newOrder.save();

    await Cart.deleteOne({ _id: cart._id });

    await publishToQueue('orderQueue', {
      orderId: newOrder._id,
      customerId,
      amount: totalAmount
    });


    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order', error });
  }
};

// Modify an order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// Retrieve all orders
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status, startDate, endDate } = req.query;

    const query = { customerId };

    if (status) {
      const validStatuses = ['completed', 'cancelled', 'pending'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status value',
          validStatuses
        });
      }
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found matching the criteria'
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({
      message: 'Error retrieving orders',
      error: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be canceled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order canceled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling order', error });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  getOrdersByCustomer,
  cancelOrder
}
