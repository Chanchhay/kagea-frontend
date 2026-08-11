"use client";

import LandingPage from "@/components/landing-page/LandingPage";
import { GlobeBackground } from "@/components/landing-page/shared/GlobeBackground";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      {/* 3D wireframe earth globe, fixed behind the page content */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-70 transition-opacity duration-500 dark:opacity-60">
        <div className="flex h-full w-full items-center justify-center">
          <GlobeBackground
            color="#9fc5e8"
            rotationSpeed={0.0008}
            enableParallax
            scale={5.0}
            latLines={18}
            lonLines={24}
            enableDots
          />
        </div>
      </div>

      <div className="relative z-10">
        <LandingPage />
      </div>
    </main>
  );
}
