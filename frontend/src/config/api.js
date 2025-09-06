// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  ITEMS: {
    BASE: `${API_BASE_URL}/api/items`,
    CATEGORIES: `${API_BASE_URL}/api/items/categories`,
    BY_ID: (id) => `${API_BASE_URL}/api/items/${id}`,
    REVIEWS: (id) => `${API_BASE_URL}/api/items/${id}/reviews`,
  },
  CART: {
    BASE: `${API_BASE_URL}/api/cart`,
    ADD: `${API_BASE_URL}/api/cart/add`,
    UPDATE: `${API_BASE_URL}/api/cart/update`,
    REMOVE: (id) => `${API_BASE_URL}/api/cart/remove/${id}`,
    CLEAR: `${API_BASE_URL}/api/cart/clear`,
  },
};

export default API_BASE_URL;
