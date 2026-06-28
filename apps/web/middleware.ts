import { NextResponse } from "next/server";

const WEB_ACCESS_TOKEN_COOKIE = "accessToken";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup", "/", "/bikes", "/parts", "/search", "/orders"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(WEB_ACCESS_TOKEN_COOKIE);
  const userCookie = request.cookies.get("user");

  // If trying to access public path, allow it
  const isPublicPath = publicPaths.some((path) => 
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );

  if (isPublicPath) {
    // If already logged in and trying to access login, redirect to dashboard
    if (token && userCookie && pathname === "/login") {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
