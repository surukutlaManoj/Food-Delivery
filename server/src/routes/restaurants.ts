import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';
import { validateQuery, validateParams, schemas } from '../middleware/validation';

const router = Router();

// Get all restaurants with filtering and pagination
router.get('/', validateQuery(schemas.restaurantQuery), restaurantController.getAllRestaurants);

// Get featured restaurants
router.get('/featured', restaurantController.getFeaturedRestaurants);

// Get available cuisine types
router.get('/cuisines', restaurantController.getCuisines);

// Advanced search restaurants
router.get('/search', restaurantController.searchRestaurants);

// Get restaurant by ID
router.get('/:id', validateParams(schemas.objectId), restaurantController.getRestaurantById);

// Get restaurant menu only
router.get('/:id/menu', validateParams(schemas.objectId), restaurantController.getRestaurantMenu);

export default router;