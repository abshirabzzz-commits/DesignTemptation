import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/session";

/**
 * Next.js 16 Proxy for Secure Admin Route & API Protection
 *
 * Rules:
 * 1. Unauthenticated requests to /admin-dashboard are redirected to the login flow with return path.
 * 2. Authenticated non-admin requests to /admin-dashboard are denied access and redirected with 'auth=denied'.
 * 3. Verified administrators (is_staff: true) are granted access.
 * 4. Direct API calls to /api/admin/* receive HTTP 401 (unauthenticated) or HTTP 403 (non-admin).
 * 5. Cookies must be cryptographically signed with server HMAC; client tampering is rejected.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Direct API protection for administrative endpoints
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySession(sessionCookie);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required. Please sign in with administrator credentials.",
        },
        { status: 401 }
      );
    }

    if (!session.is_staff) {
      return NextResponse.json(
        {
          success: false,
          message: "Access forbidden. Administrator privileges required.",
        },
        { status: 403 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-user-id", String(session.userId));
    requestHeaders.set("x-admin-email", session.email);
    requestHeaders.set("x-admin-token", session.token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Page protection for /admin-dashboard and all nested subroutes
  if (pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySession(sessionCookie);

    // Case 1: Unauthenticated -> redirect to signin flow with return target
    if (!session) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("auth", "signin");
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    // Case 2: Authenticated non-admin -> deny access
    if (!session.is_staff) {
      const deniedUrl = new URL("/", request.url);
      deniedUrl.searchParams.set("auth", "denied");
      return NextResponse.redirect(deniedUrl);
    }

    // Case 3: Verified administrator -> allow request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-user-id", String(session.userId));
    requestHeaders.set("x-admin-email", session.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/api/admin/:path*",
  ],
};
