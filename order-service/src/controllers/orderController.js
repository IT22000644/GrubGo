const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { publishToQueue } = require('../utils/messageQueue');

// Create an order
const createOrder = async (req, res) => {
  try {
    const { customerId, restaurantId, address } = req.body;

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
      status: 'pending',
      PaymentStatus: 'pending',
      iscompleted: false,
      address
    });

    await newOrder.save();

    await Cart.deleteOne({ _id: cart._id });

    // await publishToQueue('orderQueue', {
    //   orderId: newOrder._id,
    //   customerId,
    //   amount: totalAmount,
    //   restaurantId,
    //   items: cart.items,
    //   PaymentStatus: 'pending',
    //   status: 'pending',
    // });


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
      const validStatuses = ['completed', 'cancelled', 'pending', 'done'];
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

const checkout = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.Paymentstatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed for this order' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Item ${item.name}`,
            description: `RESTAURANT: ${order.restaurantId}\n CUSTOMER: ${order.customerId}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      metadata: {
        orderId: order._id.toString(),
        customerId: order.customerId,
        restaurantId: order.restaurantId,
        status: order.status,
        Paymentstatus: order.Paymentstatus,
        address: order.address,
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error during Stripe checkout:', error);
    return res.status(500).json({ message: 'Stripe checkout error', error: error.message });
  }
};

const setOrderPreparing = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'process') {
      return res.status(400).json({ message: 'Order must be in process state to prepare' });
    }

    order.status = 'preparing';
    order.updatedAt = Date.now();
    await order.save();

    return res.status(200).json({ message: 'Order status set to preparing', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set order to preparing', error: error.message });
  }
};

const setOrderCompleted = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'preparing') {
      return res.status(400).json({ message: 'Order must be in preparing state to complete' });
    }

    order.status = 'completed';
    order.iscompleted = true;
    order.updatedAt = Date.now();
    await order.save();

    await publishToQueue('deliveryqueue', {
      orderId: order._id,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      status: 'delivering',
      address: order.address,
    });
    return res.status(200).json({ message: 'Order status set to completed', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set order to completed', error: error.message });
  }
};

const setOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Order must be in completed state to deliver' });
    }

    order.status = 'done';
    order.updatedAt = Date.now();
    await order.save();

    return res.status(200).json({ message: 'Order status set to delivered', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set order to delivered', error: error.message });
  }
};

const Reviewdorder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isreviewed = true;
    order.updatedAt = new Date();
    await order.save();

    return res.status(200).json({ message: 'Order marked as reviewed', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark order as reviewed', error: error.message });
  }
};


// Retrieve all orders by restaurant ID
const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, startDate, endDate } = req.query;

    const query = { restaurantId };

    if (status) {
      const validStatuses = ['completed', 'cancelled', 'pending', 'done', 'preparing', 'process'];
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
    console.error('Error retrieving orders by restaurant:', error);
    res.status(500).json({
      message: 'Error retrieving orders',
      error: error.message
    });
  }
};


module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  getOrdersByCustomer,
  cancelOrder,
  checkout,
  setOrderPreparing,
  setOrderCompleted,
  setOrderDelivered,
  getOrdersByRestaurant,
  Reviewdorder
}
