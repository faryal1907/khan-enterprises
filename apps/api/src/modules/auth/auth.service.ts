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
import { AuditAction } from "@khan/prisma";

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
        phoneNumber: true,
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
          select: { id: true, email: true, fullName: true, phoneNumber: true, role: true, status: true, branchId: true, vendorId: true },
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

  async getAllUsers(filters: {
    role?: "ADMIN" | "MANAGER" | "SALES_STAFF";
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    branchId?: string;
    search?: string;
  } = {}) {
    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.branchId) {
      where.branchId = filters.branchId;
    }

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { phoneNumber: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return this.prisma.client.user.findMany({
      where,
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

  async createUser(
    dto: {
      email: string;
      password: string;
      fullName: string;
      phoneNumber: string;
      role: "ADMIN" | "MANAGER" | "SALES_STAFF";
      branchId?: string;
      vendorId?: string;
    },
    adminId: string
  ) {
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ForbiddenException("User with this email already exists.");
    }

    if (!dto.password || dto.password.length < 6) {
      throw new ForbiddenException("Password must be at least 6 characters.");
    }

    if (dto.branchId) {
      const branch = await this.prisma.client.branch.findUnique({
        where: { id: dto.branchId },
        select: { id: true },
      });

      if (!branch) {
        throw new ForbiddenException("Selected branch does not exist.");
      }
    }

    if (dto.vendorId) {
      const vendor = await this.prisma.client.vendor.findUnique({
        where: { id: dto.vendorId },
        select: { id: true },
      });

      if (!vendor) {
        throw new ForbiddenException("Selected vendor does not exist.");
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const resolvedVendorId = dto.role === "SALES_STAFF" ? (dto.vendorId || null) : null;

    return this.prisma.client.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
          phoneNumber: dto.phoneNumber,
          role: dto.role,
          branchId: dto.branchId || null,
          vendorId: resolvedVendorId,
          status: "ACTIVE",
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
          branch: { select: { id: true, name: true, city: true } },
          vendor: { select: { id: true, name: true } },
          createdAt: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.CREATE,
          entityType: "USER",
          entityId: user.id,
          newValue: JSON.stringify({ email: user.email, role: user.role, branchId: dto.branchId, vendorId: resolvedVendorId }),
        },
      });

      return user;
    });
  }

  async updateUser(
    id: string,
    dto: {
      fullName?: string;
      phoneNumber?: string;
      role?: "ADMIN" | "MANAGER" | "SALES_STAFF";
      branchId?: string | null;
      vendorId?: string | null;
      status?: "ACTIVE" | "INACTIVE";
    },
    adminId: string
  ) {
    return this.prisma.client.$transaction(async (tx) => {
      const oldUser = await tx.user.findUnique({
        where: { id },
        select: { fullName: true, phoneNumber: true, role: true, branchId: true, vendorId: true, status: true },
      });

      if (!oldUser) {
        throw new UnauthorizedException("User not found.");
      }

      if (dto.branchId) {
        const branch = await tx.branch.findUnique({
          where: { id: dto.branchId },
          select: { id: true },
        });

        if (!branch) {
          throw new ForbiddenException("Selected branch does not exist.");
        }
      }

      if (dto.vendorId) {
        const vendor = await tx.vendor.findUnique({
          where: { id: dto.vendorId },
          select: { id: true },
        });

        if (!vendor) {
          throw new ForbiddenException("Selected vendor does not exist.");
        }
      }

      const updateData: any = { ...dto };
      
      // If role is changing, or if role is already non-SALES_STAFF and not changing
      const targetRole = dto.role || oldUser.role;
      if (targetRole !== "SALES_STAFF") {
        updateData.vendorId = null;
      }

      const user = await tx.user.update({
        where: { id },
        data: updateData,
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

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.UPDATE,
          entityType: "USER",
          entityId: user.id,
          oldValue: JSON.stringify(oldUser),
          newValue: JSON.stringify({
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            branchId: user.branch?.id || null,
            vendorId: user.vendor?.id || null,
            status: user.status,
          }),
        },
      });

      return user;
    });
  }

  async deactivateUser(id: string, adminId: string) {
    if (id === adminId) {
      throw new ForbiddenException("You cannot deactivate your own account.");
    }

    return this.prisma.client.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { status: "INACTIVE" },
        select: {
          id: true,
          email: true,
          fullName: true,
          status: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.UPDATE,
          entityType: "USER",
          entityId: user.id,
          oldValue: JSON.stringify({ status: "ACTIVE" }),
          newValue: JSON.stringify({ status: "INACTIVE" }),
        },
      });

      return { message: "User deactivated successfully.", user };
    });
  }

  async activateUser(id: string, adminId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { status: "ACTIVE" },
        select: {
          id: true,
          email: true,
          fullName: true,
          status: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.UPDATE,
          entityType: "USER",
          entityId: user.id,
          oldValue: JSON.stringify({ status: "INACTIVE" }),
          newValue: JSON.stringify({ status: "ACTIVE" }),
        },
      });

      return { message: "User activated successfully.", user };
    });
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
