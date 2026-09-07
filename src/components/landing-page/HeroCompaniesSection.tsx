'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ClipboardList, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetPublicJobsQuery } from '@/services/publicApi';
import { MapPinIcon } from './icons';
import RobotHeroLight from './RobotHeroLight';
import { TypewriterText } from './shared/TypewriterText';
import { ScaleReveal } from './shared/ScaleReveal';

type CompanyCard = {
  id: string;
  name: string;
  category: string;
  location: string;
  featured: boolean;
  bg: string;
  text: string;
  logoText: string;
  jobCount: number;
};

// Deep, saturated grounds with a light mark on top. No blues: the palette
// stays in the warm/green half of the wheel so nothing here reads as the
// stock "corporate blue" the rest of the interface deliberately avoids.
const companyColors = [
  { bg: 'bg-[#063b2a]', text: 'text-emerald-200' },
  { bg: 'bg-[#1d4023]', text: 'text-lime-100' },
  { bg: 'bg-[#69410b]', text: 'text-amber-100' },
  { bg: 'bg-[#4c1d54]', text: 'text-fuchsia-100' },
  { bg: 'bg-[#7f1d2d]', text: 'text-rose-100' },
  { bg: 'bg-[#3f3a17]', text: 'text-yellow-100' },
] as const;

function CompanyMarqueeCard({ company }: { company: CompanyCard }) {
  return (
    <Link href={`/companies/${company.id}`} className="block shrink-0" aria-label={`View ${company.name}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="group relative flex w-[270px] cursor-pointer items-center justify-between overflow-hidden rounded-2xl border border-[#FDE68A] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#F3BE00] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)] sm:w-[310px] dark:border-[#3E444B] dark:bg-[#22262C] dark:shadow-[0_14px_32px_-18px_rgba(0,0,0,.9)] dark:hover:border-[#F3BE00]/60 dark:hover:bg-[#2B3036] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,.8)]"
      >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${company.bg} ${company.text} text-[18px] font-semibold shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,.08)]`}
        >
          {company.logoText}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold leading-tight text-slate-900 transition-colors group-hover:text-[#0F8A22] dark:text-white dark:group-hover:text-[#7bf0a4]">
            {company.name}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-white/60">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/45" />
            <span className="truncate">{company.location}</span>
          </div>
        </div>
      </div>

      {company.featured && (
        <span className="ml-2 shrink-0 rounded-full bg-white/75 px-2.5 py-1 text-[18px] font-semibold text-[#FB7185] ring-1 ring-[#FECDD3] backdrop-blur-sm dark:bg-white/[.06] dark:text-[#ffb4bd] dark:ring-white/15">
          {company.jobCount} {company.jobCount === 1 ? 'role' : 'roles'}
        </span>
      )}
      </motion.div>
    </Link>
  );
}

export default function HeroCompaniesSection() {
  const jobsQuery = useGetPublicJobsQuery({ size: 100, sort: 'publishedAt,desc' });
  const companies = useMemo<CompanyCard[]>(() => {
    const byCompany = new Map<string, Omit<CompanyCard, 'featured' | 'bg' | 'text' | 'logoText'>>();

    for (const job of jobsQuery.data?.content ?? []) {
      // Confidential postings mask their employer, so they carry no companyId
      // and can't be grouped into (or linked from) a company card.
      if (job.companyId === null) continue;

      const company = byCompany.get(job.companyId);
      if (company) {
        company.jobCount += 1;
        continue;
      }

      byCompany.set(job.companyId, {
        id: job.companyId,
        name: job.companyName,
        category: job.categoryName || 'Employer',
        location: job.location || 'Cambodia',
        jobCount: 1,
      });
    }

    return [...byCompany.values()]
      .sort((a, b) => b.jobCount - a.jobCount || a.name.localeCompare(b.name))
      .map((company, index) => ({
        ...company,
        featured: index < 3,
        ...companyColors[index % companyColors.length],
        logoText: companyInitials(company.name),
      }));
  }, [jobsQuery.data?.content]);

  const marqueeCompanies = companies.length
    ? Array.from({ length: Math.max(8, companies.length) }, (_, index) => companies[index % companies.length])
    : [];
  const companyRows = [
    marqueeCompanies.filter((_, index) => index % 2 === 0),
    marqueeCompanies.filter((_, index) => index % 2 === 1),
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════ HERO SECTION ═══════════════════════════════════════════ */}
      {/* 78px is the sticky PublicShell header, so the hero fills exactly what is left of the viewport. */}
      <section className="relative flex min-h-[calc(100svh-78px)] snap-start items-stretch overflow-hidden">

        {/*
          * Artwork: full-height, bled off the right edge, anchored bottom-right.
          * Hidden below lg -- on a phone it sat full-width behind the copy.
          *
          * `contain` rather than `cover` is deliberate. The box is far wider
          * than the artwork's 1024x1338, so cover would crop the top -- which is
          * precisely where RobotHeroLight's strip runs (y 128-483, on the
          * helmet). Contain keeps the whole figure and the whole strip at every
          * viewport, and the fades below remove the edges that made a contained
          * image read as a floating rectangle before.
          */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden overflow-hidden lg:block lg:w-[48%] xl:w-[50%]">
          <Image
            src="/images/ai-hero.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 1px"
            className="object-contain object-[right_bottom]"
          />

          {/*
            * The animated light strip. `xMaxYMax meet` is the SVG spelling of
            * the image's own `object-contain object-[right_bottom]`, so both fit
            * the identical box the identical way and the strip stays welded to
            * the helmet at every viewport size. It sits under the fades so it
            * dissolves into the page along with the artwork.
            */}
          <RobotHeroLight className="z-[1]" preserveAspectRatio="xMaxYMax meet" />

          {/*
            * Keyed to the landing page's own background (white / #0B0F19 on the
            * LandingPage wrapper) rather than a surface token, so the artwork
            * dissolves into the page instead of ending on a visible band.
            */}
          {/* <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.88)_18%,rgba(255,255,255,.45)_42%,rgba(255,255,255,0)_74%)] dark:bg-[linear-gradient(90deg,#0B0F19_0%,rgba(11,15,25,.9)_18%,rgba(11,15,25,.48)_42%,rgba(11,15,25,0)_74%)]" /> */}
          {/* <div className="absolute inset-x-0 bottom-0 z-[2] h-40 bg-[linear-gradient(0deg,#fff_0%,rgba(255,255,255,.6)_38%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(0deg,#0B0F19_0%,rgba(11,15,25,.6)_38%,rgba(11,15,25,0)_100%)]" /> */}
        </div>

        {/*
          * Full-width bottom fade. The three fades above are scoped to the
          * artwork lane; this one spans the whole section so the hero dissolves
          * into the next section instead of stopping on a hard edge mid-scroll.
          */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-52 bg-[linear-gradient(to_top,#fff_0%,rgba(255,255,255,.97)_14%,rgba(255,255,255,.88)_27%,rgba(255,255,255,.72)_40%,rgba(255,255,255,.52)_54%,rgba(255,255,255,.31)_68%,rgba(255,255,255,.13)_84%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(to_top,#181B1C_0%,rgba(24,27,28,.97)_14%,rgba(24,27,28,.88)_27%,rgba(24,27,28,.72)_40%,rgba(24,27,28,.52)_54%,rgba(24,27,28,.31)_68%,rgba(24,27,28,.13)_84%,rgba(24,27,28,0)_100%)]" />

        <div className="relative z-10 flex w-full flex-col px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16 2xl:px-24">
          {/*
            * The copy column is capped per breakpoint so it never runs under
            * the artwork lane on the right (48% from lg, 50% from xl).
            */}
          {/* Copy sits at the top of the hero, with the actions right under it. */}
          <div className="flex w-full flex-col items-start text-left sm:max-w-xl lg:max-w-[28rem] xl:max-w-[34rem] 2xl:max-w-[38rem]">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/60 bg-[#EEF6F0] px-4 py-1.5 text-xs font-semibold text-[#008A1E] shadow-xs dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <span className="flex h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              <span>⚡ For job seekers &amp; recruiters</span>
            </motion.div>

            {/* Headline */}
            <h1 className="max-w-[12.5ch] whitespace-pre-line text-[clamp(2.25rem,9vw,2.75rem)] font-bold leading-[1] tracking-[-0.055em] sm:max-w-[12ch] sm:text-5xl sm:leading-[0.98] lg:max-w-[11.2ch] lg:text-[52px] xl:text-[64px] 2xl:text-[72px]">
              <TypewriterText
                segments={[
                  { text: 'Find jobs.', className: 'text-[#008A1E]' },
                  { text: '\nPractice with AI.', className: 'text-[#F3BE00]' },
                  { text: '\nGet hired.', className: 'text-[#F3BE00]' },
                ]}
                speed={50}
              />
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-slate-500 dark:text-slate-300">
              Browse openings from employers hiring now, build your resume and portfolio, and
              practice interviews generated from the jobs you actually want. Recruiters post
              roles and review candidates from the same place.
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/jobs"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#008A1E] px-8 text-[18px] font-semibold text-white transition-colors hover:bg-[#007018] sm:w-auto"
              >
                Find a job
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border px-8 text-[18px] font-semibold text-heading transition-colors hover:border-[#008A1E] hover:text-[#008A1E] sm:w-auto dark:hover:border-emerald-400 dark:hover:text-emerald-400"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ TOP COMPANIES SECTION ═══════════════════════════════════════════ */}
      {/*
        * `mx-auto` matters here: the LandingPage wrapper no longer supplies a
        * max-width container (the hero needs to bleed full width), so this
        * section centres itself.
        */}
      <section className="relative mx-auto w-full max-w-7xl snap-start px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">

        {/* Soft rule carrying the eye out of the hero and into the grid. */}
        <div
          aria-hidden="true"
          className="mx-auto h-px w-full max-w-3xl bg-[linear-gradient(90deg,transparent,var(--border),transparent)]"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center text-center"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-[18px] font-semibold uppercase tracking-[.12em] text-brand dark:bg-brand/20 dark:text-[#8df6a8]">
            <span className="flex size-1.5 rounded-full bg-brand" />
            Hiring now
          </span>
          <h2 className="mt-4 text-[clamp(1.9rem,3vw,2.6rem)] font-semibold tracking-[-0.045em] text-heading">
            Top companies
          </h2>
          <p className="mt-3 text-[18px] leading-7 text-body">
            Employers posting roles on the platform, across Cambodia.
          </p>
        </motion.div>

        {jobsQuery.isLoading ? (
          <div className="mt-10 grid gap-5 py-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading companies">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[90px] animate-pulse rounded-2xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : jobsQuery.isError ? (
          <p className="mx-auto mt-10 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
            Unable to load companies right now.
          </p>
        ) : companies.length === 0 ? (
          <p className="mx-auto mt-10 rounded-2xl border border-border bg-surface-muted px-5 py-8 text-center text-sm text-body">
            Companies with published jobs will appear here.
          </p>
        ) : (
          <div className="company-marquee mx-auto mt-10 space-y-5 overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] dark:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            {companyRows.map((row, rowIndex) => (
              <div key={rowIndex} className="company-marquee-row overflow-hidden py-1">
                <div className={`company-marquee-track flex w-max ${rowIndex === 1 ? 'company-marquee-reverse' : ''}`}>
                  {[0, 1].map((copyIndex) => (
                    <div key={copyIndex} aria-hidden={copyIndex === 1} className="flex shrink-0 gap-5 pr-5">
                      {row.map((company, companyIndex) => (
                        <CompanyMarqueeCard
                          key={`${copyIndex}-${company.id}-${companyIndex}`}
                          company={company}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          .company-marquee-track {
            animation: company-marquee 28s linear infinite;
            will-change: transform;
          }

          .company-marquee-reverse {
            animation-direction: reverse;
          }

          .company-marquee-row:hover .company-marquee-track {
            animation-play-state: paused;
          }

          @keyframes company-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          @media (prefers-reduced-motion: reduce) {
            .company-marquee {
              mask-image: none;
              overflow-x: auto;
            }

            .company-marquee-track {
              animation: none;
            }
          }
        `}</style>
      </section>

    </>
  );
}

function companyInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'CO';
}
