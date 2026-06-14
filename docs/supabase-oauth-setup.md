# Supabase OAuth Setup Guide

This document explains how to set up Google OAuth using Supabase for the Khan Enterprises application.

## Overview

We've implemented Google OAuth authentication through Supabase instead of manual passport strategies. This provides a simpler, more secure, and more maintainable OAuth implementation.

## Architecture

- **Frontend (Next.js)**: Uses Supabase client to initiate OAuth flow
- **Backend (NestJS)**: Handles OAuth callback and issues JWT tokens
- **Supabase**: Manages OAuth provider configuration and token exchange

## Environment Variables

### Backend (apps/api/.env)

Add these variables to your API environment:

```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (apps/web/.env.local)

Add these variables to your web app environment:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the project URL and anon key from project settings

### 2. Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console
5. Set the redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Configure consent screen if required
6. Create OAuth 2.0 client ID for **Web application**
7. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
8. Copy Client ID and Client Secret

## Implementation Details

### Backend Files

- `apps/api/src/lib/supabase.ts` - Supabase client configuration
- `apps/api/src/modules/auth/supabase-auth.service.ts` - OAuth service
- `apps/api/src/modules/auth/auth.controller.ts` - OAuth endpoints
- `apps/api/src/modules/auth/auth.module.ts` - Module configuration

### Frontend Files

- `apps/web/lib/supabase.ts` - Supabase client configuration
- `apps/web/app/signup/page.tsx` - Sign up with Google button
- `apps/web/app/auth/callback/page.tsx` - OAuth callback handler

## API Endpoints

### Initiate Google OAuth
```
GET /api/auth/google
```
Returns Supabase OAuth URL for redirect

### Google OAuth Callback
```
GET /api/auth/google/callback?code=xxx
```
Handles OAuth callback, creates user if needed, issues JWT tokens, redirects to frontend

### Initiate Facebook OAuth
```
GET /api/auth/facebook
```
Returns Supabase OAuth URL for redirect

### Facebook OAuth Callback
```
GET /api/auth/facebook/callback?code=xxx
```
Handles OAuth callback, creates user if needed, issues JWT tokens, redirects to frontend

## OAuth Flow

1. User clicks "Sign up with Google" on signup page
2. Frontend calls Supabase to get OAuth URL
3. User is redirected to Google consent screen
4. Google redirects back to Supabase with authorization code
5. Supabase exchanges code for tokens and redirects to backend callback
6. Backend exchanges code with Supabase for user session
7. Backend creates user in database if doesn't exist
8. Backend issues JWT tokens (access + refresh)
9. Backend redirects to frontend with tokens in URL
10. Frontend callback page extracts tokens and stores them
11. User is redirected to home page authenticated

## User Creation

When a user signs in via OAuth for the first time:

- User is created with `CUSTOMER` role
- Random password is generated (user can set password later)
- Email and name are extracted from OAuth provider
- Account is set to `ACTIVE` status
- No branch or vendor association

## Testing

1. Ensure all environment variables are set
2. Start the backend: `cd apps/api && npm run dev`
3. Start the frontend: `cd apps/web && npm run dev`
4. Navigate to signup page
5. Click "Sign up with Google"
6. Complete Google OAuth flow
7. Verify user is created and authenticated

## Troubleshooting

### "No email from OAuth provider"
- Ensure Google OAuth is properly configured in Supabase
- Check that email scope is requested in Supabase provider settings

### "Missing tokens in callback"
- Check that backend callback URL is correctly configured
- Verify frontend URL environment variable

### CORS errors
- Ensure Supabase project allows your domain
- Check that redirect URLs match exactly

### User not created
- Check backend logs for errors
- Verify database connection
- Ensure Prisma client is properly configured

## Security Notes

- Supabase anon key is safe to use on frontend (limited permissions)
- Never expose service role key or JWT secret
- OAuth tokens are exchanged server-side for security
- JWT tokens are issued by your backend, not Supabase
- Refresh tokens are stored in database for revocation capability
