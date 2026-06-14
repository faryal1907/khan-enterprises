import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    // 1. Find user — include passwordHash this time
    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        fullName: true,
        role: true,
        status: true,
        branchId: true,
        vendorId: true,
        branch: { select: { id: true, name: true, city: true } },
        vendor: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (user.status !== "ACTIVE") {
      throw new ForbiddenException("Account is suspended or inactive.");
    }

    // 2. Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    // 3. Issue tokens
    const tokens = await this.issueTokens(user.id, user.email, user.role, user.branchId, user.vendorId);

    // 4. Return tokens + safe user profile (no passwordHash)
    const { passwordHash: _omit, ...profile } = user;
    return { ...tokens, user: profile };
  }

  // ─── Register Customer ─────────────────────────────────────────────────────

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

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refresh(rawRefreshToken: string) {
    // Hash the incoming token to look it up
    const tokenHash = this.hashToken(rawRefreshToken);

    const stored = await this.prisma.client.refreshToken.findFirst({
      where: { tokenHash },
      include: {
        user: {
          select: { id: true, email: true, role: true, status: true, branchId: true, vendorId: true },
        },
      },
    });

    if (!stored) {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    if (stored.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.client.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException("Refresh token has expired. Please log in again.");
    }

    if (stored.user.status !== "ACTIVE") {
      throw new ForbiddenException("Account is suspended or inactive.");
    }

    // Rotate: delete old token, issue new pair
    await this.prisma.client.refreshToken.delete({ where: { id: stored.id } });

    return this.issueTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role,
      stored.user.branchId,
      stored.user.vendorId,
    );
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);
    // Silently succeed even if token not found (already logged out)
    await this.prisma.client.refreshToken.deleteMany({ where: { tokenHash } });
    return { message: "Logged out successfully." };
  }

  // ─── User queries (existing, kept intact) ─────────────────────────────────

  async findUserByEmail(email: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        branch: { select: { id: true, name: true, city: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException("No account found with that email.");
    }

    return user;
  }

  async getAllUsers() {
    return this.prisma.client.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        vendorId: true,
        branch: { select: { id: true, name: true, city: true } },
        vendor: { select: { id: true, name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        branchId: true,
        vendorId: true,
        branch: { select: { id: true, name: true, city: true } },
        vendor: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    return user;
  }

  async createUser(dto: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: "ADMIN" | "MANAGER" | "SALES_STAFF";
    branchId?: string;
    vendorId?: string;
  }) {
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ForbiddenException("User with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.client.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
        branchId: dto.branchId || null,
        vendorId: dto.vendorId || null,
        status: "ACTIVE",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        vendorId: true,
        branch: { select: { id: true, name: true, city: true } },
        vendor: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    return user;
  }

  async updateUser(id: string, dto: {
    fullName?: string;
    phoneNumber?: string;
    role?: "ADMIN" | "MANAGER" | "SALES_STAFF";
    branchId?: string | null;
    vendorId?: string | null;
    status?: "ACTIVE" | "INACTIVE";
  }) {
    const user = await this.prisma.client.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        vendorId: true,
        branch: { select: { id: true, name: true, city: true } },
        vendor: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async deactivateUser(id: string) {
    const user = await this.prisma.client.user.update({
      where: { id },
      data: { status: "INACTIVE" },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
      },
    });

    return { message: "User deactivated successfully.", user };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  async issueTokens(
    userId: string,
    email: string,
    role: string,
    branchId: string | null,
    vendorId: string | null = null,
  ) {
    const payload: JwtPayload = { sub: userId, email, role, branchId, vendorId };

    const accessToken = this.jwt.sign(payload as object, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.parseDurationSeconds(process.env.JWT_EXPIRE ?? "15m"),
    });

    // Generate a cryptographically random refresh token
    const rawRefreshToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = this.hashToken(rawRefreshToken);

    const refreshExpireMs = this.parseDuration(process.env.JWT_REFRESH_EXPIRE ?? "7d");

    await this.prisma.client.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + refreshExpireMs),
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /** Converts "7d", "15m", "1h" to milliseconds */
  private parseDuration(duration: string): number {
    return this.parseDurationSeconds(duration) * 1000;
  }

  /** Converts "7d", "15m", "1h" to seconds (for JWT expiresIn) */
  private parseDurationSeconds(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);
    switch (unit) {
      case "s": return value;
      case "m": return value * 60;
      case "h": return value * 60 * 60;
      case "d": return value * 24 * 60 * 60;
      default:  return 7 * 24 * 60 * 60; // fallback 7d
    }
  }
}
