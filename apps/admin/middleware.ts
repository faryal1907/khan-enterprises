import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login"];

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
  const token = request.cookies.get("accessToken");

  // If trying to access public path, allow it
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    // If already logged in and trying to access login, redirect to dashboard
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If trying to access protected path without token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode JWT and check role
  const decoded = decodeJWT(token.value);
  
  if (!decoded || !decoded.role) {
    // Invalid token - redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Block customers from accessing admin dashboard
  if (!ALLOWED_ADMIN_ROLES.includes(decoded.role)) {
    // Redirect customers to web app
    return NextResponse.redirect(new URL("http://localhost:3000", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
