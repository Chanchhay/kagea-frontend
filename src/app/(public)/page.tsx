"use client";

import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import LandingPage from "@/components/landing-page/LandingPage";

export default function HomePage() {
  return (
    <PublicShell>
      <main className="relative overflow-x-hidden">
        <div className="relative z-10">
          <LandingPage />
        </div>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
