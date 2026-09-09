'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetPublicJobsQuery } from '@/services/publicApi';

/**
 * How many jobs are actually published right now.
 *
 * `getPublicJobs` is not run through `normalizePage`, and the backend serialises
 * pages VIA_DTO -- the total lives under `page.totalElements`, not beside
 * `content` as the generated contract claims. Both spellings are read here, and
 * the count is simply not shown when neither arrives, so the banner never
 * invents a number.
 */
function usePublishedJobCount() {
  const { data } = useGetPublicJobsQuery({ size: 1 });
  if (!data) return null;

  const flat = (data as { totalElements?: number }).totalElements;
  const nested = (data as { page?: { totalElements?: number } }).page?.totalElements;
  const total = flat ?? nested;

  return typeof total === 'number' ? total : null;
}

export default function CtaBannerSection() {
  const jobCount = usePublishedJobCount();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        data-reveal
        className="rounded-[28px] bg-brand px-6 py-14 text-white sm:rounded-[36px] sm:px-10 sm:py-20 lg:px-14 dark:bg-brand-hover"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
              <span className="text-sm font-medium text-white/80">Get started</span>
            </div>

            <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
              Ready to find your next role in{' '}
              <span className="text-warning-text">Cambodia</span>?
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Create a profile once, apply to any opening in a few clicks, and practise
              the interview with AI before you meet the hiring team.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-warning px-8 text-sm font-semibold text-brand-hover transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-warning active:translate-y-0 active:scale-[0.98]"
            >
              Create your account
              <ArrowUpRight className="size-4" />
            </Link>

            <Link
              href="/jobs"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-8 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-brand"
            >
              {jobCount === null ? 'Browse jobs' : `Browse ${jobCount.toLocaleString()} open jobs`}
            </Link>
          </div>
        </div>

        {/* Hairline footer: who each door is for, so employers are not left guessing. */}
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/70 sm:mt-20">
          <span>Hiring instead?</span>
          <Link
            href="/register"
            className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          >
            Register as an employer
          </Link>
          <Link
            href="/companies"
            className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          >
            See who is already hiring
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
