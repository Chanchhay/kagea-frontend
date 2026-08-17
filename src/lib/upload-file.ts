/**
 * File uploads are deferred: picking a file only stages it, and the bytes are
 * sent when the surrounding form is saved. That keeps MinIO free of orphaned
 * objects from edits the user abandons, and means "Remove" on an unsaved pick
 * costs nothing.
 *
 * Callers hold the staged `File` and call {@link uploadFile} from their submit
 * handler, then persist the returned URL on whatever field owns it.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Mirrors the content types accepted by the backend's FileStorageService. */
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

export type FileVisibility = "public" | "private";

/**
 * Checks a staged file before the form is submitted, so the user is told at
 * pick time rather than after pressing save.
 *
 * @returns an error message, or null when the file is acceptable
 */
export function validateFile(file: File): string | null {
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be 5 MB or smaller.";
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only PDF, PNG, JPG, WebP, and SVG files are accepted.";
  }
  return null;
}

/**
 * Sends a staged file to the backend and resolves to the stored URL.
 *
 * @throws Error carrying the backend's message when the upload fails
 */
export async function uploadFile(
  file: File,
  visibility: FileVisibility,
): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("visibility", visibility.toUpperCase());

  const response = await fetch("/api/v1/files", { method: "POST", body });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // A proxy error or a crash can answer with a non-JSON body.
  }

  const message =
    payload && typeof payload === "object" && "message" in payload
      ? String((payload as { message: unknown }).message)
      : null;

  if (!response.ok) {
    throw new Error(message ?? `Upload failed (${response.status}).`);
  }

  // The backend wraps successful responses in { success, message, data }.
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: { url?: string } }).data
      : (payload as { url?: string } | null);

  if (!data?.url) throw new Error("Upload succeeded but returned no URL.");
  return data.url;
}
