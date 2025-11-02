import { Router } from 'express';
import Joi from 'joi';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validate, validateParams, validateQuery, schemas } from '../middleware/validation';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Create new order
router.post('/', validate(schemas.createOrder), orderController.createOrder);

// Get user's orders
router.get('/', validateQuery(Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(10),
  status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled').optional()
})), orderController.getUserOrders);

// Get order by ID
router.get('/:id', validateParams(schemas.objectId), orderController.getOrderById);

// Update order status (for restaurant staff)
router.patch('/:id/status', validateParams(schemas.objectId), validate(Joi.object({
  status: Joi.string().valid('confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled').required(),
  estimatedDeliveryTime: Joi.date().optional()
})), orderController.updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', validateParams(schemas.objectId), validate(Joi.object({
  reason: Joi.string().max(500).optional()
})), orderController.cancelOrder);

// Process payment
router.post('/:id/payment', validateParams(schemas.objectId), validate(Joi.object({
  paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'cash').required(),
  paymentDetails: Joi.object().default({})
})), orderController.processPayment);

// Track order location
router.get('/:id/track', validateParams(schemas.objectId), orderController.trackOrder);

export default router;