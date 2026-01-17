import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  Settings,
  UsersRound,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { NavItem, UserRole, PermissionResource, PermissionAction } from '@/types';
import { cn } from '@/utils/helpers';

// Navigation configuration
const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Companies',
    path: '/companies',
    icon: Building2,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: 'Users',
    path: '/users',
    icon: Users,
    permission: {
      resource: PermissionResource.USERS,
      action: PermissionAction.READ,
    },
  },
  {
    label: 'Roles',
    path: '/roles',
    icon: Shield,
    permission: {
      resource: PermissionResource.ROLES,
      action: PermissionAction.READ,
    },
  },
  {
    label: 'Team',
    path: '/team',
    icon: UsersRound,
    roles: [UserRole.MANAGER],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    permission: {
      resource: PermissionResource.SETTINGS,
      action: PermissionAction.READ,
    },
  },
];

export const Sidebar = () => {
  const { hasPermission, hasAnyRole, user } = useAuth();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  // Filter navigation items based on permissions and roles
  const visibleNavItems = navigationItems.filter((item) => {
    // Check role-based access
    if (item.roles && item.roles.length > 0) {
      if (!hasAnyRole(item.roles)) {
        return false;
      }
    }

    // Check permission-based access
    if (item.permission) {
      if (!hasPermission(item.permission.resource, item.permission.action)) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-screen w-64 transform bg-gradient-to-b from-white to-gray-50/50 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-gray-100',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6 bg-white">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Admin Dashboard</h1>
        </div>

        {/* User Info */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white shadow-lg shadow-primary-500/30">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-primary-600 font-medium">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-500 text-center">
            © 2026 Admin Dashboard
          </p>
        </div>
      </aside>
    </>
  );
};
