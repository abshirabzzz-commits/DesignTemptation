import { NextRequest, NextResponse } from "next/server";
import { getDjangoBaseUrl } from "@/lib/api";
import {
  signSession,
  verifySession,
  SESSION_COOKIE_NAME,
  TOKEN_COOKIE_NAME,
  DEFAULT_SESSION_DURATION,
} from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session
 * Verifies current HttpOnly session cookie without exposing the raw token.
 */
export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySession(sessionCookie);

  if (!session) {
    return NextResponse.json({
      authenticated: false,
      is_staff: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    is_staff: session.is_staff,
    user: {
      id: session.userId,
      email: session.email,
      is_staff: session.is_staff,
    },
  });
}

/**
 * POST /api/auth/session
 * Validates a DRF access token against the Django backend, extracts verified user details,
 * and sets cryptographically signed HttpOnly cookies for Next.js Proxy route protection.
 *
 * CRITICAL SECURITY RULE:
 * `is_staff` is NEVER accepted from the client. It is queried directly from Django.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication token is required." },
        { status: 400 }
      );
    }

    // Verify token directly with Django backend
    const djangoBaseUrl = getDjangoBaseUrl();
    let djangoRes: Response;
    try {
      djangoRes = await fetch(`${djangoBaseUrl}/api/auth/me/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to verify session with studio backend service.",
          error: err?.message,
        },
        { status: 502 }
      );
    }

    if (!djangoRes.ok) {
      // Invalid or expired token: clear any existing session cookies
      const response = NextResponse.json(
        { success: false, message: "Invalid or expired authentication credentials." },
        { status: 401 }
      );
      response.cookies.delete(SESSION_COOKIE_NAME);
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }

    const data = await djangoRes.json().catch(() => ({}));
    const user = data?.user;

    if (!user || typeof user.id !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid user data returned by backend." },
        { status: 502 }
      );
    }

    // Cryptographically sign the session with backend-verified is_staff boolean
    const signedSession = signSession({
      token,
      userId: user.id,
      email: user.email || "",
      is_staff: Boolean(user.is_staff),
    });

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_staff: Boolean(user.is_staff),
      },
      message: "Session established successfully.",
    });

    // Set signed session cookie (HttpOnly, SameSite=Lax, Secure in production)
    response.cookies.set(SESSION_COOKIE_NAME, signedSession, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: DEFAULT_SESSION_DURATION,
    });

    // Set raw token cookie for server-side proxying if needed
    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: DEFAULT_SESSION_DURATION,
    });

    return response;
  } catch (error: any) {
    console.error("Session establishment error:", error);
    return NextResponse.json(
      { success: false, message: "Server error establishing session." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Revokes the server-side session cookies upon user logout.
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Session cookies cleared.",
  });

  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
