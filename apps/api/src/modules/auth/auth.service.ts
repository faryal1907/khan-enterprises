import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /** Look up a user by email to verify they exist in the system. */
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

  /** Return all registered staff users (for admin dashboard user management). */
  async getAllUsers() {
    return this.prisma.client.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        branch: { select: { id: true, name: true, city: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
