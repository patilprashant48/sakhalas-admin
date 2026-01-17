# Development Guide

## Project Architecture

### State Management Strategy

This application uses **Zustand** for state management with the following stores:

#### Auth Store (`src/store/authStore.ts`)
- User authentication state
- JWT tokens
- Selected company (for Super Admin)
- Persisted to localStorage

#### UI Store (`src/store/uiStore.ts`)
- Modal states
- Loading indicators
- Sidebar visibility (mobile)

### Permission System

The application implements a flexible permission system:

```typescript
// Check single permission
const { hasPermission } = useAuth();
if (hasPermission(PermissionResource.USERS, PermissionAction.CREATE)) {
  // Show create button
}

// Check multiple permissions
if (hasAnyPermission([
  { resource: 'USERS', action: 'READ' },
  { resource: 'USERS', action: 'UPDATE' }
])) {
  // Show user management
}
```

### Route Protection

Three levels of route protection:

1. **Authentication** - User must be logged in
2. **Role-based** - User must have specific role
3. **Permission-based** - User must have specific permission

Example:
```typescript
<Route
  element={
    <ProtectedRoute
      roles={[UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN]}
      permission={{
        resource: PermissionResource.USERS,
        action: PermissionAction.MANAGE,
      }}
    />
  }
>
  <Route path="/users" element={<Users />} />
</Route>
```

## Adding New Features

### 1. Add a New Page

```bash
# Create page component
src/pages/YourNewPage.tsx
```

```typescript
const YourNewPage = () => {
  const { hasPermission } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your New Page</h1>
      {/* Your content */}
    </div>
  );
};

export default YourNewPage;
```

### 2. Add Route

```typescript
// src/routes/index.tsx
<Route
  element={
    <ProtectedRoute
      permission={{
        resource: PermissionResource.YOUR_RESOURCE,
        action: PermissionAction.READ,
      }}
    />
  }
>
  <Route path="/your-route" element={<YourNewPage />} />
</Route>
```

### 3. Add to Navigation

```typescript
// src/components/Sidebar.tsx
const navigationItems: NavItem[] = [
  // ... existing items
  {
    label: 'Your Feature',
    path: '/your-route',
    icon: YourIcon,
    permission: {
      resource: PermissionResource.YOUR_RESOURCE,
      action: PermissionAction.READ,
    },
  },
];
```

### 4. Add API Service

```typescript
// src/api/yourService.ts
import apiClient from './client';

export const yourService = {
  getAll: async (params) => {
    const response = await apiClient.get('/your-endpoint', { params });
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/your-endpoint', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/your-endpoint/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/your-endpoint/${id}`);
    return response.data;
  },
};
```

## Component Patterns

### DataTable Usage

```typescript
const columns: TableColumn<YourType>[] = [
  {
    key: 'name',
    label: 'Name',
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
];

<DataTable
  data={data}
  columns={columns}
  searchPlaceholder="Search..."
  onRowClick={(row) => console.log(row)}
/>
```

### Modal with Form

```typescript
const [isOpen, setIsOpen] = useState(false);
const { register, handleSubmit } = useForm();

const onSubmit = async (data) => {
  // Handle form submission
  await yourService.create(data);
  setIsOpen(false);
};

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Item"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit(onSubmit)}>
        Create
      </Button>
    </>
  }
>
  <form className="space-y-4">
    <Input label="Name" {...register('name')} required />
    <Select label="Type" options={options} {...register('type')} required />
  </form>
</Modal>
```

### Confirm Dialog

```typescript
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

const handleDelete = async () => {
  await yourService.delete(itemId);
  toast.success('Deleted successfully');
  setIsDeleteDialogOpen(false);
};

<ConfirmDialog
  isOpen={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure? This action cannot be undone."
  variant="danger"
/>
```

## Styling Guidelines

### Using Tailwind Classes

- Use utility classes for spacing, colors, typography
- Compose with `cn()` helper for conditional classes
- Follow mobile-first responsive design

```typescript
<div className={cn(
  'rounded-lg border p-4',
  isActive ? 'bg-green-50' : 'bg-gray-50',
  'hover:shadow-md transition-shadow'
)}>
  Content
</div>
```

### Responsive Breakpoints

```
sm: 640px   - Mobile landscape
md: 768px   - Tablet
lg: 1024px  - Desktop
xl: 1280px  - Large desktop
2xl: 1536px - Extra large
```

## Error Handling

### API Errors

Handled globally in `src/api/client.ts`:
- **401** - Auto logout and redirect to login
- **403** - Toast error message
- **422/400** - Display validation errors
- **500+** - Generic server error message

### Form Validation

Using React Hook Form + Zod:

```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## Performance Tips

1. **Lazy load routes** for code splitting
2. **Memoize expensive calculations** with `useMemo`
3. **Debounce search inputs** to reduce API calls
4. **Optimize images** and use WebP format
5. **Limit table page size** for better performance
6. **Use React.memo** for components that rarely change

## Common Issues & Solutions

### Issue: Sidebar not closing on mobile
**Solution**: Check `useUIStore` implementation and overlay click handler

### Issue: Auth state not persisting
**Solution**: Verify Zustand persist middleware configuration

### Issue: Permission checks not working
**Solution**: Ensure user object includes permissions array from API

### Issue: Routes redirecting incorrectly
**Solution**: Check route order in `src/routes/index.tsx` - specific routes before wildcards

## Best Practices

1. **Always use TypeScript types** - No `any` types
2. **Extract reusable logic** into custom hooks
3. **Keep components small** - Single responsibility
4. **Use semantic HTML** for accessibility
5. **Add loading states** for async operations
6. **Handle edge cases** - empty states, errors
7. **Write descriptive variable names**
8. **Comment complex logic**
9. **Follow folder structure** consistently
10. **Test on multiple screen sizes**

## Debugging

### React DevTools
Install React DevTools browser extension to inspect:
- Component tree
- Props and state
- Performance profiling

### Zustand DevTools
Access store state in console:
```javascript
window.store = useAuthStore.getState()
```

### Network Debugging
Check API calls in browser DevTools Network tab:
- Request headers (auth token, company ID)
- Response status codes
- Response data

## Next Steps

Recommended enhancements:
- [ ] Add unit tests with Vitest
- [ ] Implement E2E tests with Playwright
- [ ] Add dark mode support
- [ ] Implement data export (CSV, PDF)
- [ ] Add real-time notifications with WebSocket
- [ ] Implement advanced filtering
- [ ] Add audit logs
- [ ] Create dashboard widgets
- [ ] Add multi-language support (i18n)
