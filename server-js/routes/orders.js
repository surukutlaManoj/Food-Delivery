const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /orders - create new order (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, notes } = req.body;

    // Validation
    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'restaurantId and items are required' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      return res.status(400).json({ error: 'complete deliveryAddress is required' });
    }

    // Verify restaurant exists
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurantId' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      if (!item.name || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Each item must have name, quantity, and price' });
      }
      totalAmount += item.quantity * item.price;
    }

    // Create order
    const order = new Order({
      user: req.userId,
      restaurant: restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || ''
    });

    await order.save();

    // Populate for response
    await order.populate('restaurant', 'name address cuisine');

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /orders - list user's orders (protected)
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('restaurant', 'name address cuisine')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /orders/:id - get single order (protected)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await Order.findById(id).populate('restaurant', 'name address cuisine');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify user owns this order
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /orders/:id/status - update order status (protected, could be admin-only in production)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // For demo purposes, allow user to update their own orders
    // In production, you'd check for admin role or restrict to restaurant owners
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    order.status = status;
    await order.save();

    await order.populate('restaurant', 'name address cuisine');

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
