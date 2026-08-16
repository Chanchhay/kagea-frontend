/**
 * Files live in MinIO and are addressed by the app-relative URL the backend
 * returns from `POST /api/v1/files` — `/api/v1/public/files/…` for images,
 * `/api/v1/files/…` for resumes and verification documents.
 *
 * The Spring Cloud Gateway serves this app and the backend on one origin, so
 * those URLs are already directly fetchable by the browser; this only
 * normalises the empty case so callers can interpolate the result safely.
 *
 * Before the gateway, this rewrote `/api/v1/…` to the Next.js proxy at
 * `/api/backend/…`. That hop is gone.
 */

/**
 * Returns a file URL the browser can fetch, or `""` when there is none.
 *
 * Legacy `/uploads/…` values written before the MinIO migration, and absolute
 * external URLs, pass through unchanged so existing rows keep resolving.
 */
export function resolveFileUrl(url: string | null | undefined): string {
  return url ?? "";
}
