import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, PermissionResource, PermissionAction } from '@/types';

interface ProtectedRouteProps {
  roles?: UserRole[];
  permission?: {
    resource: PermissionResource;
    action: PermissionAction;
  };
  requireCompany?: boolean;
}

/**
 * Protected route wrapper that checks authentication and authorization
 */
export const ProtectedRoute = ({ roles, permission, requireCompany = false }: ProtectedRouteProps) => {
  const { isAuthenticated, hasAnyRole, hasPermission, selectedCompanyId, isSuperAdmin } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if company is required (for super admin switching companies)
  if (requireCompany && isSuperAdmin() && !selectedCompanyId) {
    return <Navigate to="/companies" replace />;
  }

  // Check role-based access
  if (roles && roles.length > 0) {
    if (!hasAnyRole(roles)) {
      return <Navigate to="/403" replace />;
    }
  }

  // Check permission-based access
  if (permission) {
    if (!hasPermission(permission.resource, permission.action)) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};
