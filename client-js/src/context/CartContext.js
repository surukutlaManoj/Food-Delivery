import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { calculateOrderTotal } from '../utils/helpers';

// Initial cart state
const initialCartState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
};

// Helper function to calculate cart totals
const calculateCartTotals = (cart) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.items.length > 0 ? (cart.restaurantId ? 2.99 : 0) : 0;
  const totals = calculateOrderTotal(subtotal, deliveryFee);

  return {
    ...cart,
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    total: totals.total,
  };
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESTAURANT': {
      const newCart = {
        ...state,
        restaurantId: action.payload.id,
        restaurantName: action.payload.name,
        items: [],
      };
      return calculateCartTotals(newCart);
    }

    case 'ADD_ITEM': {
      // Check if item is from different restaurant
      if (state.restaurantId && state.restaurantId !== action.payload.restaurantId) {
        toast.error('You can only add items from one restaurant at a time');
        return state;
      }

      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.name === action.payload.name &&
          JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations)
      );

      let newItems;

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item with unique ID
        const newItem = {
          ...action.payload,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        newItems = [...state.items, newItem];
      }

      const newCart = {
        ...state,
        items: newItems,
        restaurantId: action.payload.restaurantId,
        restaurantName: action.payload.restaurantName,
      };

      return calculateCartTotals(newCart);
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const newCart = {
        ...state,
        items: newItems,
      };

      // If no items left, clear restaurant
      if (newItems.length === 0) {
        newCart.restaurantId = null;
        newCart.restaurantName = null;
      }

      return calculateCartTotals(newCart);
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter((item) => item.id !== id);
        const newCart = {
          ...state,
          items: newItems,
        };

        if (newItems.length === 0) {
          newCart.restaurantId = null;
          newCart.restaurantName = null;
        }

        return calculateCartTotals(newCart);
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const newCart = {
        ...state,
        items: newItems,
      };

      return calculateCartTotals(newCart);
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        restaurantId: null,
        restaurantName: null,
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
      };
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    case 'UPDATE_CART_TOTALS': {
      return calculateCartTotals(state);
    }

    default:
      return state;
  }
};

// Create context
const CartContext = createContext(undefined);

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Set restaurant
  const setRestaurant = (restaurantId, restaurantName) => {
    dispatch({ type: 'SET_RESTAURANT', payload: { id: restaurantId, name: restaurantName } });
  };

  // Add item to cart
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success('Added to cart!');
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Removed from cart');
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  // Get total item count
  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Check if cart is empty
  const isEmpty = () => {
    return cart.items.length === 0;
  };

  // Check if cart has items from a specific restaurant
  const hasRestaurantItems = (restaurantId) => {
    return cart.restaurantId === restaurantId;
  };

  // Get cart totals
  const getCartTotals = () => {
    return {
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      total: cart.total,
    };
  };

  const value = {
    cart,
    setRestaurant,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    isEmpty,
    hasRestaurantItems,
    getCartTotals,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
