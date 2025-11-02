import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(createError(message, 400));
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(createError(message, 400));
    }

    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params);

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(createError(message, 400));
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required().messages({
      'string.pattern.base': 'Please enter a valid phone number',
      'any.required': 'Phone number is required'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  // Restaurant schemas
  restaurantQuery: Joi.object({
    cuisine: Joi.string().optional(),
    minRating: Joi.number().min(0).max(5).optional(),
    maxDeliveryTime: Joi.number().min(0).optional(),
    search: Joi.string().optional(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10)
  }),

  // Order schemas
  createOrder: Joi.object({
    restaurantId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid restaurant ID',
      'any.required': 'Restaurant ID is required'
    }),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
        customizations: Joi.object().default({}),
        menuItemId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
      })
    ).min(1).required().messages({
      'array.min': 'Order must contain at least one item'
    }),
    deliveryAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required()
    }).required(),
    specialInstructions: Joi.string().max(500).optional()
  }),

  // User profile schemas
  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional()
  }),

  addAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    isDefault: Joi.boolean().default(false)
  }),

  // MongoDB ObjectId validation
  objectId: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid ID format'
    })
  })
};