import { Injectable } from '@nestjs/common';
import { supabase } from '../../lib/supabase';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signInWithGoogle() {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    const frontendUrl = process.env.WEB_URL || "http://localhost:3000";

    const { data, error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${frontendUrl}/auth/callback`,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signInWithFacebook() {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    const frontendUrl = process.env.WEB_URL || "http://localhost:3000";

    const { data, error } = await supabase!.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${frontendUrl}/auth/callback`,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async handleOAuthCallback(accessToken: string, refreshToken: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    // Set session with Supabase tokens
    const { data: sessionData, error: sessionError } = await supabase!.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const { user } = sessionData;
    if (!user?.email) {
      throw new Error('No email from OAuth provider');
    }

    // Check if user exists in our database
    let dbUser = await this.prisma.client.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        branchId: true,
        vendorId: true,
      },
    });

    if (!dbUser) {
      // Create new user from OAuth
      const provider = user.app_metadata?.provider || 'google';
      dbUser = await this.createOAuthUser({
        email: user.email,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        provider,
        providerId: user.id,
      });
    }

    return dbUser;
  }

  private async createOAuthUser(dto: {
    email: string;
    fullName: string;
    provider: string;
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
}
