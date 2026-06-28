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
  Req,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { SupabaseAuthService } from "./supabase-auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseAuthService: SupabaseAuthService,
    private readonly configService: ConfigService,
  ) {}

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
  async listUsers(
    @Query("role") role?: "ADMIN" | "MANAGER" | "SALES_STAFF",
    @Query("status") status?: "ACTIVE" | "INACTIVE" | "SUSPENDED",
    @Query("branchId") branchId?: string,
    @Query("search") search?: string,
  ) {
    const users = await this.authService.getAllUsers({ role, status, branchId, search });
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
  async createUser(@Body() dto: CreateUserDto, @CurrentUser() admin: any) {
    return this.authService.createUser(dto, admin.id);
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
  async updateUser(@Param("id") id: string, @Body() dto: UpdateUserDto, @CurrentUser() admin: any) {
    return this.authService.updateUser(id, dto, admin.id);
  }

  /**
   * DELETE /api/auth/users/:id
   * Deactivate a user. ADMIN only.
   */
  @Delete("users/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deactivateUser(@Param("id") id: string, @CurrentUser() admin: any) {
    return this.authService.deactivateUser(id, admin.id);
  }

  /**
   * POST /api/auth/users/:id/activate
   * Activate a user. ADMIN only.
   */
  @Post("users/:id/activate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async activateUser(@Param("id") id: string, @CurrentUser() admin: any) {
    return this.authService.activateUser(id, admin.id);
  }

  // ─── OAuth Endpoints (Supabase) ─────────────────────────────────────────

  /**
   * GET /api/auth/google
   * Initiates Google OAuth flow via Supabase
   */
  @Get("google")
  async googleAuth() {
    return this.supabaseAuthService.signInWithGoogle();
  }

  /**
   * GET /api/auth/facebook
   * Initiates Facebook OAuth flow via Supabase
   */
  @Get("facebook")
  async facebookAuth() {
    return this.supabaseAuthService.signInWithFacebook();
  }

  /**
   * POST /api/auth/oauth/callback
   * Handles OAuth callback from frontend with Supabase tokens
   */
  @Post("oauth/callback")
  async oauthCallback(@Body() dto: { accessToken: string; refreshToken: string }) {
    const user = await this.supabaseAuthService.handleOAuthCallback(dto.accessToken, dto.refreshToken);

    // Issue tokens
    const tokens = await this.authService.issueTokens(
      user.id,
      user.email,
      user.role,
      user.branchId,
      user.vendorId,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }
}
