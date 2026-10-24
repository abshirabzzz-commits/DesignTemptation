import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

function getDjangoBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;
  if (envUrl && envUrl.trim()) {
    let trimmed = envUrl.trim().replace(/\/+$/, "");
    if (trimmed.endsWith("/api")) {
      trimmed = trimmed.slice(0, -4);
    }
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host !== "localhost" && host !== "127.0.0.1") {
        if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
          return "https://designtemptation.onrender.com";
        }
      }
    }
    return trimmed;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://127.0.0.1:8000";
    }
    return "https://designtemptation.onrender.com";
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://designtemptation.onrender.com";
  }

  return "http://127.0.0.1:8000";
}

describe("getDjangoBaseUrl URL Normalization & Production Fallback Suite", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete globalThis.window;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    delete globalThis.window;
  });

  it("should normalize explicit NEXT_PUBLIC_DJANGO_API_URL and remove trailing slashes and /api", () => {
    process.env.NEXT_PUBLIC_DJANGO_API_URL = "https://designtemptation.onrender.com/api/";
    assert.equal(getDjangoBaseUrl(), "https://designtemptation.onrender.com");
  });

  it("should fall back to https://designtemptation.onrender.com in production Node environment", () => {
    delete process.env.NEXT_PUBLIC_DJANGO_API_URL;
    process.env.NODE_ENV = "production";
    assert.equal(getDjangoBaseUrl(), "https://designtemptation.onrender.com");
  });

  it("should fall back to https://designtemptation.onrender.com on Vercel deployment even if NODE_ENV is unset", () => {
    delete process.env.NEXT_PUBLIC_DJANGO_API_URL;
    delete process.env.NODE_ENV;
    process.env.VERCEL = "1";
    assert.equal(getDjangoBaseUrl(), "https://designtemptation.onrender.com");
  });

  it("should fall back to https://designtemptation.onrender.com when running in browser on remote hostname", () => {
    delete process.env.NEXT_PUBLIC_DJANGO_API_URL;
    delete process.env.VERCEL;
    process.env.NODE_ENV = "development";
    globalThis.window = {
      location: {
        hostname: "design-temptation.vercel.app",
      },
    };
    assert.equal(getDjangoBaseUrl(), "https://designtemptation.onrender.com");
  });

  it("should refuse localhost URL when running in browser on a remote deployment", () => {
    process.env.NEXT_PUBLIC_DJANGO_API_URL = "http://127.0.0.1:8000";
    globalThis.window = {
      location: {
        hostname: "design-temptation.vercel.app",
      },
    };
    assert.equal(getDjangoBaseUrl(), "https://designtemptation.onrender.com");
  });

  it("should return http://127.0.0.1:8000 when running in browser on localhost without env", () => {
    delete process.env.NEXT_PUBLIC_DJANGO_API_URL;
    delete process.env.VERCEL;
    process.env.NODE_ENV = "development";
    globalThis.window = {
      location: {
        hostname: "localhost",
      },
    };
    assert.equal(getDjangoBaseUrl(), "http://127.0.0.1:8000");
  });
});
