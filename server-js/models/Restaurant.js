const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  image: { type: String, default: '' },
  deliveryTime: { type: String, default: '30-40 min' },
  deliveryFee: { type: Number, default: 2.99 },
  minimumOrder: { type: Number, default: 15.00 },
  isOpen: { type: Boolean, default: true },
  description: { type: String, default: '' },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
