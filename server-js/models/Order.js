const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate estimated delivery time (in minutes)
OrderSchema.methods.calculateEstimatedDeliveryTime = function() {
  const baseTime = 30; // base delivery time
  const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  return baseTime + (itemCount * 2); // add 2 min per item
};

module.exports = mongoose.model('Order', OrderSchema);
