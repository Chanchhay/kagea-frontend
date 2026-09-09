/**
 * Resolves the base URL for backend API requests.
 *
 * In this project:
 * - The backend is addressed under `/api/v1` (matching `baseApi.ts`).
 * - In server contexts (generateMetadata, sitemap), Node fetch requires an absolute URL.
 * - This resolves to `process.env.API_BASE_URL` (direct backend URL if configured),
 *   or `process.env.NEXT_PUBLIC_SITE_URL` (Spring Cloud Gateway / same-origin proxy),
 *   falling back to `http://localhost:3000`.
 */
export function getApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/**
 * Returns the full absolute URL for a `/api/v1` endpoint.
 *
 * Example: `getApiEndpoint("/public/jobs")` -> `http://localhost:3000/api/v1/public/jobs`
 */
export function getApiEndpoint(endpointPath: string): string {
  const base = getApiBaseUrl();
  const path = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  const normalized = path.startsWith("/api/v1") ? path : `/api/v1${path}`;
  return `${base}${normalized}`;
}
