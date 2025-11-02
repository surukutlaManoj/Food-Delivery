import { Router } from 'express';
import Joi from 'joi';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = Router();

// Register new user
router.post('/register', validate(schemas.register), authController.register);

// Login user
router.post('/login', validate(schemas.login), authController.login);

// Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// Logout user (protected)
router.post('/logout', authenticate, authController.logout);

// Change password (protected)
router.post('/change-password', authenticate, validate(Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
})), authController.changePassword);

// Delete account (protected)
router.delete('/account', authenticate, validate(Joi.object({
  password: Joi.string().required()
})), authController.deleteAccount);

export default router;