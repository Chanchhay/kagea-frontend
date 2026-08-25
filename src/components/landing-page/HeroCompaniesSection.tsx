'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ClipboardList, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetPublicJobsQuery } from '@/services/publicApi';
import { MapPinIcon } from './icons';
import RobotHeroLight from './RobotHeroLight';
import { GlobeBackground } from './shared/GlobeBackground';
import { TypewriterText } from './shared/TypewriterText';
import { ScaleReveal } from './shared/ScaleReveal';

type CompanyCard = {
  id: number;
  name: string;
  category: string;
  location: string;
  featured: boolean;
  bg: string;
  text: string;
  logoText: string;
  jobCount: number;
};

const companyColors = [
  { bg: 'bg-[#063b2a]', text: 'text-emerald-200' },
  { bg: 'bg-[#12325b]', text: 'text-blue-100' },
  { bg: 'bg-[#69410b]', text: 'text-amber-100' },
  { bg: 'bg-[#4c1d54]', text: 'text-fuchsia-100' },
  { bg: 'bg-[#7f1d2d]', text: 'text-rose-100' },
  { bg: 'bg-[#164e63]', text: 'text-cyan-100' },
] as const;

function CompanyMarqueeCard({ company }: { company: CompanyCard }) {
  return (
    <Link href={`/companies/${company.id}`} className="block shrink-0" aria-label={`View ${company.name}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="group relative flex w-[270px] cursor-pointer items-center justify-between overflow-hidden rounded-2xl border border-[#FDE68A] bg-white p-5 shadow-[0_14px_38px_rgba(245,158,11,0.10)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#F3BE00] hover:shadow-[0_18px_44px_rgba(245,158,11,0.16)] sm:w-[310px] dark:border-[#3E444B] dark:bg-[#23272D] dark:shadow-[0_16px_36px_-18px_rgba(0,0,0,.8)] dark:hover:border-[#F3BE00]/60 dark:hover:bg-[#2B3036] dark:hover:shadow-[0_20px_42px_-20px_rgba(0,0,0,.9)]"
      >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${company.bg} ${company.text} text-[11px] font-bold shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,.08)]`}
        >
          {company.logoText}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#0F8A22] dark:text-white dark:group-hover:text-[#7bf0a4]">
            {company.name}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-white/60">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/45" />
            <span className="truncate">{company.location}</span>
          </div>
        </div>
      </div>

      {company.featured && (
        <span className="ml-2 shrink-0 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-semibold text-[#FB7185] ring-1 ring-[#FECDD3] backdrop-blur-sm dark:bg-white/[.06] dark:text-[#ffb4bd] dark:ring-white/15">
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
    const byCompany = new Map<number, Omit<CompanyCard, 'featured' | 'bg' | 'text' | 'logoText'>>();

    for (const job of jobsQuery.data?.content ?? []) {
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
      <section className="relative flex min-h-[calc(100svh-78px)] snap-start items-center overflow-hidden">

        {/*
          * Globe: a square the full width of the viewport, centred on the
          * section's bottom edge, so `overflow-hidden` clips it to the upper
          * hemisphere -- a horizon spanning the whole screen rather than a
          * floating ball.
          *
          * scale == the sphere's world radius, and a 45deg camera at z=10 sees
          * 2 * 10 * tan(22.5deg) ~= 8.28 units across a square viewport, so
          * scale 3.95 puts the globe (plus its radius+0.2 glow ring) just
          * inside the container's full width.
          */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[190vw] w-[190vw] -translate-x-1/2 translate-y-1/2 opacity-40 sm:h-[140vw] sm:w-[140vw] lg:h-[100vw] lg:w-[100vw] dark:opacity-25">
          <GlobeBackground
            className="h-full w-full"
            color="#bfd9fb"
            rotationSpeed={0.00035}
            enableParallax={false}
            scale={3.95}
            latLines={18}
            lonLines={24}
            enableDots
          />
        </div>

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

        {/* Ambient brand glow */}
        <div className="pointer-events-none absolute right-[8%] top-[12%] z-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(31,166,40,.14)_0%,rgba(31,166,40,.06)_45%,transparent_72%)] blur-3xl lg:h-[34rem] lg:w-[34rem] dark:bg-[radial-gradient(circle,rgba(39,183,51,.16)_0%,rgba(39,183,51,.06)_45%,transparent_72%)]" />

        {/*
          * Full-width bottom fade. The three fades above are scoped to the
          * artwork lane; this one spans the whole section so the hero dissolves
          * into the next section instead of stopping on a hard edge mid-scroll.
          */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-52 bg-[linear-gradient(to_top,#fff_0%,rgba(255,255,255,.97)_14%,rgba(255,255,255,.88)_27%,rgba(255,255,255,.72)_40%,rgba(255,255,255,.52)_54%,rgba(255,255,255,.31)_68%,rgba(255,255,255,.13)_84%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(to_top,#181B1C_0%,rgba(24,27,28,.97)_14%,rgba(24,27,28,.88)_27%,rgba(24,27,28,.72)_40%,rgba(24,27,28,.52)_54%,rgba(24,27,28,.31)_68%,rgba(24,27,28,.13)_84%,rgba(24,27,28,0)_100%)]" />

        <div className="relative z-10 w-full px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16 2xl:px-24">
          {/*
            * The copy column is capped per breakpoint so it never runs under
            * the artwork lane on the right (48% from lg, 50% from xl).
            */}
          <div className="flex w-full flex-col items-start text-left sm:max-w-xl lg:max-w-[28rem] xl:max-w-[34rem] 2xl:max-w-[38rem]">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/60 bg-[#EEF6F0] px-4 py-1.5 text-xs font-bold text-[#008A1E] shadow-xs dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <span className="flex h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              <span>⚡ For job seekers &amp; recruiters</span>
            </motion.div>

            {/* Headline */}
            <h1 className="max-w-[12.5ch] whitespace-pre-line font-['Inter',sans-serif] text-[clamp(2.25rem,9vw,2.75rem)] font-black leading-[1] tracking-[-0.055em] sm:max-w-[12ch] sm:text-5xl sm:leading-[0.98] lg:max-w-[11.2ch] lg:text-[52px] xl:text-[64px] 2xl:text-[72px]">
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
            <p className="mt-6 max-w-xl font-['Inter',sans-serif] text-base font-medium leading-relaxed text-slate-500 dark:text-slate-300">
              Browse openings from employers hiring now, build your resume and portfolio, and
              practice interviews generated from the jobs you actually want. Recruiters post
              roles and review candidates from the same place.
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/jobs"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-7 sm:w-auto text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(36,169,68,.28)] transition-colors hover:bg-brand-hover"
              >
                Find a job
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-surface/80 px-7 sm:w-auto text-[15px] font-semibold text-heading backdrop-blur-md transition-colors hover:border-brand/40 hover:text-brand dark:bg-white/[.06]"
              >
                Create an account
              </Link>
            </div>

            {/* What the platform actually does */}
            <ScaleReveal delay={0.3} className="w-full">
              <div className="mt-10 grid w-full gap-px overflow-hidden rounded-[24px] border border-border bg-border/60 sm:grid-cols-3">
                {[
                  {
                    icon: Sparkles,
                    title: 'AI interviews',
                    body: 'Practice sessions generated from the job you are applying to.',
                  },
                  {
                    icon: FileText,
                    title: 'Resumes & portfolios',
                    body: 'Build them once and reuse them across applications.',
                  },
                  {
                    icon: ClipboardList,
                    title: 'Application tracking',
                    body: 'Follow every application from a single dashboard.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-surface/90 p-4 backdrop-blur-md dark:bg-[#23272D]/95">
                    <item.icon aria-hidden="true" className="size-[1.05rem] text-brand" />
                    <p className="mt-2.5 text-[13px] font-semibold text-heading">{item.title}</p>
                    <p className="mt-1 text-[11.5px] leading-[1.45] text-body">{item.body}</p>
                  </div>
                ))}
              </div>
            </ScaleReveal>
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
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-brand dark:bg-brand/20 dark:text-[#8df6a8]">
            <span className="flex size-1.5 rounded-full bg-brand" />
            Hiring now
          </span>
          <h2 className="mt-4 text-[clamp(1.9rem,3vw,2.6rem)] font-semibold tracking-[-0.045em] text-heading">
            Top companies
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-body">
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
