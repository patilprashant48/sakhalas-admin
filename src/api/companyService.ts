import apiClient from './client';
import { Company, CompanyFormData, ApiResponse, PaginatedResponse } from '@/types';

export const companyService = {
  /**
   * Get all companies (Super Admin only)
   */
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<PaginatedResponse<Company>>> => {
    const response = await apiClient.get('/companies', { params });
    return response.data;
  },

  /**
   * Get company by ID
   */
  getById: async (id: string): Promise<ApiResponse<Company>> => {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },

  /**
   * Create new company
   */
  create: async (data: CompanyFormData): Promise<ApiResponse<Company>> => {
    const response = await apiClient.post('/companies', data);
    return response.data;
  },

  /**
   * Update company
   */
  update: async (id: string, data: Partial<CompanyFormData>): Promise<ApiResponse<Company>> => {
    const response = await apiClient.put(`/companies/${id}`, data);
    return response.data;
  },

  /**
   * Delete company
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/companies/${id}`);
    return response.data;
  },

  /**
   * Toggle company active status
   */
  toggleActive: async (id: string): Promise<ApiResponse<Company>> => {
    const response = await apiClient.patch(`/companies/${id}/toggle-active`);
    return response.data;
  },
};
