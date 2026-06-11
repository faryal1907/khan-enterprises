import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login"];
const ADMIN_ACCESS_TOKEN_COOKIE = "adminAccessToken";

// Roles allowed to access admin dashboard
const ALLOWED_ADMIN_ROLES = ["ADMIN", "MANAGER", "SALES_STAFF"];

// Simple JWT decoder (middleware-safe, no dependencies)
function decodeJWT(token: string): { role: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE);

  let decoded: { role: string } | null = null;
  if (token) {
    decoded = decodeJWT(token.value);
  }

  const isValidAdmin = decoded && decoded.role && ALLOWED_ADMIN_ROLES.includes(decoded.role);

  // If trying to access public path, allow it
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    // If already logged in as a valid admin and trying to access login, redirect to dashboard
    if (isValidAdmin && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // If they have an invalid token, clear it while rendering the login page
    if (token && !isValidAdmin) {
      const response = NextResponse.next();
      response.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
      return response;
    }

    return NextResponse.next();
  }

  // If trying to access protected path without a valid admin token
  if (!isValidAdmin) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    if (token && decoded && !ALLOWED_ADMIN_ROLES.includes(decoded.role)) {
      loginUrl.searchParams.set("error", "unauthorized_role");
    }
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    if (token) {
      response.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
