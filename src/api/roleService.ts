import apiClient from './client';
import { Role, RoleFormData, Permission, ApiResponse, PaginatedResponse } from '@/types';

export const roleService = {
  /**
   * Get all roles
   */
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Role>>> => {
    const response = await apiClient.get('/roles', { params });
    return response.data;
  },

  /**
   * Get role by ID
   */
  getById: async (id: string): Promise<ApiResponse<Role>> => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  /**
   * Create new role
   */
  create: async (data: RoleFormData): Promise<ApiResponse<Role>> => {
    const response = await apiClient.post('/roles', data);
    return response.data;
  },

  /**
   * Update role
   */
  update: async (id: string, data: Partial<RoleFormData>): Promise<ApiResponse<Role>> => {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data;
  },

  /**
   * Delete role
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },
};

export const permissionService = {
  /**
   * Get all available permissions
   */
  getAll: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await apiClient.get('/permissions');
    return response.data;
  },
};
