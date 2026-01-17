# 🎯 Enterprise Multi-Tenant Admin Dashboard

A production-ready, frontend-only admin panel for multi-tenant SaaS systems built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based access control** (RBAC) with 4 user roles:
  - Super Admin (manage companies)
  - Company Admin (full company access)
  - Manager (team management)
  - Employee (read-only access)
- **Permission-based UI rendering** - UI elements show/hide based on permissions
- **Protected routes** with automatic redirects
- **Token-based authentication** with auto-logout on expiration
- **Company switching** for Super Admins

### 🎨 UI/UX
- **Modern, responsive design** optimized for desktop, tablet, and mobile
- **Reusable component library** (DataTable, Modal, Forms, etc.)
- **Permission-aware sidebar** with dynamic menu items
- **Company switcher** in header for Super Admins
- **Toast notifications** for user feedback
- **Loading states** and skeleton loaders
- **Error pages** (403, 404)

### 📊 Data Management
- **Advanced data tables** with:
  - Search functionality
  - Column sorting
  - Pagination
  - Custom cell rendering
- **CRUD operations** for Companies, Users, and Roles
- **Batch operations** support
- **CSV export** capability

### 🏗️ Architecture
- **Clean folder structure** following best practices
- **Type-safe** with TypeScript
- **State management** with Zustand
- **API layer** with Axios interceptors
- **Form validation** with React Hook Form + Zod
- **Custom hooks** for reusability

## 📁 Project Structure

```
src/
├── api/                    # API service layer
│   ├── client.ts          # Axios instance with interceptors
│   ├── authService.ts     # Authentication endpoints
│   ├── companyService.ts  # Company CRUD
│   ├── userService.ts     # User CRUD
│   └── roleService.ts     # Role & permission endpoints
│
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── DataTable.tsx
│   ├── Modal.tsx
│   ├── ConfirmDialog.tsx
│   ├── Loader.tsx
│   ├── Badge.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
│
├── layouts/               # Layout components
│   └── AppLayout.tsx     # Main app layout with sidebar
│
├── pages/                 # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Companies.tsx
│   ├── Users.tsx
│   ├── Roles.tsx
│   ├── Settings.tsx
│   ├── Unauthorized.tsx
│   └── NotFound.tsx
│
├── routes/                # Routing configuration
│   ├── index.tsx         # Main routes
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
│
├── store/                 # State management (Zustand)
│   ├── authStore.ts      # Auth state
│   └── uiStore.ts        # UI state
│
├── hooks/                 # Custom React hooks
│   └── useAuth.ts        # Auth & permission hooks
│
├── utils/                 # Utility functions
│   └── helpers.ts        # Helper functions
│
├── types/                 # TypeScript types
│   └── index.ts          # All type definitions
│
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sakhalas-master-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Demo Credentials

The application includes demo login functionality with the following test accounts:

| Role | Email | Description |
|------|-------|-------------|
| Super Admin | `super@admin.com` | Full system access, manage companies |
| Company Admin | `admin@company.com` | Full access to company resources |
| Manager | `manager@company.com` | Team management access |
| Employee | `employee@company.com` | Read-only access |

**Password:** Any password with minimum 6 characters

## 🎭 User Roles & Permissions

### Super Admin
- ✅ Manage all companies (CRUD)
- ✅ Switch between companies
- ✅ View all users across companies
- ✅ Full system access

### Company Admin
- ✅ Manage users within company
- ✅ Manage roles & permissions
- ✅ Update company settings
- ✅ View reports

### Manager
- ✅ View team dashboard
- ✅ Limited user management
- ✅ Access to reports
- ❌ No destructive actions

### Employee
- ✅ View personal dashboard
- ✅ Read-only access
- ❌ No management capabilities

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🔌 API Integration

The application is designed to work with REST APIs. Update the following files to connect to your backend:

### Configure API Base URL
```typescript
// .env.local
VITE_API_BASE_URL=https://your-api.com/api
```

### API Services
All API calls are centralized in `src/api/` directory:

- **authService.ts** - Authentication endpoints
- **companyService.ts** - Company management
- **userService.ts** - User management
- **roleService.ts** - Roles & permissions

### Example API Integration

```typescript
// src/api/userService.ts
export const userService = {
  getAll: async (params) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },
  
  // ... more methods
};
```

### Request Interceptor
Automatically adds:
- **Authorization header** with JWT token
- **Company context** (`X-Company-Id` header)
- **Error handling** for 401, 403, 500 errors

## 🎨 Customization

### Theme Colors

Update `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        600: '#0284c7',
        // ... customize your brand colors
      },
    },
  },
}
```

### Component Styling

All components use Tailwind CSS utility classes and can be easily customized by modifying the className props.

### Adding New Permissions

1. **Add to types:**
   ```typescript
   // src/types/index.ts
   export enum PermissionResource {
     USERS = 'USERS',
     COMPANIES = 'COMPANIES',
     YOUR_NEW_RESOURCE = 'YOUR_NEW_RESOURCE', // Add here
   }
   ```

2. **Update route guards:**
   ```typescript
   // src/routes/index.tsx
   <Route
     element={
       <ProtectedRoute
         permission={{
           resource: PermissionResource.YOUR_NEW_RESOURCE,
           action: PermissionAction.READ,
         }}
       />
     }
   >
     <Route path="/your-route" element={<YourComponent />} />
   </Route>
   ```

3. **Use in components:**
   ```typescript
   const { hasPermission } = useAuth();
   
   if (hasPermission('YOUR_NEW_RESOURCE', 'CREATE')) {
     // Show create button
   }
   ```

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

Mobile features:
- Collapsible sidebar with overlay
- Touch-friendly buttons and forms
- Optimized table display

## 🔒 Security Best Practices

### Frontend Security Measures

1. **Token Storage**: Tokens stored in Zustand with localStorage persistence
2. **Auto Logout**: Automatic logout on token expiration
3. **Route Protection**: Role and permission-based route guards
4. **XSS Prevention**: React's built-in XSS protection
5. **Input Validation**: Client-side validation with Zod schemas
6. **HTTPS Only**: Use HTTPS in production
7. **Environment Variables**: Sensitive configs in `.env` files

### Recommendations for Production

- Enable **Content Security Policy** (CSP)
- Implement **rate limiting** on API calls
- Use **HTTPS** for all communications
- Implement **refresh token** rotation
- Add **CSRF protection** if using cookies
- Enable **two-factor authentication** (2FA)

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Deploy to AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 🧪 Testing (Future Enhancement)

Recommended testing stack:
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking

## 📈 Performance Optimization

- **Code splitting** with React.lazy()
- **Tree shaking** via Vite
- **Asset optimization** (images, fonts)
- **Gzip compression** in production
- **CDN delivery** for static assets
- **Lazy loading** for routes and components

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support & Issues

For bugs and feature requests, please [open an issue](https://github.com/your-repo/issues).

## 🙏 Acknowledgments

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Zustand** - State management
- **React Router** - Routing
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation

---

**Built with ❤️ for enterprise SaaS applications**
