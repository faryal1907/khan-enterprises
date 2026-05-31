import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getRoot() {
    return { message: "API is running 🚀" };
  }

  /**
   * POST /api/auth/login
   * Authenticates a staff user and returns access + refresh tokens.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /api/auth/refresh
   * Exchanges a valid refresh token for a new access + refresh token pair.
   */
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  /**
   * POST /api/auth/logout
   * Invalidates the refresh token. Access token expires naturally (15m).
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user's profile.
   */
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: Express.User) {
    return { user };
  }

  /**
   * GET /api/auth/users
   * Returns all registered staff users. ADMIN only.
   */
  @Get("users")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async listUsers() {
    const users = await this.authService.getAllUsers();
    return { count: users.length, users };
  }

  /**
   * GET /api/auth/check?email=
   * Dev/admin utility — verify a user exists by email. ADMIN only.
   */
  @Get("check")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async checkUser(@Query("email") email: string) {
    const user = await this.authService.findUserByEmail(email);
    return { exists: true, user };
  }
}
