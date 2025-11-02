import { Response, NextFunction } from 'express';
import { Order, Restaurant } from '../models';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { io } from '../index';

// Create new order
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId, items, deliveryAddress, specialInstructions } = req.body;
    const userId = req.user!._id;

    // Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      throw createError('Restaurant not found or unavailable', 404);
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const deliveryFee = restaurant.deliveryFee;
    const tax = subtotal * 0.08; // 8% tax
    const finalAmount = subtotal + deliveryFee + tax;

    // Check minimum order
    if (subtotal < restaurant.minOrder) {
      throw createError(`Minimum order amount is $${restaurant.minOrder}`, 400);
    }

    // Generate payment ID (mock payment)
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order
    const order = new Order({
      userId,
      restaurantId,
      items,
      totalAmount: subtotal,
      deliveryFee,
      tax,
      finalAmount,
      deliveryAddress,
      specialInstructions,
      paymentId,
      paymentStatus: 'pending'
    });

    await order.save();

    // Populate order details
    await order.populate([
      { path: 'restaurantId', select: 'name address phone' },
      { path: 'userId', select: 'name email phone' }
    ]);

    // Emit real-time notification
    io.to(`order-${order._id}`).emit('order:created', {
      orderId: order._id,
      status: order.status,
      estimatedDeliveryTime: order.estimatedDeliveryTime
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get user's orders
export const getUserOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user!._id;

    // Build query
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('restaurantId', 'name image cuisine')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, userId })
      .populate('restaurantId', 'name address phone image cuisine')
      .populate('userId', 'name email phone');

    if (!order) {
      throw createError('Order not found', 404);
    }

    res.json({
      success: true,
      data: {
        order
      }
    });

  } catch (error) {
    next(error);
  }
};

// Update order status (for restaurant/delivery staff)
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, estimatedDeliveryTime } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      throw createError('Order not found', 404);
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready'],
      'ready': ['delivering'],
      'delivering': ['delivered'],
      'delivered': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      throw createError(`Cannot change order status from ${order.status} to ${status}`, 400);
    }

    // Update order
    order.status = status;
    if (estimatedDeliveryTime) {
      order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
    }

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    // Emit real-time status update
    io.to(`order-${order._id}`).emit('order:status', {
      orderId: order._id,
      status: order.status,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      actualDeliveryTime: order.actualDeliveryTime
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });

  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      throw createError('Order not found', 404);
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw createError('Order cannot be cancelled at this stage', 400);
    }

    order.status = 'cancelled';
    await order.save();

    // Emit real-time notification
    io.to(`order-${order._id}`).emit('order:status', {
      orderId: order._id,
      status: 'cancelled',
      reason
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });

  } catch (error) {
    next(error);
  }
};

// Process payment (mock payment)
export const processPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentDetails } = req.body;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      throw createError('Order not found', 404);
    }

    if (order.paymentStatus === 'paid') {
      throw createError('Payment already processed', 400);
    }

    // Mock payment processing with 95% success rate
    const paymentSuccess = Math.random() < 0.95;

    if (!paymentSuccess) {
      order.paymentStatus = 'failed';
      await order.save();
      throw createError('Payment failed. Please try again.', 400);
    }

    // Successful payment
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    // Emit real-time notification
    io.to(`order-${order._id}`).emit('order:payment', {
      orderId: order._id,
      paymentStatus: 'paid',
      status: 'confirmed',
      estimatedDeliveryTime: order.estimatedDeliveryTime
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        order,
        paymentId: order.paymentId
      }
    });

  } catch (error) {
    next(error);
  }
};

// Track order location (mock real-time tracking)
export const trackOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      throw createError('Order not found', 404);
    }

    // Mock delivery location data
    let locationData = null;

    if (order.status === 'delivering') {
      // Generate random coordinates near the restaurant for demo
      const restaurant = await Restaurant.findById(order.restaurantId);
      if (restaurant && restaurant.address.coordinates) {
        const [restaurantLng, restaurantLat] = restaurant.address.coordinates;

        // Add some random offset for demonstration
        const offset = 0.01; // Roughly 1km
        locationData = {
          latitude: restaurantLat + (Math.random() - 0.5) * offset,
          longitude: restaurantLng + (Math.random() - 0.5) * offset,
          estimatedArrival: order.estimatedDeliveryTime,
          driverName: 'John Doe',
          vehicle: 'Honda Civic'
        };
      }
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        status: order.status,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        location: locationData
      }
    });

  } catch (error) {
    next(error);
  }
};