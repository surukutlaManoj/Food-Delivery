import { Router } from 'express';
import Joi from 'joi';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate, validateParams, schemas } from '../middleware/validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get user profile with statistics
router.get('/profile', userController.getProfile);

// Update user profile
router.patch('/profile', validate(schemas.updateProfile), userController.updateProfile);

// Add new address
router.post('/addresses', validate(schemas.addAddress), userController.addAddress);

// Update address
router.patch('/addresses/:addressId',
  validateParams(Joi.object({
    addressId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  })),
  validate(Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    isDefault: Joi.boolean().optional()
  })),
  userController.updateAddress
);

// Set default address
router.patch('/addresses/:addressId/default',
  validateParams(Joi.object({
    addressId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  })),
  userController.setDefaultAddress
);

// Delete address
router.delete('/addresses/:addressId',
  validateParams(Joi.object({
    addressId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  })),
  userController.deleteAddress
);

export default router;