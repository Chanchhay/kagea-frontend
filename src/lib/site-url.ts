const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "http://localhost:3000";

const normalizedSiteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const siteUrl = normalizedSiteUrl.replace(/\/$/, "");

export function absoluteSiteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
}
