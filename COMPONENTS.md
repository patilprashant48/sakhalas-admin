# 🎨 Component Showcase

Visual guide to all reusable components with usage examples.

---

## 🔘 Button

**Variants:** primary | secondary | danger | ghost  
**Sizes:** sm | md | lg

```typescript
import { Button } from '@/components/Button';
import { Plus } from 'lucide-react';

// Primary button (default)
<Button>Click me</Button>

// With icon
<Button icon={<Plus className="h-4 w-4" />}>
  Add Item
</Button>

// Secondary variant
<Button variant="secondary">Cancel</Button>

// Danger variant
<Button variant="danger">Delete</Button>

// Ghost variant
<Button variant="ghost">Cancel</Button>

// Small size
<Button size="sm">Small</Button>

// Large size
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Saving...</Button>

// Disabled
<Button disabled>Disabled</Button>
```

---

## 📝 Input

**Types:** text | email | password | number | date | etc.

```typescript
import { Input } from '@/components/Input';
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

// Basic input
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  {...register('email')}
/>

// With error
<Input
  label="Password"
  type="password"
  error={errors.password?.message}
  {...register('password')}
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
  {...register('username')}
/>

// Required field
<Input
  label="First Name"
  required
  {...register('firstName')}
/>

// Disabled
<Input label="Email" value="user@example.com" disabled />
```

---

## 📋 Select

**Features:** Options list, validation, custom styling

```typescript
import { Select } from '@/components/Select';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Guest', value: 'guest' },
];

// Basic select
<Select
  label="Role"
  options={roleOptions}
  {...register('role')}
/>

// With error
<Select
  label="Country"
  options={countries}
  error={errors.country?.message}
  {...register('country')}
/>

// Required
<Select
  label="Category"
  options={categories}
  required
  {...register('category')}
/>
```

---

## 📊 DataTable

**Features:** Search, sort, pagination, custom rendering

```typescript
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'active' ? 'success' : 'danger'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (_, row) => (
      <button onClick={() => handleEdit(row)}>Edit</button>
    ),
  },
];

// Full-featured table
<DataTable
  data={users}
  columns={columns}
  searchable={true}
  searchPlaceholder="Search users..."
  pagination={true}
  pageSize={10}
  onRowClick={(row) => console.log(row)}
  emptyMessage="No users found"
/>

// Simple table without search/pagination
<DataTable
  data={items}
  columns={columns}
  searchable={false}
  pagination={false}
/>
```

---

## 🪟 Modal

**Sizes:** sm | md | lg | xl  
**Features:** Custom header, body, footer

```typescript
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

const [isOpen, setIsOpen] = useState(false);

// Basic modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create User"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Create</Button>
    </>
  }
>
  <form className="space-y-4">
    <Input label="Name" {...register('name')} />
    <Input label="Email" {...register('email')} />
  </form>
</Modal>

// Large modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Company"
  size="lg"
>
  {/* Content */}
</Modal>

// Modal without footer
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Information"
>
  <p>Your changes have been saved.</p>
</Modal>
```

---

## ⚠️ ConfirmDialog

**Variants:** danger | warning | info

```typescript
import { ConfirmDialog } from '@/components/ConfirmDialog';

const [isOpen, setIsOpen] = useState(false);

// Danger confirmation
<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  isLoading={isDeleting}
/>

// Warning confirmation
<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleAction}
  title="Warning"
  message="This action may have side effects."
  variant="warning"
/>

// Info confirmation
<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Confirm"
  message="Do you want to proceed?"
  variant="info"
/>
```

---

## ⏳ Loader

**Sizes:** sm | md | lg  
**Features:** Full screen option, custom text

```typescript
import { Loader } from '@/components/Loader';

// Small loader
<Loader size="sm" />

// Medium loader (default)
<Loader size="md" text="Loading..." />

// Large loader
<Loader size="lg" text="Please wait..." />

// Full screen loader
<Loader size="lg" text="Processing..." fullScreen />

// Conditional rendering
{isLoading && <Loader text="Loading data..." />}

// In a container
<div className="py-12">
  {isLoading ? <Loader /> : <YourContent />}
</div>
```

---

## 🏷️ Badge

**Variants:** default | success | warning | danger | info  
**Sizes:** sm | md

```typescript
import { Badge } from '@/components/Badge';

// Success badge
<Badge variant="success">Active</Badge>

// Danger badge
<Badge variant="danger">Inactive</Badge>

// Warning badge
<Badge variant="warning">Pending</Badge>

// Info badge
<Badge variant="info">New</Badge>

// Default badge
<Badge>Default</Badge>

// Medium size
<Badge variant="success" size="md">Verified</Badge>

// In a table cell
{
  key: 'status',
  label: 'Status',
  render: (value) => (
    <Badge variant={value === 'active' ? 'success' : 'danger'}>
      {value}
    </Badge>
  ),
}
```

---

## 🧭 Sidebar

**Features:** Permission-aware, role-based, responsive

```typescript
// Located in src/components/Sidebar.tsx
// Auto-renders based on user permissions

// Navigation items configuration
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
    roles: [UserRole.SUPER_ADMIN], // Only for super admin
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
];

// Sidebar automatically:
// ✓ Filters menu items based on permissions
// ✓ Highlights active route
// ✓ Collapses on mobile
// ✓ Shows user info at top
```

---

## 🎯 Header

**Features:** Profile dropdown, company switcher, notifications

```typescript
// Located in src/components/Header.tsx
// Auto-renders based on user role

// Features:
// ✓ User profile with dropdown
// ✓ Company switcher (Super Admin only)
// ✓ Logout functionality
// ✓ Mobile menu toggle
// ✓ Responsive design

// Company switcher example (visible only to Super Admin)
const selectedCompany = companies.find(c => c.id === selectedCompanyId);

<CompanySwitcher
  companies={companies}
  selected={selectedCompany}
  onSwitch={(companyId) => setSelectedCompany(companyId)}
/>
```

---

## 🎨 Layout Components

### AppLayout

**Purpose:** Main application wrapper with sidebar and header

```typescript
import { AppLayout } from '@/layouts/AppLayout';
import { Outlet } from 'react-router-dom';

// Used in routes
<Route element={<AppLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/users" element={<Users />} />
</Route>

// Structure:
// ┌─────────────────────────────────┐
// │  Header                         │
// ├──────────┬──────────────────────┤
// │          │                      │
// │ Sidebar  │  Page Content        │
// │          │  (Outlet)            │
// │          │                      │
// └──────────┴──────────────────────┘
```

---

## 🎨 Color Palette

### Status Colors

```typescript
// Success (Green)
<Badge variant="success">Active</Badge>
className="bg-green-100 text-green-800"

// Danger (Red)
<Badge variant="danger">Deleted</Badge>
className="bg-red-100 text-red-800"

// Warning (Yellow)
<Badge variant="warning">Pending</Badge>
className="bg-yellow-100 text-yellow-800"

// Info (Blue)
<Badge variant="info">New</Badge>
className="bg-blue-100 text-blue-800"

// Default (Gray)
<Badge>Default</Badge>
className="bg-gray-100 text-gray-800"
```

### Primary Colors

```typescript
// Primary brand color (customizable in tailwind.config.js)
className="bg-primary-600"  // #0284c7
className="bg-primary-500"  // #0ea5e9
className="bg-primary-100"  // #e0f2fe
className="text-primary-600"
className="border-primary-500"
```

---

## 🖼️ Icon Usage

Using **Lucide React** icons:

```typescript
import {
  User,
  Building2,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  // ... many more
} from 'lucide-react';

// In components
<User className="h-4 w-4" />
<Plus className="h-5 w-5 text-primary-600" />
<Settings className="h-6 w-6" />

// Sizes:
// h-3 w-3 → 12px (tiny)
// h-4 w-4 → 16px (small)
// h-5 w-5 → 20px (medium)
// h-6 w-6 → 24px (large)
// h-8 w-8 → 32px (extra large)
```

---

## 📱 Responsive Classes

Common responsive patterns:

```typescript
// Mobile-first approach
className="
  text-sm              // Mobile (base)
  md:text-base         // Tablet (768px+)
  lg:text-lg           // Desktop (1024px+)
"

// Grid layouts
className="
  grid
  grid-cols-1          // Mobile: 1 column
  md:grid-cols-2       // Tablet: 2 columns
  lg:grid-cols-3       // Desktop: 3 columns
  gap-4
"

// Visibility toggles
className="
  hidden               // Hide on mobile
  lg:block             // Show on desktop
"

// Sidebar example
className="
  fixed                // Mobile: overlay
  lg:static            // Desktop: in flow
  transform
  -translate-x-full    // Mobile: hidden
  lg:translate-x-0     // Desktop: visible
"
```

---

## 🎯 Usage Tips

### 1. Form Handling
Always use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### 2. State Management
Use Zustand for global state:

```typescript
import { useAuthStore } from '@/store/authStore';

const { user, setAuth, logout } = useAuthStore();
```

### 3. Permissions
Always check permissions before rendering:

```typescript
import { useAuth } from '@/hooks/useAuth';

const { hasPermission } = useAuth();

{hasPermission('USERS', 'CREATE') && (
  <Button>Add User</Button>
)}
```

### 4. API Calls
Use service layers, not direct axios:

```typescript
import { userService } from '@/api/userService';

const users = await userService.getAll({ page: 1, pageSize: 10 });
```

### 5. Toast Notifications
Show feedback for all actions:

```typescript
import toast from 'react-hot-toast';

toast.success('User created successfully');
toast.error('Failed to delete user');
toast.loading('Processing...');
```

---

**Component library built for scale and maintainability! 🚀**
