import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalAmount: 0,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, token, loading: authLoading } = useAuth();

  // Load cart when user is authenticated and auth is not loading
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && token) {
        loadCart();
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    }
  }, [isAuthenticated, token, authLoading]);

  const loadCart = async () => {
    if (!isAuthenticated || !token) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get(API_ENDPOINTS.CART.BASE);
      dispatch({
        type: 'SET_CART',
        payload: response.data.cart
      });
    } catch (error) {
      console.error('Load cart error:', error);
      dispatch({
        type: 'CART_ERROR',
        payload: error.response?.data?.message || 'Failed to load cart'
      });
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!token) return { success: false, error: 'Please login first' };

    try {
      const response = await axios.post(API_ENDPOINTS.CART.ADD, {
        itemId,
        quantity
      });
      
      dispatch({
        type: 'SET_CART',
        payload: response.data.cart
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!token) return { success: false, error: 'Please login first' };

    try {
      const response = await axios.put(API_ENDPOINTS.CART.UPDATE, {
        itemId,
        quantity
      });
      
      dispatch({
        type: 'SET_CART',
        payload: response.data.cart
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return { success: false, error: 'Please login first' };

    try {
      const response = await axios.delete(API_ENDPOINTS.CART.REMOVE(itemId));
      
      dispatch({
        type: 'SET_CART',
        payload: response.data.cart
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    if (!token) return { success: false, error: 'Please login first' };

    try {
      await axios.delete(API_ENDPOINTS.CART.CLEAR);
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        loadCart,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
