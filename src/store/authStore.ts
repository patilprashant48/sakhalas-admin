import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, AuthTokens } from '@/types';

interface AuthStore {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  selectedCompanyId: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: AuthUser, tokens: AuthTokens) => void;
  setSelectedCompany: (companyId: string | null) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      selectedCompanyId: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          // Super admin doesn't have a companyId, so we don't set it automatically
          selectedCompanyId: user.role === 'SUPER_ADMIN' ? null : user.companyId || null,
        });
      },

      setSelectedCompany: (companyId) => {
        set({ selectedCompanyId: companyId });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          selectedCompanyId: null,
          isAuthenticated: false,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          tokens: null,
          selectedCompanyId: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        selectedCompanyId: state.selectedCompanyId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
