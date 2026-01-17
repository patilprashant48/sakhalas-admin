import apiClient from './client';
import { User, UserFormData, ApiResponse, PaginatedResponse, UserRole } from '@/types';

export const userService = {
  /**
   * Get all users (filtered by selected company for non-super-admins)
   */
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: UserRole;
    isActive?: boolean;
    companyId?: string;
  }): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  create: async (data: UserFormData): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: string, data: Partial<UserFormData>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Toggle user active status
   */
  toggleActive: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch(`/users/${id}/toggle-active`);
    return response.data;
  },
};
