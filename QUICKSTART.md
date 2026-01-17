# 🚀 Quick Start Guide

Get your admin dashboard up and running in 5 minutes!

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Login & Explore

Use these demo credentials to explore different user roles:

### Super Admin Access
- **Email**: `super@admin.com`
- **Password**: `password` (min 6 characters)
- **Can access**: All companies, company management, full system control

### Company Admin Access
- **Email**: `admin@company.com`  
- **Password**: `password`
- **Can access**: User management, roles, settings within company

### Manager Access
- **Email**: `manager@company.com`
- **Password**: `password`
- **Can access**: Team dashboard, limited reports

### Employee Access
- **Email**: `employee@company.com`
- **Password**: `password`
- **Can access**: Read-only dashboard

## Key Features to Test

### 1️⃣ Super Admin Features
1. Login as `super@admin.com`
2. Click company switcher in header
3. Select different companies
4. Navigate to **Companies** page
5. Create/Edit/Delete companies

### 2️⃣ User Management
1. Login as `admin@company.com`
2. Navigate to **Users** page
3. Click **Add User** button
4. Fill form and create user
5. Edit or deactivate users

### 3️⃣ Permission-Based UI
1. Notice how sidebar menu changes based on role
2. Try accessing `/companies` as non-super-admin
3. Should redirect to 403 Unauthorized

### 4️⃣ Responsive Design
1. Resize browser window
2. On mobile: Click hamburger menu icon
3. Sidebar becomes overlay
4. Tables become scrollable

## Project Structure Overview

```
src/
├── pages/          → All page components
├── components/     → Reusable UI components
├── layouts/        → Layout wrappers
├── routes/         → Route configuration
├── api/            → API service layer
├── store/          → State management (Zustand)
├── hooks/          → Custom React hooks
├── types/          → TypeScript definitions
└── utils/          → Helper functions
```

## Common Tasks

### Add a New Page
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/routes/index.tsx`
3. Add to sidebar in `src/components/Sidebar.tsx`

### Modify Permissions
1. Update types in `src/types/index.ts`
2. Add permission check in component
3. Update route protection if needed

### Change Styling
1. Modify Tailwind classes in components
2. Update theme colors in `tailwind.config.js`
3. Override base styles in `src/index.css`

### Connect to Real API
1. Update `VITE_API_BASE_URL` in `.env.local`
2. API services are ready in `src/api/` folder
3. Replace mock data with actual API calls

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check types
npm run build

# Most common: Missing types for icons
# Already included in package.json
```

## Next Steps

### Production Deployment
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Connect to Backend
1. Read [API_INTEGRATION.md](API_INTEGRATION.md)
2. Update `.env.local` with your API URL
3. Update API service calls to match your backend

### Customize
1. Change brand colors in `tailwind.config.js`
2. Update logo in header/sidebar
3. Modify landing dashboard cards
4. Add your own features

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
```

## Resources

- 📚 [Full Documentation](README.md)
- 🛠️ [Development Guide](DEVELOPMENT.md)
- 🔌 [API Integration](API_INTEGRATION.md)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com)
- ⚛️ [React Docs](https://react.dev)
- 📘 [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Need Help?

- Check existing issues on GitHub
- Read the development guide
- Review API integration documentation
- Inspect component examples in `src/pages/`

---

**Happy coding! 🎉**
