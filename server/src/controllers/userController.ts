import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone } = req.body;
    const userId = req.user!._id;

    // Check if phone number is already taken by another user
    if (phone) {
      const existingUser = await User.findOne({
        phone,
        _id: { $ne: userId }
      });

      if (existingUser) {
        throw createError('Phone number is already registered', 400);
      }
    }

    // Update user
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Add new address
export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { street, city, state, zipCode, isDefault = false } = req.body;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // If this is the default address, unset other default addresses
    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    // Add new address
    const newAddress = {
      street,
      city,
      state,
      zipCode,
      isDefault
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        address: user.addresses[user.addresses.length - 1]
      }
    });

  } catch (error) {
    next(error);
  }
};

// Update address
export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, isDefault } = req.body;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw createError('Address not found', 404);
    }

    // If this is the default address, unset other default addresses
    if (isDefault) {
      user.addresses.forEach((address, index) => {
        if (index !== addressIndex) {
          address.isDefault = false;
        }
      });
    }

    // Update address
    const address = user.addresses[addressIndex];
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (typeof isDefault === 'boolean') address.isDefault = isDefault;

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        address: user.addresses[addressIndex]
      }
    });

  } catch (error) {
    next(error);
  }
};

// Delete address
export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { addressId } = req.params;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw createError('Address not found', 404);
    }

    // Check if it's the default address
    const isDefault = user.addresses[addressIndex].isDefault;

    if (isDefault && user.addresses.length > 1) {
      throw createError('Cannot delete default address. Please set another address as default first.', 400);
    }

    // Remove address
    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Set default address
export const setDefaultAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { addressId } = req.params;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw createError('Address not found', 404);
    }

    // Unset all default addresses
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });

    // Set new default address
    user.addresses[addressIndex].isDefault = true;
    await user.save();

    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: {
        address: user.addresses[addressIndex]
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get user profile with statistics
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw createError('User not found', 404);
    }

    // Get order statistics
    const Order = (await import('../models/Order')).Order;
    const orderStats = await Order.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' }
        }
      }
    ]);

    // Format statistics
    const stats = {
      totalOrders: orderStats.reduce((sum, stat) => sum + stat.count, 0),
      totalSpent: orderStats.reduce((sum, stat) => sum + stat.totalSpent, 0),
      completedOrders: orderStats.find(s => s._id === 'delivered')?.count || 0,
      pendingOrders: orderStats.find(s => s._id === 'pending')?.count || 0
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        stats
      }
    });

  } catch (error) {
    next(error);
  }
};