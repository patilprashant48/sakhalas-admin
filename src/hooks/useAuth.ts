import { useAuthStore } from '@/store/authStore';
import { PermissionAction, PermissionResource, UserRole } from '@/types';

/**
 * Hook to check if user has a specific permission
 */
export const usePermission = () => {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (resource: PermissionResource, action: PermissionAction): boolean => {
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Check if user has the specific permission
    return user.permissions?.some(
      (p) => p.resource === resource && p.action === action
    ) || false;
  };

  const hasAnyPermission = (permissions: Array<{ resource: PermissionResource; action: PermissionAction }>): boolean => {
    return permissions.some(({ resource, action }) => hasPermission(resource, action));
  };

  const hasAllPermissions = (permissions: Array<{ resource: PermissionResource; action: PermissionAction }>): boolean => {
    return permissions.every(({ resource, action }) => hasPermission(resource, action));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

/**
 * Hook to check if user has a specific role
 */
export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === UserRole.SUPER_ADMIN;
  };

  const isCompanyAdmin = (): boolean => {
    return user?.role === UserRole.COMPANY_ADMIN;
  };

  const isManager = (): boolean => {
    return user?.role === UserRole.MANAGER;
  };

  const isEmployee = (): boolean => {
    return user?.role === UserRole.EMPLOYEE;
  };

  return {
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isCompanyAdmin,
    isManager,
    isEmployee,
    currentRole: user?.role,
  };
};

/**
 * Combined hook for easier access to auth state
 */
export const useAuth = () => {
  const {
    user,
    tokens,
    selectedCompanyId,
    isAuthenticated,
    setAuth,
    setSelectedCompany,
    updateUser,
    logout,
  } = useAuthStore();

  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
  const {
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isCompanyAdmin,
    isManager,
    isEmployee,
    currentRole,
  } = useRole();

  return {
    // State
    user,
    tokens,
    selectedCompanyId,
    isAuthenticated,
    currentRole,

    // Actions
    setAuth,
    setSelectedCompany,
    updateUser,
    logout,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Role checks
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isCompanyAdmin,
    isManager,
    isEmployee,
  };
};
