/**
 * The token that stands in for a login while someone tries an interview
 * without an account.
 *
 * Kept in `localStorage` rather than a cookie so it is never attached to
 * requests by accident: it authorises the guest interview endpoints and nothing
 * else, and the API layer sends it deliberately, on those calls only.
 *
 * Every access is guarded. Storage throws in private modes and when a browser
 * is set to block site data, and a visitor whose storage is unavailable should
 * still be able to read the page — they simply cannot resume an interview.
 */
const STORAGE_KEY = "guest-interview-token";

export function readGuestToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeGuestToken(token: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // A guest who cannot store the token can still finish the interview in
    // this tab; they just cannot come back to it.
  }
}
