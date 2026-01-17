import apiClient from './client';
import { ApiResponse } from '@/types';

export interface DashboardStats {
  totalCompanies?: number;
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  activityCount: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export const statsService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<RecentActivity[]>> => {
    const response = await apiClient.get('/dashboard/activity', { params });
    return response.data;
  },
};
