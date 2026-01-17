import { NavLink } from 'react-router-dom';
import { Home, Building2, Users, Shield, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionAction, PermissionResource, UserRole } from '@/types';

export const BottomNav = () => {
  const { hasPermission, hasAnyRole } = useAuth();

  const items = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      visible: true,
    },
    {
      label: 'Companies',
      path: '/companies',
      icon: Building2,
      visible:
        hasAnyRole([UserRole.SUPER_ADMIN]) &&
        hasPermission(PermissionResource.COMPANIES, PermissionAction.READ),
    },
    {
      label: 'Users',
      path: '/users',
      icon: Users,
      visible: hasPermission(PermissionResource.USERS, PermissionAction.READ),
    },
    {
      label: 'Roles',
      path: '/roles',
      icon: Shield,
      visible: hasPermission(PermissionResource.ROLES, PermissionAction.READ),
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      visible: hasPermission(PermissionResource.SETTINGS, PermissionAction.READ),
    },
  ].filter((i) => i.visible);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-lg px-2 py-1 text-xs transition-colors ${
                  isActive
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="mb-1 h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
