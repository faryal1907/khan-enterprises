import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../../prisma/prisma.service";

export interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: string;
  branchId: string | null;
  vendorId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  /**
   * Called automatically after the token signature is verified.
   * Whatever we return here gets attached to request.user.
   */
  async validate(payload: JwtPayload) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, status: true, branchId: true, vendorId: true, phoneNumber: true },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException("Unauthorized");
    }

    return user; // becomes request.user
  }
}
