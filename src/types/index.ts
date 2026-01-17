// ============================================
// USER ROLES
// ============================================
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

// ============================================
// PERMISSION TYPES
// ============================================
export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
}

export enum PermissionResource {
  COMPANIES = 'COMPANIES',
  USERS = 'USERS',
  ROLES = 'ROLES',
  PERMISSIONS = 'PERMISSIONS',
  SETTINGS = 'SETTINGS',
  TEAM = 'TEAM',
}

// ============================================
// CORE ENTITIES
// ============================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId?: string;
  company?: Company;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  logo?: string;
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  companyId?: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  resource: PermissionResource;
  action: PermissionAction;
  description?: string;
}

// ============================================
// AUTH TYPES
// ============================================
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser extends User {
  permissions: Permission[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  selectedCompanyId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// ============================================
// FORM TYPES
// ============================================
export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
  companyId?: string;
  isActive: boolean;
}

export interface CompanyFormData {
  name: string;
  domain: string;
  isActive: boolean;
  logo?: string;
}

export interface RoleFormData {
  name: string;
  description?: string;
  permissionIds: string[];
}

// ============================================
// TABLE & UI TYPES
// ============================================
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  companyId?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
}

// ============================================
// NAVIGATION TYPES
// ============================================
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  permission?: {
    resource: PermissionResource;
    action: PermissionAction;
  };
  roles?: UserRole[];
}
