import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  customizations: Record<string, any>;
  menuItemId?: string;
}

export interface IDeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: [number, number];
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  finalAmount: number;
  deliveryAddress: IDeliveryAddress;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentId: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: {
    type: String,
    required: [true, 'Order item name is required']
  },
  price: {
    type: Number,
    required: [true, 'Order item price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Order item quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  customizations: {
    type: Schema.Types.Mixed,
    default: {}
  },
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
}, { _id: false });

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  coordinates: [Number]
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  tax: {
    type: Number,
    required: [true, 'Tax amount is required'],
    min: [0, 'Tax cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: [true, 'Final amount is required'],
    min: [0, 'Final amount cannot be negative']
  },
  deliveryAddress: {
    type: DeliveryAddressSchema,
    required: [true, 'Delivery address is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ restaurantId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Method to calculate estimated delivery time
OrderSchema.methods.calculateEstimatedDeliveryTime = function(): Date {
  const now = new Date();
  const preparationTime = Math.floor(Math.random() * 20) + 15; // 15-35 minutes
  const deliveryTime = Math.floor(Math.random() * 20) + 20; // 20-40 minutes
  const totalTime = preparationTime + deliveryTime;

  const estimatedTime = new Date(now.getTime() + totalTime * 60000);
  return estimatedTime;
};

// Pre-save middleware to set estimated delivery time
OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.estimatedDeliveryTime) {
    this.estimatedDeliveryTime = this.calculateEstimatedDeliveryTime();
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);