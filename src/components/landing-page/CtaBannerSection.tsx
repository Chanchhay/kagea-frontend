'use client';

import Link from 'next/link';

export default function CtaBannerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
      <div
        data-reveal
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#008A1E] via-[#00921A] to-[#006837] p-8 text-white shadow-xl sm:p-12 md:p-16"
      >
        <div
          data-parallax="28"
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#F3BE00]/20 blur-3xl"
        />
        <div
          data-parallax="20"
          className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
          <span
            data-reveal
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md"
          >
            Take the Next Step in Your Career
          </span>

          <h2 data-reveal className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Ready to Find Your <span className="text-[#F3BE00]">Dream Job</span> Today?
          </h2>

          <p
            data-reveal
            className="max-w-2xl text-sm font-normal leading-relaxed text-white/90 sm:text-base"
          >
            Join over 1.2 million professionals connecting with top employers worldwide.
            Create your profile, discover tailored recommendations, and land your next role.
          </p>

          <div data-stagger className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/find-job"
              className="rounded-xl bg-[#F3BE00] px-8 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-[#e2af00] active:scale-[0.98]"
            >
              Explore 1.2M+ Vacancies
            </Link>
            <Link
              href="/post-job"
              className="rounded-xl border border-white/30 bg-white/15 px-8 py-3.5 text-sm font-bold text-white shadow-md backdrop-blur-md transition hover:bg-white/25 active:scale-[0.98]"
            >
              Post a Job as Employer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
