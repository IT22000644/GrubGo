const Cart = require('../models/cartModel');

// Add an item to the cart
const addToCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { restaurantId, items } = req.body;

    console.log("Restaurant ID:", restaurantId);

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided to add to the cart' });
    }

    for (let item of items) {
      if (!item.foodItemId || !item.quantity || !item.price) {
        return res.status(400).json({ message: 'Each item must have foodItemId, quantity, and price' });
      }
    }

    let cart = await Cart.findOne({ customerId, restaurantId });

    let totalPrice = 0;

    if (!cart) {
      cart = new Cart({
        customerId,
        restaurantId,
        items: items,
      });
    } else {
      for (let newItem of items) {
        const itemIndex = cart.items.findIndex(item => item.foodItemId === newItem.foodItemId);

        if (itemIndex !== -1) {
          cart.items[itemIndex].quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      }
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();

    res.status(200).json({ message: 'Items added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding items to cart', error });
  }
};

// Update the items of cart
const updateCart = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.params;
    const { items } = req.body;

    let cart = await Cart.findOne({ customerId, restaurantId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const updatedItemsMap = new Map();
    items.forEach(item => {
      if (item.quantity > 0) {
        updatedItemsMap.set(item.foodItemId, item);
      }
    });

    cart.items = cart.items.map(item => {
      const updated = updatedItemsMap.get(item.foodItemId);
      return updated ? { ...item.toObject(), quantity: updated.quantity } : item;
    }).filter(item => updatedItemsMap.has(item.foodItemId));

    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ 
        [`cart id : ${cart._id}`]: true,
        message: 'Cart is empty and was deleted' 
      });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
};


// Get cart details
const getCart = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.params;

    let cart;

    if (restaurantId) {
      cart = await Cart.findOne({ customerId, restaurantId });
    } else {
      cart = await Cart.find({ customerId });
    }

    if (!cart || (Array.isArray(cart) && cart.length === 0)) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart', error });
  }
};


// Clear the cart after order placement
const clearCart = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.params;

    const cart = await Cart.findOne({ customerId, restaurantId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this customer and restaurant' });
    }

    await Cart.deleteOne({ customerId, restaurantId });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};


module.exports = {
  addToCart,
  getCart,
  clearCart,
  updateCart,
}
