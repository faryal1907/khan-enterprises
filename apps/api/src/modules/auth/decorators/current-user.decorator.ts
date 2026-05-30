import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Extracts the authenticated user from the request object.
 * Populated by JwtStrategy.validate() after token verification.
 * Usage: @CurrentUser() user: RequestUser
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
