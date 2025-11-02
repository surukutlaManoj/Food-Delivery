import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/types';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

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
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any): void {
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
  public async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  public async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  public async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Specific API methods
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post('/auth/login', credentials),

  register: (userData: { name: string; email: string; password: string; phone: string }) =>
    apiService.post('/auth/register', userData),

  getCurrentUser: () =>
    apiService.get('/auth/me'),

  logout: () =>
    apiService.post('/auth/logout'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiService.post('/auth/change-password', data),

  deleteAccount: (data: { password: string }) =>
    apiService.delete('/auth/account', data),
};

export const restaurantAPI = {
  getAll: (params?: {
    cuisine?: string;
    minRating?: number;
    maxDeliveryTime?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    apiService.get('/restaurants', params),

  getById: (id: string) =>
    apiService.get(`/restaurants/${id}`),

  getMenu: (id: string) =>
    apiService.get(`/restaurants/${id}/menu`),

  getCuisines: () =>
    apiService.get('/restaurants/cuisines'),

  search: (params: {
    query?: string;
    cuisine?: string;
    rating?: number;
    sortBy?: string;
    order?: string;
    page?: number;
    limit?: number;
  }) =>
    apiService.get('/restaurants/search', params),

  getFeatured: (limit?: number) =>
    apiService.get('/restaurants/featured', { limit }),
};

export const orderAPI = {
  create: (orderData: {
    restaurantId: string;
    items: any[];
    deliveryAddress: any;
    specialInstructions?: string;
  }) =>
    apiService.post('/orders', orderData),

  getUserOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    apiService.get('/orders', params),

  getById: (id: string) =>
    apiService.get(`/orders/${id}`),

  updateStatus: (id: string, status: string, estimatedDeliveryTime?: string) =>
    apiService.patch(`/orders/${id}/status`, { status, estimatedDeliveryTime }),

  cancel: (id: string, reason?: string) =>
    apiService.patch(`/orders/${id}/cancel`, { reason }),

  processPayment: (id: string, paymentData: {
    paymentMethod: string;
    paymentDetails: any;
  }) =>
    apiService.post(`/orders/${id}/payment`, paymentData),

  track: (id: string) =>
    apiService.get(`/orders/${id}/track`),
};

export const userAPI = {
  getProfile: () =>
    apiService.get('/users/profile'),

  updateProfile: (data: { name?: string; phone?: string }) =>
    apiService.patch('/users/profile', data),

  addAddress: (addressData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  }) =>
    apiService.post('/users/addresses', addressData),

  updateAddress: (addressId: string, addressData: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isDefault?: boolean;
  }) =>
    apiService.patch(`/users/addresses/${addressId}`, addressData),

  setDefaultAddress: (addressId: string) =>
    apiService.patch(`/users/addresses/${addressId}/default`),

  deleteAddress: (addressId: string) =>
    apiService.delete(`/users/addresses/${addressId}`),
};

export default apiService;