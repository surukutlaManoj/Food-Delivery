const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// GET /restaurants/featured - get featured restaurants (must be before /:id route)
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const featured = await Restaurant.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);
    res.json({ restaurants: featured });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /restaurants - list all
router.get('/', async (req, res) => {
  try {
    const list = await Restaurant.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /restaurants/:id - get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /restaurants - create new
router.post('/', async (req, res) => {
  try {
    const { name, address, cuisine, rating } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: 'name and address are required' });
    }
    const r = new Restaurant({ name, address, cuisine, rating });
    const saved = await r.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /restaurants/:id - update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const updates = req.body;
    const updated = await Restaurant.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
