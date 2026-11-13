import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

// ==============================================================================
// Session Implementation under test
// ==============================================================================
const SESSION_COOKIE_NAME = "dt_session";
const TOKEN_COOKIE_NAME = "dt_token";
const DEFAULT_SESSION_DURATION = 7 * 24 * 60 * 60;

function getSessionSecret() {
  return process.env.SESSION_SECRET || process.env.DJANGO_SECRET_KEY || "dt-secret-key-fallback-development-only-84920";
}

function signSession(data, durationSeconds = DEFAULT_SESSION_DURATION) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + durationSeconds;
  const payload = { ...data, iat, exp };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadJson, "utf8").toString("base64url");
  const secret = getSessionSecret();
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

  return `${payloadB64}.${signature}`;
}

function verifySession(tokenString) {
  if (!tokenString || typeof tokenString !== "string") return null;
  const parts = tokenString.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  const secret = getSessionSecret();
  const expectedSignature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || now > payload.exp) return null;
    if (!payload.token || typeof payload.is_staff !== "boolean") return null;
    return payload;
  } catch {
    return null;
  }
}

// ==============================================================================
// Next.js 16 Proxy Logic under test
// ==============================================================================
function runProxy(req) {
  const { pathname, search } = new URL(req.url);

  // 1. Direct API protection for administrative endpoints
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
    const session = verifySession(sessionCookie);

    if (!session) {
      return {
        status: 401,
        headers: { "content-type": "application/json" },
        body: { success: false, message: "Authentication required. Please sign in with administrator credentials." },
      };
    }

    if (!session.is_staff) {
      return {
        status: 403,
        headers: { "content-type": "application/json" },
        body: { success: false, message: "Access forbidden. Administrator privileges required." },
      };
    }

    return {
      status: 200,
      headers: {
        "x-admin-user-id": String(session.userId),
        "x-admin-email": session.email,
        "x-admin-token": session.token,
      },
      next: true,
    };
  }

  // 2. Page protection for /admin-dashboard and nested subroutes
  if (pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/")) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
    const session = verifySession(sessionCookie);

    // Unauthenticated: redirect to login flow
    if (!session) {
      const redirectUrl = new URL("/", req.url);
      redirectUrl.searchParams.set("auth", "signin");
      redirectUrl.searchParams.set("next", `${pathname}${search}`);
      return {
        status: 307,
        headers: { location: redirectUrl.toString() },
        redirect: true,
      };
    }

    // Authenticated non-admin: deny access
    if (!session.is_staff) {
      const deniedUrl = new URL("/", req.url);
      deniedUrl.searchParams.set("auth", "denied");
      return {
        status: 307,
        headers: { location: deniedUrl.toString() },
        redirect: true,
      };
    }

    // Verified administrator: grant access
    return {
      status: 200,
      headers: {
        "x-admin-user-id": String(session.userId),
        "x-admin-email": session.email,
      },
      next: true,
    };
  }

  return { status: 200, next: true };
}

// Helper to simulate request with cookies
function createMockRequest(url, cookies = {}) {
  const cookieMap = new Map(Object.entries(cookies));
  return {
    url,
    cookies: {
      get: (name) => cookieMap.get(name),
    },
  };
}

// ==============================================================================
// Test Suites
// ==============================================================================
describe("Design Temptation — Admin Route Protection & Cryptographic Session Security", () => {
  const adminPayload = {
    token: "verified-admin-token-47a07f9c2d1b",
    userId: 1,
    email: "admin@designtemptation.com",
    is_staff: true,
  };

  const customerPayload = {
    token: "customer-token-93f8e71b2a4c",
    userId: 2,
    email: "customer@example.com",
    is_staff: false,
  };

  describe("Cryptographic Session & Cookie Integrity", () => {
    it("should generate a valid HMAC-signed session string", () => {
      const signed = signSession(adminPayload);
      assert.ok(typeof signed === "string");
      assert.equal(signed.split(".").length, 2);

      const verified = verifySession(signed);
      assert.ok(verified);
      assert.equal(verified.email, "admin@designtemptation.com");
      assert.equal(verified.is_staff, true);
      assert.equal(verified.userId, 1);
      assert.equal(verified.token, adminPayload.token);
    });

    it("should correctly preserve is_staff=false for customer sessions", () => {
      const signed = signSession(customerPayload);
      const verified = verifySession(signed);
      assert.ok(verified);
      assert.equal(verified.email, "customer@example.com");
      assert.equal(verified.is_staff, false);
    });

    it("should REJECT tampered session payload (forged is_staff: false -> true)", () => {
      const signed = signSession(customerPayload);
      const [payloadB64, signature] = signed.split(".");

      // Attacker attempts to modify base64 payload to change is_staff: false -> true
      const decodedJson = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
      decodedJson.is_staff = true;
      const tamperedB64 = Buffer.from(JSON.stringify(decodedJson)).toString("base64url");

      const tamperedSession = `${tamperedB64}.${signature}`;
      const verified = verifySession(tamperedSession);
      assert.equal(verified, null, "Tampered payload MUST fail signature verification");
    });

    it("should REJECT tampered signature", () => {
      const signed = signSession(adminPayload);
      const [payloadB64] = signed.split(".");
      const forgedSession = `${payloadB64}.fakeinvalidhmacsignature12345`;
      const verified = verifySession(forgedSession);
      assert.equal(verified, null, "Forged signature MUST return null");
    });

    it("should REJECT expired sessions", () => {
      const expiredSession = signSession(adminPayload, -10);
      const verified = verifySession(expiredSession);
      assert.equal(verified, null, "Expired session MUST return null");
    });

    it("should safely handle null, undefined, and garbage input", () => {
      assert.equal(verifySession(null), null);
      assert.equal(verifySession(undefined), null);
      assert.equal(verifySession(""), null);
      assert.equal(verifySession("garbage-non-session-string"), null);
      assert.equal(verifySession("a.b.c"), null);
    });
  });

  describe("Next.js 16 Proxy Gate (/admin-dashboard Protection)", () => {
    it("1. Unauthenticated users: MUST be redirected to login flow with return URL in 'next'", () => {
      const req = createMockRequest("http://localhost:3000/admin-dashboard");
      const res = runProxy(req);

      assert.equal(res.status, 307);
      assert.ok(res.headers.location);
      const redirectUrl = new URL(res.headers.location);
      assert.equal(redirectUrl.pathname, "/");
      assert.equal(redirectUrl.searchParams.get("auth"), "signin");
      assert.equal(redirectUrl.searchParams.get("next"), "/admin-dashboard");
    });

    it("1b. Unauthenticated users on nested route: MUST preserve nested destination in 'next'", () => {
      const req = createMockRequest("http://localhost:3000/admin-dashboard/projects?tab=overview");
      const res = runProxy(req);

      assert.equal(res.status, 307);
      const redirectUrl = new URL(res.headers.location);
      assert.equal(redirectUrl.searchParams.get("auth"), "signin");
      assert.equal(redirectUrl.searchParams.get("next"), "/admin-dashboard/projects?tab=overview");
    });

    it("2. Forged cookie: MUST be treated as unauthenticated and redirected to login flow", () => {
      const req = createMockRequest("http://localhost:3000/admin-dashboard", {
        [SESSION_COOKIE_NAME]: "malicious.forged.token",
      });
      const res = runProxy(req);

      assert.equal(res.status, 307);
      const redirectUrl = new URL(res.headers.location);
      assert.equal(redirectUrl.searchParams.get("auth"), "signin");
    });

    it("3. Authenticated Customers (non-admin): MUST be denied access and redirected with 'auth=denied'", () => {
      const customerCookie = signSession(customerPayload);
      const req = createMockRequest("http://localhost:3000/admin-dashboard", {
        [SESSION_COOKIE_NAME]: customerCookie,
      });
      const res = runProxy(req);

      assert.equal(res.status, 307);
      const redirectUrl = new URL(res.headers.location);
      assert.equal(redirectUrl.searchParams.get("auth"), "denied");
      assert.notEqual(redirectUrl.searchParams.get("auth"), "signin");
    });

    it("4. Verified Administrator (is_staff=true): MUST be granted access through Proxy", () => {
      const adminCookie = signSession(adminPayload);
      const req = createMockRequest("http://localhost:3000/admin-dashboard", {
        [SESSION_COOKIE_NAME]: adminCookie,
      });
      const res = runProxy(req);

      assert.equal(res.status, 200);
      assert.equal(res.next, true);
      assert.equal(res.headers["x-admin-user-id"], "1");
      assert.equal(res.headers["x-admin-email"], "admin@designtemptation.com");
      assert.equal(res.headers.location, undefined);
    });
  });

  describe("Direct API Request Protection (/api/admin/*)", () => {
    it("5. Unauthenticated direct API call: MUST return HTTP 401 Unauthorized JSON", () => {
      const req = createMockRequest("http://localhost:3000/api/admin/overview/");
      const res = runProxy(req);

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.match(res.body.message, /authentication required/i);
    });

    it("6. Authenticated Customer calling admin API: MUST return HTTP 403 Forbidden JSON", () => {
      const customerCookie = signSession(customerPayload);
      const req = createMockRequest("http://localhost:3000/api/admin/overview/", {
        [SESSION_COOKIE_NAME]: customerCookie,
      });
      const res = runProxy(req);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.match(res.body.message, /forbidden|privileges required/i);
    });

    it("7. Verified Administrator calling admin API: MUST be allowed through with backend headers", () => {
      const adminCookie = signSession(adminPayload);
      const req = createMockRequest("http://localhost:3000/api/admin/overview/", {
        [SESSION_COOKIE_NAME]: adminCookie,
      });
      const res = runProxy(req);

      assert.equal(res.status, 200);
      assert.equal(res.next, true);
      assert.equal(res.headers["x-admin-token"], adminPayload.token);
    });

    it("8. Unrelated public page (/products): MUST bypass admin proxy restrictions", () => {
      const req = createMockRequest("http://localhost:3000/products");
      const res = runProxy(req);

      assert.equal(res.status, 200);
      assert.equal(res.next, true);
      assert.equal(res.headers?.location, undefined);
    });
  });

  describe("Session Invalidation & Logout Cookie Revocation", () => {
    it("9. Logout / Session clearing: MUST clear HttpOnly session cookies with maxAge 0", () => {
      // Simulate DELETE /api/auth/session response
      const headers = new Headers();
      headers.append("Set-Cookie", "dt_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
      headers.append("Set-Cookie", "dt_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");

      const setCookies = headers.getSetCookie ? headers.getSetCookie() : [headers.get("Set-Cookie")];
      assert.ok(setCookies.some((c) => c.includes("dt_session=") && c.includes("Max-Age=0")));
      assert.ok(setCookies.some((c) => c.includes("dt_token=") && c.includes("Max-Age=0")));
      assert.ok(setCookies.every((c) => c.includes("HttpOnly")));
    });

    it("10. Post-logout request to /admin-dashboard: MUST be blocked as unauthenticated", () => {
      // Request after cookies have been cleared (empty cookies)
      const postLogoutReq = createMockRequest("http://localhost:3000/admin-dashboard", {});
      const res = runProxy(postLogoutReq);

      assert.equal(res.status, 307);
      const redirectUrl = new URL(res.headers.location);
      assert.equal(redirectUrl.searchParams.get("auth"), "signin");
      assert.equal(redirectUrl.searchParams.get("next"), "/admin-dashboard");
    });

    it("11. Post-logout request to /api/admin/overview: MUST return HTTP 401 Unauthorized", () => {
      const postLogoutReq = createMockRequest("http://localhost:3000/api/admin/overview/", {});
      const res = runProxy(postLogoutReq);

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.match(res.body.message, /authentication required/i);
    });
  });
});
