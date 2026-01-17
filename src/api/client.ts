import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ApiError } from '@/types';
import toast from 'react-hot-toast';

// Base API URL - should come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    const { tokens } = useAuthStore.getState();
    
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    // Add selected company to headers for multi-tenant context
    const { selectedCompanyId } = useAuthStore.getState();
    if (selectedCompanyId) {
      config.headers['X-Company-Id'] = selectedCompanyId;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection and ensure the API server is running.');
      return Promise.reject(error);
    }

    // Handle token expiration
    if (error.response?.status === 401 && originalRequest) {
      const { logout } = useAuthStore.getState();
      
      // Try to refresh token (implement if your API supports it)
      // For now, just logout
      logout();
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      
      return Promise.reject(error);
    }

    // Handle forbidden access
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    // Handle validation errors
    if (error.response?.status === 422 || error.response?.status === 400) {
      const apiError = error.response.data;
      if (apiError.errors) {
        // Display validation errors
        Object.values(apiError.errors).flat().forEach((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error(apiError.message || 'Validation error');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
