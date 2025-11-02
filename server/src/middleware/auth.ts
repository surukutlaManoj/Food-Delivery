import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Access token required', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw createError('Access token required', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw createError('User not found', 401);
    }

    if (!user.isActive) {
      throw createError('Account has been deactivated', 401);
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

// Optional authentication - doesn't throw error if no token
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (user && user.isActive) {
      req.user = user;
    }

    next();

  } catch (error) {
    // Silently ignore authentication errors for optional auth
    next();
  }
};

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

// Refresh token functionality
export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token required', 401);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw createError('User not found', 401);
    }

    const newAccessToken = generateToken(user._id.toString());

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(createError('Invalid or expired refresh token', 401));
    } else {
      next(error);
    }
  }
};