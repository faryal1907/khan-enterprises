import { Controller, Get, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * GET /api/auth/check?email=admin@khan.com
   * Verifies if a user exists in the system by email.
   */
  @Get("check")
  async checkUser(@Query("email") email: string) {
    const user = await this.authService.findUserByEmail(email);
    return { exists: true, user };
  }

  /**
   * GET /api/auth/users
   * Returns all registered staff users for the admin dashboard.
   */
  @Get("users")
  async listUsers() {
    const users = await this.authService.getAllUsers();
    return { count: users.length, users };
  }
}
