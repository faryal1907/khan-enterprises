# Customer Sign-Up Feature Implementation Plan

## Overview
This document outlines the implementation plan for adding a customer sign-up feature to the Khan Enterprises customer-facing web application (apps/web). The feature will allow customers to create their own accounts without requiring admin intervention.

## Current State Analysis

### Existing Authentication Infrastructure
- **JWT-based authentication** with access tokens (15min) and refresh tokens (7 days)
- **Role-based access control** with roles: ADMIN, MANAGER, SALES_STAFF, CUSTOMER
- **Cookie-based token storage** with secure configuration
- **Login functionality** exists for staff users
- **Database schema** already supports CUSTOMER role

### Gaps Identified
- No public registration endpoint (current `createUser` is ADMIN only)
- No sign-up page in web application
- No customer-specific user creation logic
- No email verification system
- No phone number validation for customers

## Implementation Plan

### Phase 1: Backend API Changes

#### 1.1 Create Registration DTO
**File:** `apps/api/src/modules/auth/dto/register.dto.ts`

```typescript
import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, "Password must be at least 8 characters")
  password: string;

  @IsString()
  @MinLength(2, "Full name must be at least 2 characters")
  fullName: string;

  @IsString()
  @Matches(/^03[0-9]{9}$/, "Phone number must be a valid Pakistani number (03XXXXXXXXX)")
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address?: string;
}
```

#### 1.2 Add Registration Method to AuthService
**File:** `apps/api/src/modules/auth/auth.service.ts`

Add new method `registerCustomer()`:
- Validate email uniqueness
- Hash password with bcrypt
- Create user with CUSTOMER role
- Set status to ACTIVE (or PENDING if email verification is implemented)
- Issue tokens immediately for seamless login
- Return user profile and tokens

```typescript
async registerCustomer(dto: RegisterDto) {
  // 1. Check if user already exists
  const existingUser = await this.prisma.client.user.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new ForbiddenException("User with this email already exists.");
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(dto.password, 10);

  // 3. Create customer user
  const user = await this.prisma.client.user.create({
    data: {
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      role: "CUSTOMER",
      status: "ACTIVE",
      branchId: null,
      vendorId: null,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      status: true,
      branchId: true,
      vendorId: true,
      createdAt: true,
    },
  });

  // 4. Issue tokens
  const tokens = await this.issueTokens(user.id, user.email, user.role, null, null);

  return { ...tokens, user };
}
```

#### 1.3 Add Registration Endpoint to AuthController
**File:** `apps/api/src/modules/auth/auth.controller.ts`

Add public endpoint:
```typescript
/**
 * POST /api/auth/register
 * Public endpoint for customer registration
 */
@Post("register")
@Throttle({ default: { limit: 3, ttl: 60000 } }) // Rate limiting
@HttpCode(HttpStatus.CREATED)
async register(@Body() dto: RegisterDto) {
  return this.authService.registerCustomer(dto);
}
```

#### 1.4 Update Auth Module
Ensure RegisterDto is exported and available.

### Phase 2: Frontend Web Application Changes

#### 2.1 Create Registration Validation Schema
**File:** `apps/web/lib/validation/register.ts`

```typescript
import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string()
    .regex(/^03[0-9]{9}$/, "Phone number must be a valid Pakistani number (03XXXXXXXXX)"),
  address: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
```

#### 2.2 Create Sign-Up Page
**File:** `apps/web/app/signup/page.tsx`

Create a new sign-up page following the same design pattern as the login page:
- Use React Hook Form + Zod validation
- Include fields: email, password, fullName, phoneNumber, address (optional)
- Match the existing design system from login page
- Add link to login page for existing users
- Show success message and redirect to home on successful registration
- Auto-login after registration (using returned tokens)

#### 2.3 Update Login Page
**File:** `apps/web/app/login/page.tsx`

Add link to sign-up page:
```tsx
<div className="mt-6 text-center">
  <p className="text-sm" style={{ color: theme.text.muted }}>
    Don't have an account?{" "}
    <a href="/signup" className="font-semibold hover:underline" style={{ color: theme.accents.primary }}>
      Sign up
    </a>
  </p>
</div>
```

#### 2.4 Update Middleware
**File:** `apps/web/middleware.ts`

Add `/signup` to public paths:
```typescript
const publicPaths = ["/login", "/signup"];
```

#### 2.5 Update Types
**File:** `apps/web/lib/types.ts`

Add RegisterResponse type if needed:
```typescript
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

### Phase 3: Security Considerations

#### 3.1 Rate Limiting
- Registration endpoint already has rate limiting (3 requests per minute)
- Consider IP-based rate limiting for abuse prevention

#### 3.2 Password Security
- Minimum 8 characters
- Require uppercase, lowercase, and number
- Bcrypt hashing with salt rounds = 10 (already implemented)

#### 3.3 Input Validation
- Email format validation
- Pakistani phone number format validation (03XXXXXXXXX)
- Full name length validation

#### 3.4 Data Privacy
- Phone number stored in database
- Consider adding consent checkbox for data processing
- GDPR compliance considerations if needed

### Phase 4: Optional Enhancements (Future Scope)

#### 4.1 Email Verification
- Send verification email after registration
- Set user status to PENDING until verified
- Add verification endpoint
- Resend verification email functionality

#### 4.2 Phone Verification
- SMS verification using JazzCash or similar
- OTP-based verification flow

#### 4.3 Social Login
- Google OAuth integration
- Facebook OAuth integration

#### 4.4 Profile Completion
- Redirect to profile setup after registration
- Collect additional information (address, preferences)

#### 4.5 Welcome Email
- Send welcome email after successful registration
- Include onboarding information

### Phase 5: Testing Strategy

#### 5.1 Unit Tests
- Test registration DTO validation
- Test AuthService.registerCustomer() method
- Test password hashing
- Test email uniqueness check

#### 5.2 Integration Tests
- Test registration endpoint
- Test token generation after registration
- Test auto-login flow
- Test duplicate email handling

#### 5.3 E2E Tests
- Test complete registration flow from UI
- Test form validation
- Test error handling
- Test redirect after registration

#### 5.4 Manual Testing Checklist
- [ ] Register with valid data
- [ ] Register with duplicate email (should fail)
- [ ] Register with invalid email format
- [ ] Register with weak password
- [ ] Register with invalid phone number
- [ ] Auto-login after registration
- [ ] Access protected routes after registration
- [ ] Logout and login again

### Phase 6: Deployment Considerations

#### 6.1 Database Migration
- No schema changes required (CUSTOMER role already exists)
- Verify database indexes for email uniqueness

#### 6.2 Environment Variables
- No new environment variables required
- Existing JWT configuration will be used

#### 6.3 API Documentation
- Update API contract documentation
- Add registration endpoint to Postman collection
- Update auth.md documentation

#### 6.4 Monitoring
- Add logging for registration events
- Monitor registration rate for abuse detection
- Track conversion rate (signup to first order)

## Implementation Timeline

### Sprint 1 (Week 1)
- [ ] Create RegisterDto
- [ ] Implement registerCustomer method in AuthService
- [ ] Add registration endpoint to AuthController
- [ ] Test backend registration flow

### Sprint 2 (Week 2)
- [ ] Create registration validation schema
- [ ] Build sign-up page UI
- [ ] Update login page with sign-up link
- [ ] Update middleware for public signup route
- [ ] Test frontend registration flow

### Sprint 3 (Week 3)
- [ ] Implement security enhancements
- [ ] Add error handling and validation
- [ ] Write unit and integration tests
- [ ] Perform end-to-end testing

### Sprint 4 (Week 4)
- [ ] Update documentation
- [ ] Deploy to staging environment
- [ ] User acceptance testing
- [ ] Deploy to production

## Success Criteria

- [ ] Customers can successfully register via web interface
- [ ] Registration creates user with CUSTOMER role in database
- [ ] Users are automatically logged in after registration
- [ ] Form validation prevents invalid data submission
- [ ] Duplicate email registration is prevented
- [ ] Rate limiting prevents abuse
- [ ] Existing authentication flow remains unaffected
- [ ] Documentation is updated
- [ ] Tests pass with >80% coverage

## Risks and Mitigations

### Risk 1: Spam Registrations
- **Mitigation:** Rate limiting, CAPTCHA (future enhancement), email verification

### Risk 2: Weak Passwords
- **Mitigation:** Strong password requirements, bcrypt hashing

### Risk 3: Data Privacy Concerns
- **Mitigation:** Clear privacy policy, consent checkboxes, secure data storage

### Risk 4: Breaking Existing Auth Flow
- **Mitigation:** Comprehensive testing, backward compatibility, feature flags

## Dependencies

- Existing authentication infrastructure
- Database schema (no changes required)
- JWT configuration (already in place)
- Frontend design system (already established)

## Related Documentation

- [Authentication System](./auth.md)
- [API Routes](./api_routes.md)
- [Admin UX Flow](./admin-ux-flow.md)

## Notes

- This implementation assumes immediate account activation (no email verification)
- For production deployment, consider implementing email verification for security
- Phone number validation is specific to Pakistani format (03XXXXXXXXX)
- The sign-up feature is public and does not require authentication
