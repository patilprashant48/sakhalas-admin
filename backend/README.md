# Admin Dashboard Backend

Backend API for the Multi-Tenant Admin Dashboard built with Node.js, Express, TypeScript, and Prisma.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (dev) - can switch to PostgreSQL/MySQL for production
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Validation

## Features

- ✅ JWT Authentication
- ✅ Role-based Authorization (SUPER_ADMIN, COMPANY_ADMIN, MANAGER, EMPLOYEE)
- ✅ Multi-tenant Support
- ✅ RESTful API
- ✅ Database Migrations
- ✅ Activity Logging
- ✅ Input Validation
- ✅ Error Handling

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Companies (Super Admin only)
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `PATCH /api/companies/:id/toggle-active` - Toggle active status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-active` - Toggle active status

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run seed
```

### 3. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Server will run on `http://localhost:8000`

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=8000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

## Default Login Credentials (After Seeding)

**Super Admin:**
- Email: `super@admin.com`
- Password: `password123`

**Company Admin:**
- Email: `admin@acme.com`
- Password: `password123`

**Manager:**
- Email: `manager@acme.com`
- Password: `password123`

**Employee:**
- Email: `employee@acme.com`
- Password: `password123`

## Database Schema

### Company
- id, name, domain, isActive, logo, settings
- One-to-Many relationship with Users

### User
- id, email, password, firstName, lastName, role, companyId, isActive
- Belongs to Company
- Has many Activities

### Role
- id, name, description, companyId, isSystem, permissions

### Activity
- id, action, userId, timestamp

## Development

### Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Access at `http://localhost:5555`

### Reset Database

```bash
npx prisma migrate reset
npm run seed
```

## Production Deployment

1. Switch to PostgreSQL/MySQL in `schema.prisma`
2. Update `DATABASE_URL` in `.env`
3. Run migrations: `npm run prisma:migrate`
4. Build: `npm run build`
5. Start: `npm start`

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Enable CORS only for trusted origins in production
- Use HTTPS in production
- Implement rate limiting for production
- Add request logging

## Email Notifications

When a new user is created, they will receive an email with their login credentials (email and password) using the SMTP settings in your `.env` file. To enable this:

1. Copy `.env.example` to `.env` in the backend folder.
2. Fill in your SMTP provider details:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
SMTP_FROM=Admin <your@email.com>
```

3. The backend will send an email to each new user with their credentials after creation.
