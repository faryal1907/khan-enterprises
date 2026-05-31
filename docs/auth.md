# Authentication System

## Overview

The Khan Enterprises authentication system provides secure JWT-based authentication for both the Admin and Web applications. It includes role-based access control, protected routes, and cookie-based token storage.

## Architecture

### Frontend (Next.js)

Both the Admin (port 3001) and Web (port 3000) applications share the same authentication infrastructure:

- **Login Page**: React Hook Form + Zod validation
- **Auth Store**: Zustand for state management
- **API Client**: Axios with automatic JWT token injection
- **Middleware**: Protected route enforcement
- **Navigation**: Role-based rendering

### Backend (NestJS)

- **JWT Authentication**: Passport.js with JWT strategy
- **Role-Based Access Control**: Guards for ADMIN, MANAGER, and SALES_STAFF roles
- **Token Management**: Access tokens (15min) and refresh tokens (7 days)

## Components

### 1. Login Page

**Location**: `apps/admin/app/login/page.tsx` and `apps/web/app/login/page.tsx`

Features:
- React Hook Form for form management
- Zod schema validation (email + min 8 character password)
- Automatic redirect to dashboard on successful login
- Error handling for failed login attempts

**Validation Schema** (`lib/validation/login.ts`):
```typescript
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
```

### 2. Auth Store (Zustand)

**Location**: `apps/admin/lib/auth-store.ts` and `apps/web/lib/auth-store.ts`

Features:
- User state management
- Access token storage in cookies (7-day expiry)
- Logout functionality with token cleanup
- Secure cookie configuration (HTTPS in production)

```typescript
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => {
    Cookies.set("accessToken", accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    set({ user, accessToken });
  },
  logout: () => {
    Cookies.remove("accessToken");
    set({ user: null, accessToken: null });
  },
}));
```

### 3. API Client

**Location**: `apps/admin/lib/api-client.ts` and `apps/web/lib/api-client.ts`

Features:
- Axios instance with base URL configuration
- Automatic JWT token injection from cookies
- Centralized API configuration

```typescript
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? Cookies.get("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4. Protected Route Middleware

**Location**: `apps/admin/middleware.ts` and `apps/web/middleware.ts`

Features:
- Redirects unauthenticated users to `/login`
- Preserves redirect URL for post-login navigation
- Allows public paths (login page)
- Automatically redirects logged-in users away from login page

```typescript
const publicPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken");

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
```

### 5. Role-Based Navigation

**Location**: `apps/admin/components/navigation.tsx` and `apps/web/components/navigation.tsx`

**Admin Navigation**:
- ADMIN: Dashboard, Users, Branches, Inventory, Orders
- BRANCH_MANAGER: Dashboard, Branches, Inventory, Orders
- SALES_STAFF: Dashboard, Inventory, Orders

**Web Navigation**:
- ADMIN/MANAGER: Home, Bikes, Parts, Orders
- SALES_STAFF: Home, Bikes, Parts

## User Roles

### ADMIN
- Global access to all features
- Can manage users across all branches
- Full system administration

### BRANCH_MANAGER
- Branch-specific access
- Can manage branch inventory and orders
- Cannot manage users

### SALES_STAFF
- Limited to branch operations
- Can view and manage inventory
- Can create and manage orders

## Test Credentials

From Sprint 2 documentation:

| Email | Password | Role | Branch |
|-------|----------|------|--------|
| `admin@khan.com` | `admin123` | ADMIN | — (global) |
| `isb.manager@khan.com` | `manager123` | MANAGER | Islamabad HQ |
| `tordher.manager@khan.com` | `manager123` | MANAGER | Tordher Branch |
| `tordher.staff@khan.com` | `sales123` | SALES_STAFF | Tordher Branch |

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and receive tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate refresh token
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/users` - List all users (ADMIN only)
- `GET /api/auth/check?email=` - Check if user exists (ADMIN only)

### Protected Routes

- `GET /api/inventory/bikes` - Get bike inventory (protected)
- `GET /api/inventory/parts` - Get parts inventory (protected)
- `GET /api/branches` - Get branches (protected)
- `GET /api/branches/:id` - Get single branch (protected)

## Testing

### Manual Testing

1. **Start all services**:
   ```bash
   npm run dev
   ```

2. **Access applications**:
   - Admin: http://localhost:3001
   - Web: http://localhost:3000
   - API: http://localhost:4000

3. **Test authentication flow**:
   - Try to access a protected route (should redirect to login)
   - Login with test credentials
   - Verify role-based navigation shows correct links
   - Test logout functionality

### Automated Testing

Use the test credentials to verify:
- Different roles see different navigation options
- Protected routes redirect unauthenticated users
- Login redirects to original requested URL
- Logout clears cookies and redirects to login

## Security Features

- **JWT Tokens**: Short-lived access tokens (15min)
- **Refresh Tokens**: Long-lived refresh tokens (7 days)
- **Secure Cookies**: HttpOnly, Secure, SameSite configuration
- **Password Validation**: Minimum 8 characters required
- **Role-Based Access**: Server-side guards enforce role permissions
- **Protected Routes**: Middleware enforces authentication on all routes except login

## Configuration

### Environment Variables

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend (.env)**:
```
JWT_SECRET=your-secret-key
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
```

## Dependencies

### Frontend
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration
- `zustand` - State management
- `js-cookie` - Cookie management
- `axios` - HTTP client

### Backend
- `@nestjs/passport` - Passport.js integration
- `passport-jwt` - JWT strategy
- `@nestjs/jwt` - JWT module
- `bcrypt` - Password hashing

## Troubleshooting

### Login Not Working
- Verify API is running on port 4000
- Check browser console for errors
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check network tab for failed API requests

### Protected Routes Not Redirecting
- Clear browser cookies
- Check middleware.ts is in the correct location
- Verify cookie name matches ("accessToken")
- Check browser console for middleware errors

### Role-Based Navigation Not Working
- Verify user role is returned from API
- Check navigation component logic
- Verify UserRole enum matches backend values
- Check browser console for TypeScript errors

## Future Enhancements

- [ ] Add remember me functionality
- [ ] Implement password reset flow
- [ ] Add two-factor authentication
- [ ] Implement session timeout warning
- [ ] Add audit logging for authentication events
- [ ] Implement OAuth2/Social login options
