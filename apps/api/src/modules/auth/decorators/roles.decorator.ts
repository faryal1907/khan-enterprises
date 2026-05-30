import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

/**
 * Restricts a route to specific roles.
 * Usage: @Roles('ADMIN') or @Roles('ADMIN', 'MANAGER')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
