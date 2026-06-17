# Customer Side Interface - Remaining Tasks & Implementation Guide

## Overview
This document outlines all remaining tasks for the customer-facing web application (`apps/web`) with step-by-step implementation instructions. The guide follows the project's existing patterns and best practices.

**Current Status:**
- ✅ Basic authentication (login/signup) with JWT
- ✅ Bike catalog with filtering
- ✅ Offer tracking page
- ✅ Orders tracking page
- ✅ Basic navigation and layout
- ✅ Supabase database migration completed

**Tech Stack Context:**
- Frontend: Next.js 14+ (App Router), React Hook Form, Zod, Zustand, Tailwind CSS
- Backend: NestJS with JWT authentication
- Database: Supabase (PostgreSQL)
- Authentication: JWT with refresh tokens (OAuth to be added)

---

## 1. OAuth Integration (Google & Facebook)

### Priority: HIGH
### Estimated Time: 8-12 hours

### 1.1 Backend Setup - OAuth Providers

**Step 1: Install Required Dependencies**
```bash
cd apps/api
npm install @nestjs/passport passport passport-google-oauth20 passport-facebook @nestjs/config
npm install --save-dev @types/passport-google-oauth20 @types/passport-facebook
```

**Step 2: Create OAuth Strategy Files**

**File:** `apps/api/src/modules/auth/strategies/google.strategy.ts`
```typescript
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { email, name, picture } = profile;
    
    if (!email) {
      throw new UnauthorizedException('No email from Google OAuth');
    }

    return {
      email,
      fullName: name,
      profilePicture: picture,
      provider: 'google',
      providerId: profile.id,
    };
  }
}
```

**File:** `apps/api/src/modules/auth/strategies/facebook.strategy.ts`
```typescript
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
      scope: ['email'],
      profileFields: ['email', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { email, name } = profile;
    
    if (!email) {
      throw new UnauthorizedException('No email from Facebook OAuth');
    }

    return {
      email,
      fullName: name,
      provider: 'facebook',
      providerId: profile.id,
    };
  }
}
```

**Step 3: Add OAuth Guards**

**File:** `apps/api/src/modules/auth/guards/google-oauth.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {}
```

**File:** `apps/api/src/modules/auth/guards/facebook-oauth.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookOAuthGuard extends AuthGuard('facebook') {}
```

**Step 4: Add OAuth Endpoints to Auth Controller**

**File:** `apps/api/src/modules/auth/auth.controller.ts`
```typescript
@Get('google')
@UseGuards(GoogleOAuthGuard)
async googleAuth() {
  // Initiates Google OAuth flow
}

@Get('google/callback')
@UseGuards(GoogleOAuthGuard)
async googleAuthCallback(@Req() req, @Res() res) {
  const { email, fullName, profilePicture, provider, providerId } = req.user;
  
  // Check if user exists
  let user = await this.authService.findUserByEmail(email);
  
  if (!user) {
    // Create new user from OAuth
    user = await this.authService.createOAuthUser({
      email,
      fullName,
      profilePicture,
      provider,
      providerId,
    });
  }
  
  // Issue tokens
  const tokens = await this.authService.issueTokens(
    user.id,
    user.email,
    user.role,
    user.branchId,
    user.vendorId,
  );
  
  // Redirect to frontend with tokens
  const frontendUrl = this.configService.get('FRONTEND_URL');
  res.redirect(`${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
}

@Get('facebook')
@UseGuards(FacebookOAuthGuard)
async facebookAuth() {
  // Initiates Facebook OAuth flow
}

@Get('facebook/callback')
@UseGuards(FacebookOAuthGuard)
async facebookAuthCallback(@Req() req, @Res() res) {
  // Similar to Google callback
}
```

**Step 5: Add OAuth User Creation Method to Auth Service**

**File:** `apps/api/src/modules/auth/auth.service.ts`
```typescript
async createOAuthUser(dto: {
  email: string;
  fullName: string;
  profilePicture?: string;
  provider: 'google' | 'facebook';
  providerId: string;
}) {
  // Generate random password for OAuth users
  const randomPassword = crypto.randomBytes(32).toString('hex');
  const passwordHash = await bcrypt.hash(randomPassword, 10);
  
  const user = await this.prisma.client.user.create({
    data: {
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      branchId: null,
      vendorId: null,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      branchId: true,
      vendorId: true,
      createdAt: true,
    },
  });
  
  return user;
}
```

**Step 6: Update Environment Variables**

**File:** `apps/api/.env`
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:4000/auth/facebook/callback

FRONTEND_URL=http://localhost:3000
```

### 1.2 Frontend OAuth Integration

**Step 1: Create OAuth Callback Handler**

**File:** `apps/web/app/auth/callback/page.tsx`
```typescript
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      // Fetch user profile with the access token
      api.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(response => {
        setAuth(response.data.user, accessToken, refreshToken);
        router.push("/");
      }).catch(() => {
        router.push("/login?error=oauth_failed");
      });
    } else {
      router.push("/login?error=no_tokens");
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Processing authentication...</div>
    </div>
  );
}
```

**Step 2: Add OAuth Buttons to Login Page**

**File:** `apps/web/app/login/page.tsx` (add after the form)
```typescript
{/* OAuth Divider */}
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t" style={{ borderColor: theme.borders.light }} />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2" style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.muted }}>
      Or continue with
    </span>
  </div>
</div>

{/* OAuth Buttons */}
<div className="space-y-3">
  <button
    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border hover:opacity-90 transition-opacity"
    style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.medium }}
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <span style={{ color: theme.text.primary }}>Continue with Google</span>
  </button>

  <button
    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border hover:opacity-90 transition-opacity"
    style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.medium }}
  >
    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    <span style={{ color: theme.text.primary }}>Continue with Facebook</span>
  </button>
</div>
```

**Step 3: Add OAuth Buttons to Signup Page**
- Add the same OAuth button section to the signup page

**Step 4: Update Environment Variables**

**File:** `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 2. Email Verification System

### Priority: MEDIUM
### Estimated Time: 6-8 hours

### 2.1 Backend Implementation

**Step 1: Install Email Service**
```bash
cd apps/api
npm install @nestjs-modules/mailer nodemailer
npm install --save-dev @types/nodemailer
```

**Step 2: Configure Mailer Module**

**File:** `apps/api/src/modules/mailer/mailer.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"Khan Enterprises" <${config.get('SMTP_FROM')}>`,
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailerModule {}
```

**Step 3: Create Email Templates**

**File:** `apps/api/templates/verification.hbs`
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Verify Your Email Address</h2>
  <p>Hi {{fullName}},</p>
  <p>Thank you for registering with Khan Enterprises. Please verify your email address by clicking the button below:</p>
  <a href="{{verificationUrl}}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
  <p>Or copy and paste this link into your browser:</p>
  <p style="word-break: break-all;">{{verificationUrl}}</p>
  <p>This link will expire in 24 hours.</p>
  <p>If you didn't create an account, please ignore this email.</p>
</div>
```

**Step 4: Update User Schema for Verification**

**File:** `packages/prisma/schema.prisma`
```prisma
model User {
  // ... existing fields
  emailVerified      Boolean   @default(false)
  emailVerifiedAt    DateTime?
  verificationToken  String?   @unique
}
```

**Step 5: Run Migration**
```bash
cd packages/prisma
npm run prisma:migrate:dev --name add_email_verification
```

**Step 6: Add Verification Methods to Auth Service**

**File:** `apps/api/src/modules/auth/auth.service.ts`
```typescript
async sendVerificationEmail(userId: string, email: string, fullName: string) {
  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Store token in database
  await this.prisma.client.user.update({
    where: { id: userId },
    data: { verificationToken },
  });
  
  // Create verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  // Send email
  await this.mailerService.sendMail({
    to: email,
    subject: 'Verify Your Email - Khan Enterprises',
    template: 'verification',
    context: {
      fullName,
      verificationUrl,
    },
  });
}

async verifyEmail(token: string) {
  const user = await this.prisma.client.user.findUnique({
    where: { verificationToken: token },
  });
  
  if (!user) {
    throw new UnauthorizedException('Invalid verification token');
  }
  
  await this.prisma.client.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      verificationToken: null,
    },
  });
  
  return { message: 'Email verified successfully' };
}
```

**Step 7: Add Verification Endpoints**

**File:** `apps/api/src/modules/auth/auth.controller.ts`
```typescript
@Post('send-verification')
@UseGuards(JwtAuthGuard)
async sendVerification(@CurrentUser() user: Express.User) {
  return this.authService.sendVerificationEmail(user.id, user.email, user.fullName);
}

@Get('verify-email')
async verifyEmail(@Query('token') token: string) {
  return this.authService.verifyEmail(token);
}
```

### 2.2 Frontend Implementation

**Step 1: Create Verification Page**

**File:** `apps/web/app/verify-email/page.tsx`
```typescript
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      })
      .catch(() => {
        setStatus('error');
        setMessage('Invalid or expired verification token');
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="rounded-xl p-12 text-center max-w-md" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.accents.primary }} />
            <p style={{ color: theme.text.secondary }}>Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
              <svg className="w-8 h-8" fill="#065F46" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: theme.text.primary }}>Success!</h2>
            <p style={{ color: theme.text.secondary }}>{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
              <svg className="w-8 h-8" fill="#991B1B" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: theme.text.primary }}>Verification Failed</h2>
            <p className="mb-4" style={{ color: theme.text.secondary }}>{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Add Resend Verification Option to Login**
- Add a "Resend verification email" link on the login page for users with unverified accounts

---

## 3. Password Reset Flow

### Priority: HIGH
### Estimated Time: 4-6 hours

### 3.1 Backend Implementation

**Step 1: Update User Schema for Reset Tokens**

**File:** `packages/prisma/schema.prisma`
```prisma
model User {
  // ... existing fields
  resetToken         String?   @unique
  resetTokenExpires  DateTime?
}
```

**Step 2: Run Migration**
```bash
cd packages/prisma
npm run prisma:migrate:dev --name add_password_reset
```

**Step 3: Add Reset Password Methods to Auth Service**

**File:** `apps/api/src/modules/auth/auth.service.ts`
```typescript
async requestPasswordReset(email: string) {
  const user = await this.prisma.client.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    // Don't reveal if user exists
    return { message: 'If an account exists, a reset link has been sent' };
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
  
  await this.prisma.client.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpires,
    },
  });
  
  // Send reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  await this.mailerService.sendMail({
    to: email,
    subject: 'Reset Your Password - Khan Enterprises',
    template: 'password-reset',
    context: {
      fullName: user.fullName,
      resetUrl,
    },
  });
  
  return { message: 'If an account exists, a reset link has been sent' };
}

async resetPassword(token: string, newPassword: string) {
  const user = await this.prisma.client.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gte: new Date() },
    },
  });
  
  if (!user) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }
  
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  await this.prisma.client.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });
  
  return { message: 'Password reset successfully' };
}
```

**Step 4: Add Reset Password Endpoints**

**File:** `apps/api/src/modules/auth/auth.controller.ts`
```typescript
@Post('request-password-reset')
async requestPasswordReset(@Body() dto: { email: string }) {
  return this.authService.requestPasswordReset(dto.email);
}

@Post('reset-password')
async resetPassword(@Body() dto: { token: string; newPassword: string }) {
  return this.authService.resetPassword(dto.token, dto.newPassword);
}
```

### 3.2 Frontend Implementation

**Step 1: Create Forgot Password Page**

**File:** `apps/web/app/forgot-password/page.tsx`
```typescript
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setStatus('loading');
    try {
      await api.post('/auth/request-password-reset', data);
      setStatus('success');
      setMessage('If an account exists, a reset link has been sent to your email');
    } catch (err) {
      setStatus('error');
      setMessage('Failed to send reset link. Please try again');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="w-full max-w-md rounded-xl p-8" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text.primary }}>Reset Password</h1>
        <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>Enter your email to receive a reset link</p>
        
        {status === 'idle' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {errors.email && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.email.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
              <svg className="w-8 h-8" fill="#065F46" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p style={{ color: theme.text.secondary }}>{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <p className="mb-4" style={{ color: theme.accents.secondary }}>{message}</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-3 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create Reset Password Page**

**File:** `apps/web/app/reset-password/page.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { z } from "zod";

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid reset token');
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    
    setStatus('loading');
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      });
      setStatus('success');
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setStatus('error');
      setMessage('Invalid or expired reset token');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="w-full max-w-md rounded-xl p-8" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text.primary }}>Set New Password</h1>
        <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>Enter your new password below</p>
        
        {status === 'idle' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>New Password</label>
              <input
                {...register('newPassword')}
                type="password"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {errors.newPassword && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.newPassword.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.confirmPassword.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
              <svg className="w-8 h-8" fill="#065F46" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p style={{ color: theme.text.secondary }}>{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <p className="mb-4" style={{ color: theme.accents.secondary }}>{message}</p>
            <button
              onClick={() => router.push('/forgot-password')}
              className="px-6 py-3 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              Request New Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Add "Forgot Password" Link to Login Page**
- Add link below the password field on the login page

---

## 4. Customer Profile Management

### Priority: HIGH
### Estimated Time: 6-8 hours

### 4.1 Backend Implementation

**Step 1: Add Profile Update Endpoint**

**File:** `apps/api/src/modules/auth/auth.controller.ts`
```typescript
@Put('profile')
@UseGuards(JwtAuthGuard)
async updateProfile(@CurrentUser() user: Express.User, @Body() dto: {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}) {
  return this.authService.updateProfile(user.id, dto);
}
```

**Step 2: Add Profile Update Method to Auth Service**

**File:** `apps/api/src/modules/auth/auth.service.ts`
```typescript
async updateProfile(userId: string, dto: {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}) {
  const user = await this.prisma.client.user.update({
    where: { id: userId },
    data: dto,
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
      updatedAt: true,
    },
  });
  
  return user;
}
```

### 4.2 Frontend Implementation

**Step 1: Create Profile Page**

**File:** `apps/web/app/profile/page.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^03[0-9]{9}$/, "Phone number must be a valid Pakistani number"),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: (user as any).address || '',
      });
      setLoading(false);
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.put('/auth/profile', data);
      // Update local user state
      useAuthStore.getState().setAuth(response.data, useAuthStore.getState().accessToken!, useAuthStore.getState().refreshToken!);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>My Profile</h1>
        <p className="text-sm mb-8" style={{ color: theme.text.secondary }}>Manage your account information</p>

        {message && (
          <div
            className={`rounded-xl p-4 mb-6 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{message.text}</p>
          </div>
        )}

        <div className="rounded-xl p-8" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-3 py-2 rounded-lg text-sm opacity-50"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>Email cannot be changed</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Full Name</label>
              <input
                {...register('fullName')}
                type="text"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {errors.fullName && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.fullName.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Phone Number</label>
              <input
                {...register('phoneNumber')}
                type="tel"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {errors.phoneNumber && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.phoneNumber.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Address</label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {errors.address && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add Profile Link to Navigation**
- Add profile link to the navigation component

---

## 5. Customer Dashboard

### Priority: MEDIUM
### Estimated Time: 8-10 hours

### 5.1 Create Dashboard Page

**File:** `apps/web/app/dashboard/page.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    activeOffers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [offersRes, ordersRes] = await Promise.all([
        api.get('/offers/customer').catch(() => ({ data: { offers: [] } })),
        api.get('/orders/customer').catch(() => ({ data: { orders: [] } })),
      ]);

      const activeOffers = offersRes.data.offers?.filter((o: any) => 
        ['PENDING', 'COUNTERED'].includes(o.status)
      ).length || 0;

      const pendingOrders = ordersRes.data.orders?.filter((o: any) => 
        ['PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(o.status)
      ).length || 0;

      const completedOrders = ordersRes.data.orders?.filter((o: any) => 
        o.status === 'DELIVERED'
      ).length || 0;

      setStats({
        activeOffers,
        pendingOrders,
        completedOrders,
      });

      // Combine recent activity
      const activities = [
        ...offersRes.data.offers?.map((o: any) => ({
          type: 'offer',
          id: o.id,
          status: o.status,
          date: o.createdAt,
          bike: o.bike,
        })) || [],
        ...ordersRes.data.orders?.map((o: any) => ({
          type: 'order',
          id: o.id,
          status: o.status,
          date: o.createdAt,
          bike: o.bike,
        })) || [],
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
       .slice(0, 5);

      setRecentActivity(activities);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p style={{ color: theme.text.secondary }}>Here's what's happening with your account</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'Active Negotiations',
              value: stats.activeOffers,
              color: theme.accents.primary,
              link: '/offers',
            },
            {
              label: 'Pending Orders',
              value: stats.pendingOrders,
              color: theme.accents.secondary,
              link: '/orders',
            },
            {
              label: 'Completed Orders',
              value: stats.completedOrders,
              color: '#10B981',
              link: '/orders',
            },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.link}
              className="rounded-xl p-6 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>{stat.label}</p>
              <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl p-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>Recent Activity</h2>
          
          {recentActivity.length === 0 ? (
            <p style={{ color: theme.text.secondary }}>No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: theme.backgrounds.primary }}
                >
                  <div>
                    <p className="font-medium" style={{ color: theme.text.primary }}>
                      {activity.type === 'offer' ? 'Offer' : 'Order'} - {activity.bike?.model?.brand} {activity.bike?.model?.modelName}
                    </p>
                    <p className="text-sm" style={{ color: theme.text.secondary }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: activity.status === 'ACCEPTED' || activity.status === 'DELIVERED' ? '#D1FAE5' : '#FEF3C7',
                      color: activity.status === 'ACCEPTED' || activity.status === 'DELIVERED' ? '#065F46' : '#92400E',
                    }}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/bikes"
              className="rounded-xl p-6 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3 className="font-semibold mb-2" style={{ color: theme.text.primary }}>Browse Motorcycles</h3>
              <p className="text-sm" style={{ color: theme.text.secondary }}>Find your next bike</p>
            </Link>
            <Link
              href="/parts"
              className="rounded-xl p-6 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3 className="font-semibold mb-2" style={{ color: theme.text.primary }}>Shop Parts</h3>
              <p className="text-sm" style={{ color: theme.text.secondary }}>Browse accessories</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Bike Detail Page Enhancement

### Priority: HIGH
### Estimated Time: 4-6 hours

### 6.1 Create Enhanced Bike Detail Page

**File:** `apps/web/app/bikes/[id]/page.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import { z } from "zod";

const offerSchema = z.object({
  offeredPrice: z.string().min(1, "Please enter an offer amount"),
});

type OfferFormValues = z.infer<typeof offerSchema>;

export default function BikeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerMessage, setOfferMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
  });

  useEffect(() => {
    fetchBikeDetail();
  }, [params.id]);

  const fetchBikeDetail = async () => {
    try {
      const response = await api.get(`/catalog/bikes/${params.id}`);
      setBike(response.data);
    } catch (err) {
      console.error('Failed to fetch bike detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOffer = async (data: OfferFormValues) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setSubmittingOffer(true);
    setOfferMessage(null);
    try {
      await api.post('/offers', {
        bikeId: params.id,
        offeredPrice: parseFloat(data.offeredPrice),
        customerName: user.fullName,
        customerPhone: user.phoneNumber,
        customerEmail: user.email,
      });
      setOfferMessage({ type: 'success', text: 'Offer submitted successfully!' });
    } catch (err) {
      setOfferMessage({ type: 'error', text: 'Failed to submit offer' });
    } finally {
      setSubmittingOffer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <p style={{ color: theme.text.secondary }}>Bike not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/bikes" style={{ color: theme.text.secondary }}>Bikes</Link>
          <span className="mx-2" style={{ color: theme.text.muted }}>/</span>
          <span style={{ color: theme.text.primary }}>{bike.model?.modelName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="rounded-xl overflow-hidden mb-4" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              {bike.media && bike.media.length > 0 ? (
                bike.media[0].match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={bike.media[0]} className="w-full aspect-video object-cover" controls />
                ) : (
                  <img src={bike.media[0]} alt={bike.model?.modelName} className="w-full aspect-video object-cover" />
                )
              ) : (
                <div className="w-full aspect-video flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.tertiary }}>
                  <span style={{ color: theme.text.muted }}>No image available</span>
                </div>
              )}
            </div>
            
            {bike.media && bike.media.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {bike.media.slice(1, 5).map((media: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
                  >
                    {media.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={media} className="w-full aspect-square object-cover" />
                    ) : (
                      <img src={media} alt={`Thumbnail ${index}`} className="w-full aspect-square object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <span
                className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
                style={{
                  backgroundColor: bike.status === 'AVAILABLE' ? '#D1FAE5' : '#FEE2E2',
                  color: bike.status === 'AVAILABLE' ? '#065F46' : '#991B1B',
                }}
              >
                {bike.status}
              </span>
              <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
                {bike.model?.brand} {bike.model?.modelName}
              </h1>
              <p className="text-lg" style={{ color: theme.text.secondary }}>
                {bike.model?.year} • {bike.model?.engineCapacity}
              </p>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              <p className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
                PKR {(bike.price || bike.model?.basePrice)?.toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: theme.text.muted }}>Base price</p>
            </div>

            {/* Specifications */}
            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Brand</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.model?.brand}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Model</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.model?.modelName}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Year</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.model?.year}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Engine</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.model?.engineCapacity}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Chassis Number</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.chassisNumber}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Engine Number</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.engineNumber}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Branch</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.branch?.name}, {bike.branch?.city}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>Serial Number</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.serialNumber}</p>
                </div>
              </div>
            </div>

            {/* Make Offer Form */}
            {bike.status === 'AVAILABLE' && (
              <div className="rounded-xl p-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Make an Offer</h2>
                
                {offerMessage && (
                  <div
                    className={`rounded-lg p-3 mb-4 ${
                      offerMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p className={`text-sm ${offerMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{offerMessage.text}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmitOffer)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                      Your Offer (PKR)
                    </label>
                    <input
                      {...register('offeredPrice')}
                      type="number"
                      placeholder="Enter your offer"
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                      style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                    />
                    {errors.offeredPrice && <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>{errors.offeredPrice.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submittingOffer}
                    className="w-full py-2 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
                  >
                    {submittingOffer ? 'Submitting...' : 'Submit Offer'}
                  </button>
                </form>
              </div>
            )}

            {bike.status !== 'AVAILABLE' && (
              <div className="rounded-xl p-6 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
                <p style={{ color: theme.text.secondary }}>This bike is currently {bike.status.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Shopping Cart for Parts

### Priority: MEDIUM
### Estimated Time: 8-10 hours

### 7.1 Create Cart Store

**File:** `apps/web/lib/cart-store.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  partId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  branchId: string;
  branchName: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.partId === item.partId);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.partId === item.partId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      
      removeItem: (partId) => set((state) => ({
        items: state.items.filter(i => i.partId !== partId),
      })),
      
      updateQuantity: (partId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.partId === partId ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### 7.2 Create Cart Page

**File:** `apps/web/app/cart/page.tsx`
```typescript
"use client";
import { useState } from "react";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { useCartStore } from "@/lib/cart-store";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function CartPage() {
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setCheckingOut(true);
    setError(null);

    try {
      // Group items by branch
      const itemsByBranch = items.reduce((acc, item) => {
        if (!acc[item.branchId]) {
          acc[item.branchId] = [];
        }
        acc[item.branchId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create orders for each branch
      for (const [branchId, branchItems] of Object.entries(itemsByBranch)) {
        await api.post('/part-orders', {
          branchId,
          items: branchItems.map(item => ({
            partId: item.partId,
            quantity: item.quantity,
          })),
        });
      }

      clearCart();
      window.location.href = '/orders';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
            <h1 className="text-2xl font-bold mb-4" style={{ color: theme.text.primary }}>Your cart is empty</h1>
            <p className="mb-6" style={{ color: theme.text.secondary }}>Add some parts to get started</p>
            <Link
              href="/parts"
              className="inline-block px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              Browse Parts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: theme.text.primary }}>Shopping Cart</h1>

        {error && (
          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444' }}>
            <p className="text-sm" style={{ color: '#991B1B' }}>{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.partId}
              className="rounded-xl p-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: theme.text.primary }}>{item.name}</h3>
                  <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>SKU: {item.sku}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Branch: {item.branchName}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.partId, item.quantity - 1)}
                      className="w-8 h-8 rounded flex items-center justify-center hover:opacity-90"
                      style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}` }}
                    >
                      -
                    </button>
                    <span className="w-8 text-center" style={{ color: theme.text.primary }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.partId, item.quantity + 1)}
                      className="w-8 h-8 rounded flex items-center justify-center hover:opacity-90"
                      style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}` }}
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="w-24 text-right font-semibold" style={{ color: theme.text.primary }}>
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                  
                  <button
                    onClick={() => removeItem(item.partId)}
                    className="text-red-500 hover:opacity-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg" style={{ color: theme.text.primary }}>Total</span>
            <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              PKR {getTotal().toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full py-3 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
          >
            {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 7.3 Add Cart to Navigation
- Add cart icon with item count to the navigation component

---

## 8. Payment Integration UI

### Priority: HIGH
### Estimated Time: 10-12 hours

### 8.1 Create Payment Page

**File:** `apps/web/app/payment/[orderNumber]/page.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'BANK_TRANSFER' | 'SAFEPAY' | 'JAZZCASH'>('BANK_TRANSFER');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${params.orderNumber}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (selectedMethod === 'SAFEPAY') {
        // Redirect to SafePay
        const response = await api.post(`/payments/${params.orderNumber}/initiate`, {
          method: 'SAFEPAY',
        });
        window.location.href = response.data.paymentUrl;
      } else if (selectedMethod === 'JAZZCASH') {
        // Redirect to JazzCash
        const response = await api.post(`/payments/${params.orderNumber}/initiate`, {
          method: 'JAZZCASH',
        });
        window.location.href = response.data.paymentUrl;
      } else {
        // Bank transfer - show instructions
        await api.post(`/payments/${params.orderNumber}/initiate`, {
          method: 'BANK_TRANSFER',
        });
        router.push(`/orders/${params.orderNumber}?payment=pending`);
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: theme.text.primary }}>Complete Payment</h1>

        {/* Order Summary */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span style={{ color: theme.text.secondary }}>Order Number</span>
            <span style={{ color: theme.text.primary }}>{order?.orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span style={{ color: theme.text.secondary }}>Bike</span>
            <span style={{ color: theme.text.primary }}>{order?.bike?.model?.brand} {order?.bike?.model?.modelName}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span style={{ color: theme.text.primary }}>Total Amount</span>
            <span style={{ color: theme.text.primary }}>PKR {order?.negotiatedAmount?.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl p-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Select Payment Method</h2>
          
          <div className="space-y-4">
            {[
              { value: 'BANK_TRANSFER', label: 'Bank Transfer', description: 'Transfer directly to our bank account' },
              { value: 'SAFEPAY', label: 'SafePay (Card)', description: 'Pay with Visa/Mastercard debit or credit card' },
              { value: 'JAZZCASH', label: 'JazzCash', description: 'Pay using your JazzCash mobile wallet' },
            ].map((method) => (
              <div
                key={method.value}
                onClick={() => setSelectedMethod(method.value as any)}
                className={`rounded-lg p-4 cursor-pointer border-2 transition-colors ${
                  selectedMethod === method.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: theme.backgrounds.primary }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: theme.text.primary }}>{method.label}</h3>
                    <p className="text-sm" style={{ color: theme.text.secondary }}>{method.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {selectedMethod === method.value && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full mt-6 py-3 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
          >
            {processing ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 9. Delivery Tracking UI

### Priority: MEDIUM
### Estimated Time: 6-8 hours

### 9.1 Create Delivery Tracking Page

**File:** `apps/web/app/delivery/[trackingNumber]/page.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function DeliveryTrackingPage() {
  const params = useParams();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDelivery();
  }, [params.trackingNumber]);

  const fetchDelivery = async () => {
    try {
      const response = await api.get(`/deliveries/${params.trackingNumber}`);
      setDelivery(response.data);
    } catch (err) {
      console.error('Failed to fetch delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'IN_TRANSIT', 'DELIVERED'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  const currentStep = getStatusStep(delivery?.status);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: theme.text.primary }}>Track Your Delivery</h1>

        {/* Tracking Info */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm" style={{ color: theme.text.secondary }}>Tracking Number</p>
              <p className="font-semibold" style={{ color: theme.text.primary }}>{delivery?.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: theme.text.secondary }}>Current Status</p>
              <p className="font-semibold" style={{ color: theme.text.primary }}>{delivery?.status}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: theme.text.secondary }}>Delivery Address</p>
              <p className="font-semibold" style={{ color: theme.text.primary }}>{delivery?.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: theme.text.secondary }}>Recipient</p>
              <p className="font-semibold" style={{ color: theme.text.primary }}>{delivery?.recipientName}</p>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="rounded-xl p-6" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: theme.text.primary }}>Delivery Progress</h2>
          
          <div className="relative">
            {['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'IN_TRANSIT', 'DELIVERED'].map((step, index) => (
              <div key={step} className="flex items-start mb-8 last:mb-0">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    {index <= currentStep && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-0.5 h-16 ${
                        index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: theme.text.primary }}>{step.replace(/_/g, ' ')}</h3>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    {index === currentStep ? 'Current status' : index < currentStep ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 10. Real-time Notifications

### Priority: LOW
### Estimated Time: 8-10 hours

### 10.1 Backend - WebSocket Setup

**Step 1: Install WebSocket Dependencies**
```bash
cd apps/api
npm install @nestjs/websockets @nestjs/platform-socket.io
```

**Step 2: Create Notifications Gateway**

**File:** `apps/api/src/modules/notifications/notifications.gateway.ts`
```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.set(userId, client);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    this.connectedUsers.delete(userId);
  }

  sendNotificationToUser(userId: string, notification: any) {
    const client = this.connectedUsers.get(userId);
    if (client) {
      client.emit('notification', notification);
    }
  }
}
```

### 10.2 Frontend - Notification Component

**File:** `apps/web/components/notifications.tsx`
```typescript
"use client";
import { useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";

export default function Notifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      auth: { userId: user.id },
    });

    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 10));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:opacity-90"
        style={{ backgroundColor: theme.backgrounds.secondary }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: theme.accents.secondary, color: theme.text.inverse }}>
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-50" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <div className="p-4 border-b" style={{ borderColor: theme.borders.light }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm" style={{ color: theme.text.secondary }}>No notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="p-4 border-b" style={{ borderColor: theme.borders.light }}>
                  <p className="text-sm" style={{ color: theme.text.primary }}>{notification.message}</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 11. Additional Enhancements

### 11.1 Mobile Responsiveness
- Ensure all pages are fully responsive
- Test on various screen sizes
- Add mobile-specific navigation (hamburger menu)

### 11.2 Loading States
- Add skeleton loaders for all data-fetching components
- Implement optimistic UI updates where appropriate

### 11.3 Error Handling
- Implement global error boundary
- Add retry mechanisms for failed API calls
- Show user-friendly error messages

### 11.4 Accessibility
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works
- Add alt text to all images
- Implement proper focus management

### 11.5 Performance Optimization
- Implement image lazy loading
- Add code splitting for large components
- Optimize bundle size
- Implement caching strategies

### 11.6 Search Enhancement
- Add advanced search filters
- Implement search suggestions
- Add search history

### 11.7 Wishlist/Favorites
- Add ability to save bikes to wishlist
- Create wishlist page
- Add wishlist to navigation

---

## Implementation Order Priority

1. **Phase 1 (Critical - Week 1)**
   - OAuth Integration (Google & Facebook)
   - Password Reset Flow
   - Customer Profile Management

2. **Phase 2 (Important - Week 2)**
   - Email Verification System
   - Bike Detail Page Enhancement
   - Customer Dashboard

3. **Phase 3 (Enhancement - Week 3)**
   - Shopping Cart for Parts
   - Payment Integration UI
   - Delivery Tracking UI

4. **Phase 4 (Polish - Week 4)**
   - Real-time Notifications
   - Mobile Responsiveness
   - Performance Optimization
   - Accessibility Improvements

---

## Testing Checklist

For each feature, ensure:
- [ ] Unit tests for backend services
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Manual testing on different browsers
- [ ] Mobile responsiveness testing
- [ ] Accessibility testing
- [ ] Performance testing

---

## Environment Variables Summary

**Backend (.env):**
```env
# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:4000/auth/facebook/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@khanenterprises.com

# Existing
JWT_SECRET=your-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
DATABASE_URL=your_supabase_database_url
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Best Practices to Follow

1. **Code Organization**
   - Keep components in feature-based folders
   - Use shared types from `packages/types`
   - Reuse UI components from `packages/ui`

2. **Error Handling**
   - Always handle API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging

3. **Security**
   - Never expose sensitive data on frontend
   - Validate all inputs on both client and server
   - Use HTTPS in production
   - Implement rate limiting

4. **Performance**
   - Use React.memo for expensive components
   - Implement pagination for large lists
   - Lazy load images and components
   - Optimize bundle size

5. **User Experience**
   - Provide loading states for all async operations
   - Give clear feedback for user actions
   - Implement proper form validation
   - Ensure consistent styling

6. **Testing**
   - Write unit tests for business logic
   - Write integration tests for API endpoints
   - Test critical user flows end-to-end
   - Test on multiple browsers and devices

---

## Notes

- This implementation assumes Supabase is already configured and the database schema is up to date
- OAuth providers need to be configured in their respective developer consoles
- Email service requires SMTP credentials (Gmail App Password recommended for development)
- Payment gateways (SafePay, JazzCash) require merchant accounts and API credentials
- WebSocket notifications require the backend to support Socket.IO
- All environment variables should be set in production before deployment
- Consider implementing feature flags for gradual rollout of new features
