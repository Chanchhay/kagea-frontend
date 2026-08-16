/**
 * Files live in MinIO and are addressed by the app-relative URL the backend
 * returns from `POST /api/v1/files` — `/api/v1/public/files/…` for anything
 * rendered as an image, `/api/v1/files/…` for resumes and verification
 * documents. Storing a relative URL rather than a MinIO one means rotating the
 * bucket host or its credentials never invalidates rows already in the database;
 * only the short-lived presigned redirect target changes.
 *
 * The browser reaches the backend through the Next.js proxy mounted at
 * `/api/backend`, so the prefix is swapped at render time. Once the Spring Cloud
 * Gateway fronts both apps on one origin, this becomes a no-op and can be
 * deleted.
 */

const BACKEND_PREFIX = "/api/v1/";
const PROXY_PREFIX = "/api/backend/";

/**
 * Maps a stored file URL to one the browser can fetch.
 *
 * Legacy `/uploads/…` values written before the MinIO migration, and absolute
 * external URLs, are returned unchanged so existing rows keep resolving.
 */
export function resolveFileUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url.startsWith(BACKEND_PREFIX)
    ? PROXY_PREFIX + url.slice(BACKEND_PREFIX.length)
    : url;
}
