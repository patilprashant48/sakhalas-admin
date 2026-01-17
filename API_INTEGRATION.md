# API Integration Guide

This document describes the expected API endpoints and request/response formats.

## Base Configuration

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

All requests include:
- **Authorization**: `Bearer {access_token}`
- **X-Company-Id**: `{selected_company_id}` (when applicable)

## Authentication Endpoints

### POST /auth/login
Login user and receive tokens

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "COMPANY_ADMIN",
      "companyId": "1",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "permissions": [
        {
          "id": "1",
          "resource": "USERS",
          "action": "READ"
        }
      ]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

### POST /auth/logout
Logout current user

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/me
Get current user profile

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "COMPANY_ADMIN",
    "companyId": "1",
    "isActive": true,
    "permissions": [...]
  }
}
```

### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

## Company Endpoints

### GET /companies
Get all companies (Super Admin only)

**Query Parameters:**
- `page` (number, default: 1)
- `pageSize` (number, default: 10)
- `search` (string, optional)
- `isActive` (boolean, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "name": "Acme Corp",
        "domain": "acme.com",
        "isActive": true,
        "logo": "https://example.com/logo.png",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "userCount": 25
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### GET /companies/:id
Get single company

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Acme Corp",
    "domain": "acme.com",
    "isActive": true,
    "logo": "https://example.com/logo.png",
    "settings": {},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /companies
Create new company

**Request:**
```json
{
  "name": "New Company",
  "domain": "newcompany.com",
  "isActive": true,
  "logo": "https://example.com/logo.png"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "New Company",
    "domain": "newcompany.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /companies/:id
Update company

**Request:**
```json
{
  "name": "Updated Company Name",
  "isActive": false
}
```

**Response:** Same as create

### DELETE /companies/:id
Delete company

**Response:**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

### PATCH /companies/:id/toggle-active
Toggle company active status

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "isActive": false
  }
}
```

## User Endpoints

### GET /users
Get all users

**Query Parameters:**
- `page` (number)
- `pageSize` (number)
- `search` (string)
- `role` (UserRole enum)
- `isActive` (boolean)
- `companyId` (string) - Auto-set from X-Company-Id header

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "COMPANY_ADMIN",
        "companyId": "1",
        "company": {
          "id": "1",
          "name": "Acme Corp"
        },
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### POST /users
Create new user

**Request:**
```json
{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "EMPLOYEE",
  "password": "securepassword",
  "isActive": true
}
```

### PUT /users/:id
Update user

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Updated",
  "role": "MANAGER"
}
```

### DELETE /users/:id
Delete user

### PATCH /users/:id/toggle-active
Toggle user active status

## Role Endpoints

### GET /roles
Get all roles

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "name": "Company Admin",
        "description": "Full company access",
        "companyId": "1",
        "isSystem": true,
        "permissions": [
          {
            "id": "1",
            "resource": "USERS",
            "action": "MANAGE"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### POST /roles
Create custom role

**Request:**
```json
{
  "name": "Custom Manager",
  "description": "Custom role with specific permissions",
  "permissionIds": ["1", "2", "3"]
}
```

### PUT /roles/:id
Update role

### DELETE /roles/:id
Delete role (custom roles only)

## Permission Endpoints

### GET /permissions
Get all available permissions

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "resource": "USERS",
      "action": "READ",
      "description": "View users"
    },
    {
      "id": "2",
      "resource": "USERS",
      "action": "CREATE",
      "description": "Create new users"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["Email is required", "Invalid email format"],
    "password": ["Password must be at least 6 characters"]
  },
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

## Enums

### UserRole
```typescript
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}
```

### PermissionResource
```typescript
enum PermissionResource {
  COMPANIES = 'COMPANIES',
  USERS = 'USERS',
  ROLES = 'ROLES',
  PERMISSIONS = 'PERMISSIONS',
  SETTINGS = 'SETTINGS',
  REPORTS = 'REPORTS',
  TEAM = 'TEAM',
}
```

### PermissionAction
```typescript
enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE', // Full CRUD access
}
```

## Testing the API

Use tools like:
- **Postman** - API testing and documentation
- **Insomnia** - REST client
- **cURL** - Command line testing

Example cURL request:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```
