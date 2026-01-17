import apiClient from './client';
import { LoginCredentials, AuthUser, AuthTokens, ApiResponse } from '@/types';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; tokens: AuthTokens }>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
