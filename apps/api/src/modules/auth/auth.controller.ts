import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
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
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /api/auth/register
   * Public endpoint for customer registration
   */
  @Post("register")
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerCustomer(dto);
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

  /**
   * POST /api/auth/users
   * Create a new staff user. ADMIN only.
   */
  @Post("users")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createUser(@Body() dto: any, @CurrentUser() admin: any) {
    return this.authService.createUser(dto, admin.sub);
  }

  /**
   * GET /api/auth/users/:id
   * Get a single user by ID. ADMIN only.
   */
  @Get("users/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async getUser(@Param("id") id: string) {
    return this.authService.getUserById(id);
  }

  /**
   * PUT /api/auth/users/:id
   * Update a user. ADMIN only.
   */
  @Put("users/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateUser(@Param("id") id: string, @Body() dto: any, @CurrentUser() admin: any) {
    return this.authService.updateUser(id, dto, admin.sub);
  }

  /**
   * DELETE /api/auth/users/:id
   * Deactivate a user. ADMIN only.
   */
  @Delete("users/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deactivateUser(@Param("id") id: string, @CurrentUser() admin: any) {
    return this.authService.deactivateUser(id, admin.sub);
  }

  /**
   * POST /api/auth/users/:id/activate
   * Activate a user. ADMIN only.
   */
  @Post("users/:id/activate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async activateUser(@Param("id") id: string, @CurrentUser() admin: any) {
    return this.authService.activateUser(id, admin.sub);
  }
}
