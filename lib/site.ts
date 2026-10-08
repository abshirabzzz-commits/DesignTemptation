/**
 * Site configuration and canonical URL helpers for DESIGN TEMPTATION.
 * Base site URL is configurable via environment variables for staging/production deployments.
 */

export const SITE_URL: string = (() => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://designtemptation1.vercel.app";
})();

export const SITE_NAME = "DESIGN TEMPTATION";
export const SITE_TAGLINE = "INTERIORS & ARCHITECTURE";
export const DEFAULT_TITLE = "DESIGN TEMPTATION | Interiors & Architecture";
export const DEFAULT_DESCRIPTION =
  "DESIGN TEMPTATION is an interior design and architecture studio based in Bengaluru, specializing in thoughtful residential spaces, commercial environments, and turnkey execution.";

export function getCanonicalUrl(path: string = ""): string {
  if (!path || path === "/") return SITE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
