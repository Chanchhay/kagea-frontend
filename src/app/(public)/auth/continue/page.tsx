"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ErrorState } from "@/components/shared/ErrorState";
import { useGetCurrentUserQuery } from "@/services/authApi";

/**
 * The sign-in hand-off: this route reads the session, then replaces itself
 * with the dashboard for the caller's role. No list, table or card ever
 * renders here.
 *
 * That is why it no longer shows the shared `LoadingState` skeleton. A
 * skeleton is a promise about the layout that is about to take its place, and
 * this page's content is another page — so the skeleton's header, stat tiles
 * and rows were previewing something that never arrived, stranded in a narrow
 * column near the top of an otherwise empty screen. A centred progress
 * message says what is actually happening instead.
 */
function SigningIn() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 py-16"
    >
      <BrandLogo height={40} priority />

      {/*
       * Decorative: the text below is the accessible name, announced through
       * the live region. Reduced-motion users get the ring without the spin
       * rather than nothing, so the shape still reads as "in progress".
       */}
      <span
        aria-hidden="true"
        className="size-8 rounded-full border-2 border-border border-t-brand motion-safe:animate-spin"
      />

      <p className="text-base text-body">Signing you in…</p>
    </main>
  );
}

export default function AuthContinuePage() {
  return (
    <Suspense fallback={<SigningIn />}>
      <AuthContinue />
    </Suspense>
  );
}

function AuthContinue() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useGetCurrentUserQuery();

  useEffect(() => {
    if (!currentUser.data) return;

    // Set when the proxy bounced a visitor here from a protected page.
    const next = searchParams.get("next");
    if (next?.startsWith("/") && !next.startsWith("//")) {
      router.replace(next);
      return;
    }

    const roles = currentUser.data.roles.map((role) => role.toUpperCase());
    router.replace(
      roles.some((role) => role.includes("RECRUITER"))
        ? "/recruiter/dashboard"
        : "/job-seeker/dashboard",
    );
  }, [currentUser.data, router, searchParams]);

  if (currentUser.isError) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 py-16">
        <BrandLogo height={40} />
        <ErrorState message="Unable to finish signing in." className="max-w-sm" />
      </main>
    );
  }

  return <SigningIn />;
}
