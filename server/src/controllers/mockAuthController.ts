import { Response, NextFunction } from 'express';
import { generateToken } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

// Mock user data storage
let mockUsers: any[] = [];
let userIdCounter = 1;

// Register new user
export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email || user.phone === phone);

    if (existingUser) {
      if (existingUser.email === email) {
        throw createError('Email is already registered', 400);
      }
      if (existingUser.phone === phone) {
        throw createError('Phone number is already registered', 400);
      }
    }

    // Create new user
    const user = {
      id: (userIdCounter++).toString(),
      name,
      email,
      phone,
      addresses: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockUsers.push(user);

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userResponse
      }
    });

  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email (in mock mode, we'll accept any password for demo)
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw createError('Account has been deactivated', 401);
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get current user (protected route)
export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw createError('User not found', 404);
    }

    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      throw createError('User not found', 404);
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    next(error);
  }
};

// Logout user (client-side token removal)
export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    next(error);
  }
};

// Create demo user for testing
export const createDemoUser = () => {
  const demoUser = {
    id: (userIdCounter++).toString(),
    name: 'Demo User',
    email: 'demo@fooddelivery.com',
    phone: '+1234567890',
    addresses: [
      {
        street: '123 Demo Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Only add if doesn't exist
  if (!mockUsers.find(u => u.email === demoUser.email)) {
    mockUsers.push(demoUser);
    console.log('👤 Demo user created:', demoUser.email);
  }

  return demoUser;
};