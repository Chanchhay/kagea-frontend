import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PREFIXES = ["public/"];
const PUBLIC_PATHS = new Set(["auth/register"]);
const PROTECTED_PREFIXES = ["job-seeker/", "recruiter/", "files/"];
// `files` is the MinIO upload endpoint; `files/...` reads a stored object.
// Public objects are served under `public/files/...`, already covered above.
const PROTECTED_PATHS = new Set(["me", "files"]);

function isAllowedPath(path: string) {
  return (
    PUBLIC_PATHS.has(path) ||
    PROTECTED_PATHS.has(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
    PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

function isPublicPath(path: string) {
  return (
    PUBLIC_PATHS.has(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

export async function backendRequest(
  request: NextRequest,
  segments: string[],
) {
  const path = segments.map(decodeURIComponent).join("/");
  if (!path || path.includes("..") || !isAllowedPath(path)) {
    return Response.json({ message: "Backend route not allowed." }, { status: 404 });
  }

  const apiBaseUrl = (
    process.env.API_BASE_URL ??
    "http://localhost:8080"
  ).replace(/\/$/, "");
  const target = new URL(`/api/v1/${path}`, apiBaseUrl);
  target.search = request.nextUrl.search;

  const requestHeaders = new Headers({ accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) requestHeaders.set("content-type", contentType);

  if (!isPublicPath(path)) {
    try {
      const token = await auth.api.getAccessToken({
        body: { providerId: "keycloak" },
        headers: request.headers,
      });
      if (!token.accessToken) {
        return Response.json({ message: "Unauthorized." }, { status: 401 });
      }
      requestHeaders.set("authorization", `Bearer ${token.accessToken}`);
    } catch {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  let response = await fetch(target, {
    method: request.method,
    headers: requestHeaders,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    // File reads answer 302 to a presigned MinIO URL; see below.
    redirect: "manual",
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      // Followed here rather than in the browser: MinIO is not necessarily
      // reachable from the client, and a presigned URL must be fetched with no
      // Authorization header — S3 rejects requests carrying both.
      response = await fetch(location, { cache: "no-store" });
    }
  }

  const responseHeaders = new Headers();
  for (const header of ["content-type", "content-length", "content-disposition"]) {
    const value = response.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
