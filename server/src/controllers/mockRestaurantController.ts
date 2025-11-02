import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

// Mock restaurant data
const mockRestaurants = [
  {
    _id: '1',
    name: "Bella Italia",
    description: "Authentic Italian cuisine with a modern twist. Family recipes passed down through generations.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    minOrder: 15,
    address: {
      street: "123 Main Street",
      city: "New York",
      coordinates: [-74.0060, 40.7128]
    },
    menu: [
      {
        category: "Appetizers",
        items: [
          {
            name: "Bruschetta",
            description: "Toasted bread with tomatoes, garlic, and fresh basil",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300&h=200&fit=crop",
            dietary: ["vegetarian"],
            customizations: [
              {
                name: "Extra Toppings",
                options: [
                  { name: "Extra Mozzarella", price: 2.00 },
                  { name: "Prosciutto", price: 3.50 }
                ]
              }
            ],
            isAvailable: true
          }
        ]
      }
    ],
    isActive: true
  },
  {
    _id: '2',
    name: "Dragon Palace",
    description: "Traditional Chinese cuisine specializing in Szechuan and Cantonese dishes.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    cuisine: "Chinese",
    rating: 4.3,
    deliveryTime: "25-40 min",
    deliveryFee: 1.99,
    minOrder: 20,
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      coordinates: [-73.935242, 40.730610]
    },
    menu: [],
    isActive: true
  },
  {
    _id: '3',
    name: "Taco Fiesta",
    description: "Authentic Mexican street food with fresh ingredients and bold flavors.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    cuisine: "Mexican",
    rating: 4.6,
    deliveryTime: "20-35 min",
    deliveryFee: 2.49,
    minOrder: 12,
    address: {
      street: "789 Elm Street",
      city: "New York",
      coordinates: [-73.989284, 40.750423]
    },
    menu: [],
    isActive: true
  }
];

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
    let filteredRestaurants = mockRestaurants.filter(restaurant => restaurant.isActive);

    if (cuisine) {
      filteredRestaurants = filteredRestaurants.filter(r =>
        r.cuisine.toLowerCase() === (cuisine as string).toLowerCase()
      );
    }

    if (minRating) {
      filteredRestaurants = filteredRestaurants.filter(r =>
        r.rating >= parseFloat(minRating as string)
      );
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(r =>
        r.name.toLowerCase().includes(searchLower) ||
        r.cuisine.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        restaurants: paginatedRestaurants,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredRestaurants.length,
          pages: Math.ceil(filteredRestaurants.length / limitNum)
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

    const restaurant = mockRestaurants.find(r => r._id === id && r.isActive);

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

// Get featured restaurants
export const getFeaturedRestaurants = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 6 } = req.query;

    const featured = mockRestaurants
      .filter(r => r.isActive && r.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: {
        restaurants: featured
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get available cuisine types
export const getCuisines = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cuisines = [...new Set(mockRestaurants.map(r => r.cuisine))].sort();

    res.json({
      success: true,
      data: {
        cuisines
      }
    });

  } catch (error) {
    next(error);
  }
};

// Search restaurants
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

    let filtered = mockRestaurants.filter(r => r.isActive);

    if (query) {
      const queryLower = (query as string).toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(queryLower) ||
        r.cuisine.toLowerCase().includes(queryLower) ||
        r.description.toLowerCase().includes(queryLower)
      );
    }

    if (cuisine) {
      filtered = filtered.filter(r => r.cuisine === cuisine);
    }

    if (rating) {
      filtered = filtered.filter(r => r.rating >= parseFloat(rating as string));
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'deliveryFee':
          aValue = a.deliveryFee;
          bValue = b.deliveryFee;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }

      if (order === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginated = filtered.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        restaurants: paginated,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filtered.length,
          pages: Math.ceil(filtered.length / limitNum)
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

// Get restaurant menu only
export const getRestaurantMenu = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurant = mockRestaurants.find(r => r._id === id && r.isActive);
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