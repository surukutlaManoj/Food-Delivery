import { Response, NextFunction } from 'express';
import { Restaurant } from '../models/Restaurant';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

// Get all restaurants with filtering and pagination
export const getAllRestaurants = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      cuisine,
      minRating,
      maxDeliveryTime,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query: any = { isActive: true };

    if (cuisine) {
      query.cuisine = cuisine;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating as string) };
    }

    if (maxDeliveryTime) {
      // Extract minimum delivery time from string like "25-35 min"
      query.deliveryTime = {
        $regex: new RegExp(`^\\d+-${maxDeliveryTime}\\s*min$`)
      };
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const restaurants = await Restaurant.find(query)
      .select('name description image cuisine rating deliveryTime deliveryFee minOrder address')
      .sort(search ? { score: { $meta: 'textScore' } } : { rating: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      data: {
        restaurants,
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

// Get restaurant by ID with full menu
export const getRestaurantById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      _id: id,
      isActive: true
    });

    if (!restaurant) {
      throw createError('Restaurant not found', 404);
    }

    res.json({
      success: true,
      data: {
        restaurant
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get restaurant menu only
export const getRestaurantMenu = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne(
      {
        _id: id,
        isActive: true
      },
      'name menu deliveryFee deliveryTime minOrder'
    );

    if (!restaurant) {
      throw createError('Restaurant not found', 404);
    }

    res.json({
      success: true,
      data: {
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        menu: restaurant.menu,
        deliveryFee: restaurant.deliveryFee,
        deliveryTime: restaurant.deliveryTime,
        minOrder: restaurant.minOrder
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get available cuisine types
export const getCuisines = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cuisines = await Restaurant.distinct('cuisine', { isActive: true });

    res.json({
      success: true,
      data: {
        cuisines: cuisines.sort()
      }
    });

  } catch (error) {
    next(error);
  }
};

// Search restaurants (advanced search)
export const searchRestaurants = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      query,
      cuisine,
      rating,
      sortBy = 'rating',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const searchQuery: any = { isActive: true };

    if (query) {
      searchQuery.$text = { $search: query as string };
    }

    if (cuisine) {
      searchQuery.cuisine = cuisine;
    }

    if (rating) {
      searchQuery.rating = { $gte: parseFloat(rating as string) };
    }

    // Sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'rating':
        sortOptions.rating = order === 'desc' ? -1 : 1;
        break;
      case 'deliveryFee':
        sortOptions.deliveryFee = order === 'desc' ? -1 : 1;
        break;
      case 'deliveryTime':
        // Sort by numeric value extracted from delivery time
        sortOptions.deliveryTime = order === 'desc' ? -1 : 1;
        break;
      case 'name':
        sortOptions.name = order === 'desc' ? -1 : 1;
        break;
      default:
        sortOptions.rating = -1;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const restaurants = await Restaurant.find(searchQuery)
      .select('name description image cuisine rating deliveryTime deliveryFee minOrder address')
      .sort(query ? { score: { $meta: 'textScore' }, ...sortOptions } : sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Restaurant.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        restaurants,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: {
          query,
          cuisine,
          rating,
          sortBy,
          order
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get featured restaurants (highly rated)
export const getFeaturedRestaurants = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 6 } = req.query;

    const restaurants = await Restaurant.find({ isActive: true, rating: { $gte: 4.0 } })
      .select('name description image cuisine rating deliveryTime deliveryFee minOrder address')
      .sort({ rating: -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.json({
      success: true,
      data: {
        restaurants
      }
    });

  } catch (error) {
    next(error);
  }
};