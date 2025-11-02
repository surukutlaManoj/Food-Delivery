import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomizationOption {
  name: string;
  price: number;
}

export interface ICustomization {
  name: string;
  options: ICustomizationOption[];
}

export interface IMenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  dietary: string[]; // vegetarian, vegan, gluten-free, etc.
  customizations?: ICustomization[];
  isAvailable: boolean;
}

export interface IMenuCategory {
  category: string;
  items: IMenuItem[];
}

export interface IAddress {
  street: string;
  city: string;
  coordinates: [number, number];
}

export interface IRestaurant extends Document {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: IAddress;
  menu: IMenuCategory[];
  isActive: boolean;
}

const CustomizationOptionSchema = new Schema<ICustomizationOption>({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const CustomizationSchema = new Schema<ICustomization>({
  name: { type: String, required: true },
  options: [CustomizationOptionSchema]
}, { _id: false });

const MenuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Menu item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Menu item description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Menu item price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Menu item image is required']
  },
  dietary: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher']
  }],
  customizations: [CustomizationSchema],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const MenuCategorySchema = new Schema<IMenuCategory>({
  category: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  items: [MenuItemSchema]
}, { _id: false });

const AddressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(coordinates: number[]) {
        return coordinates.length === 2 &&
               coordinates[0] >= -180 && coordinates[0] <= 180 &&
               coordinates[1] >= -90 && coordinates[1] <= 90;
      },
      message: 'Invalid coordinates. Expected [longitude, latitude]'
    }
  }
}, { _id: false });

const RestaurantSchema = new Schema<IRestaurant>({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Restaurant image is required']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: ['Italian', 'Chinese', 'Mexican', 'American', 'Indian', 'Japanese', 'Thai', 'Mediterranean', 'French', 'Korean', 'Other']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    match: [/^\d+-\d+\s*min$/, 'Delivery time should be in format "25-35 min"']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: [0, 'Delivery fee cannot be negative']
  },
  minOrder: {
    type: Number,
    required: [true, 'Minimum order is required'],
    min: [0, 'Minimum order cannot be negative']
  },
  address: {
    type: AddressSchema,
    required: [true, 'Restaurant address is required']
  },
  menu: [MenuCategorySchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
RestaurantSchema.index({ cuisine: 1 });
RestaurantSchema.index({ rating: -1 });
RestaurantSchema.index({ 'address.city': 1 });
RestaurantSchema.index({ isActive: 1 });

// Text search index for restaurant name and cuisine
RestaurantSchema.index({
  name: 'text',
  cuisine: 'text',
  'menu.category': 'text',
  'menu.items.name': 'text'
});

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);