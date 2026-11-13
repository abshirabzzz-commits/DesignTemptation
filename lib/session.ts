import crypto from "crypto";

export interface SessionPayload {
  token: string;
  userId: number;
  email: string;
  is_staff: boolean;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = "dt_session";
export const TOKEN_COOKIE_NAME = "dt_token";
export const DEFAULT_SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

function getSessionSecret(): string {
  // Use explicit SESSION_SECRET, fallback to DJANGO_SECRET_KEY, or safe development fallback
  const secret = process.env.SESSION_SECRET || process.env.DJANGO_SECRET_KEY || "dt-secret-key-fallback-development-only-84920";
  return secret;
}

/**
 * Creates a cryptographically signed session token.
 * Format: <base64url-payload>.<hmac-sha256-signature>
 */
export function signSession(
  data: Omit<SessionPayload, "iat" | "exp">,
  durationSeconds: number = DEFAULT_SESSION_DURATION
): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + durationSeconds;
  const payload: SessionPayload = {
    ...data,
    iat,
    exp,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadJson, "utf8").toString("base64url");
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 * Returns the decoded SessionPayload if valid and non-expired.
 * Returns null if the token is missing, malformed, expired, or tampered with.
 */
export function verifySession(tokenString?: string | null): SessionPayload | null {
  if (!tokenString || typeof tokenString !== "string") {
    return null;
  }

  const parts = tokenString.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) {
    return null;
  }

  const secret = getSessionSecret();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as SessionPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || now > payload.exp) {
      return null;
    }

    if (!payload.token || typeof payload.is_staff !== "boolean") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
