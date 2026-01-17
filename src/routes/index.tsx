import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { UserRole, PermissionResource, PermissionAction } from '@/types';

// Pages (will be created)
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Companies from '@/pages/Companies';
import Users from '@/pages/Users';
import Roles from '@/pages/Roles';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

export const AppRoutes = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard - All authenticated users */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Companies - Super Admin only */}
            <Route
              element={
                <ProtectedRoute
                  roles={[UserRole.SUPER_ADMIN]}
                />
              }
            >
              <Route path="/companies" element={<Companies />} />
            </Route>

            {/* Users - Company Admin and Super Admin */}
            <Route
              element={
                <ProtectedRoute
                  permission={{
                    resource: PermissionResource.USERS,
                    action: PermissionAction.READ,
                  }}
                />
              }
            >
              <Route path="/users" element={<Users />} />
            </Route>

            {/* Roles - Company Admin and Super Admin */}
            <Route
              element={
                <ProtectedRoute
                  permission={{
                    resource: PermissionResource.ROLES,
                    action: PermissionAction.READ,
                  }}
                />
              }
            >
              <Route path="/roles" element={<Roles />} />
            </Route>

            {/* Settings */}
            <Route
              element={
                <ProtectedRoute
                  permission={{
                    resource: PermissionResource.SETTINGS,
                    action: PermissionAction.READ,
                  }}
                />
              }
            >
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path="/403" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
