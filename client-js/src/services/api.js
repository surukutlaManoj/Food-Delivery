import axios from 'axios';
import toast from 'react-hot-toast';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  handleError(error) {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';

    // Don't show toast for 401 errors (handled by auth context)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // Generic HTTP methods
  async get(url, params) {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post(url, data) {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put(url, data) {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async patch(url, data) {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.api.delete(url);
    return response.data;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Specific API methods
export const authAPI = {
  login: (credentials) =>
    apiService.post('/auth/login', credentials),

  register: (userData) =>
    apiService.post('/auth/register', userData),

  getCurrentUser: () =>
    apiService.get('/users/profile'),

  logout: () =>
    apiService.post('/auth/logout'),

  changePassword: (data) =>
    apiService.post('/auth/change-password', data),

  deleteAccount: (data) =>
    apiService.post('/auth/account/delete', data),
};

export const restaurantAPI = {
  getAll: (params) =>
    apiService.get('/restaurants', params),

  getById: (id) =>
    apiService.get(`/restaurants/${id}`),

  getMenu: (id) =>
    apiService.get(`/restaurants/${id}/menu`),

  getCuisines: () =>
    apiService.get('/restaurants/cuisines'),

  search: (params) =>
    apiService.get('/restaurants/search', params),

  getFeatured: (limit) =>
    apiService.get('/restaurants/featured', { limit }),
};

export const orderAPI = {
  create: (orderData) =>
    apiService.post('/orders', orderData),

  getUserOrders: (params) =>
    apiService.get('/orders', params),

  getById: (id) =>
    apiService.get(`/orders/${id}`),

  updateStatus: (id, status, estimatedDeliveryTime) =>
    apiService.put(`/orders/${id}/status`, { status, estimatedDeliveryTime }),

  cancel: (id, reason) =>
    apiService.patch(`/orders/${id}/cancel`, { reason }),

  processPayment: (id, paymentData) =>
    apiService.post(`/orders/${id}/payment`, paymentData),

  track: (id) =>
    apiService.get(`/orders/${id}/track`),
};

export const userAPI = {
  getProfile: () =>
    apiService.get('/users/profile'),

  updateProfile: (data) =>
    apiService.put('/users/profile', data),

  addAddress: (addressData) =>
    apiService.post('/users/addresses', addressData),

  updateAddress: (addressId, addressData) =>
    apiService.put(`/users/addresses/${addressId}`, addressData),

  deleteAddress: (addressId) =>
    apiService.delete(`/users/addresses/${addressId}`),
};
