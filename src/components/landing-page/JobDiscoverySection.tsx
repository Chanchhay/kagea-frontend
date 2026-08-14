'use client';

import { motion } from 'framer-motion';
import CommunityOrbit from './CommunityOrbit';
import ParticleText from './ParticleText';
import StrokeText from './StrokeText';
import { jobCategoryRows } from './data';
import { CheckIcon, SearchIcon, UploadIcon, UserPlusIcon } from './icons';

const workSteps = [
  {
    title: 'Create account',
    description: 'Aliquam facilisis egestas sapien, nec tempor leo tristique at.',
    Icon: UserPlusIcon,
    iconMotion: {
      whileHover: { scale: 1.08 },
      transition: { type: 'spring', stiffness: 260, damping: 18 },
    },
  },
  {
    title: 'Upload CV/Resume',
    description: 'Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.',
    Icon: UploadIcon,
    iconMotion: {
      whileHover: { y: -4, scale: 1.04 },
      transition: { type: 'spring', stiffness: 260, damping: 16 },
    },
  },
  {
    title: 'Find suitable job',
    description: 'Phasellus quis eleifend ex. Morbi nec fringilla nibh.',
    Icon: SearchIcon,
    iconMotion: {
      whileHover: { rotate: -9, x: 2, y: -2, scale: 1.04 },
      transition: { type: 'spring', stiffness: 260, damping: 16 },
    },
  },
  {
    title: 'Apply job',
    description: 'Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales purus.',
    Icon: CheckIcon,
    iconMotion: {
      whileHover: { scale: 1.1 },
      transition: { type: 'spring', stiffness: 280, damping: 18 },
    },
  },
] as const;

export default function JobDiscoverySection() {
  const [jobCategoriesRow1, jobCategoriesRow2, jobCategoriesRow3] = jobCategoryRows;

  return (
    <>
      {/* POPULAR JOBS IN CAMBODIA */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 sm:py-12">
        <div data-reveal className="mb-8 h-[180px] sm:mb-10 sm:h-[220px]">
          <ParticleText
            text="Popular jobs in Cambodia"
            particleSize={2.2}
            density={5}
            color="#F3BE00"
            highlightColor="#008A1E"
            scatter={150}
            gatherDuration={1500}
            stagger={360}
            pointerRepel={34}
            repelRadius={110}
            idleDrift={0.55}
            trigger="hover"
            fontSize="clamp(2rem, 6vw, 4rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        </div>

        <div data-stagger className="flex flex-col items-center gap-4 sm:gap-5">
          {[jobCategoriesRow1, jobCategoriesRow2, jobCategoriesRow3].map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-4.5">
              {row.map((title) => (
                <button
                  key={title}
                  className="rounded-xl sm:rounded-2xl bg-[#008A1E] px-6 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base lg:text-[17px] font-semibold text-white font-['Inter',sans-serif] transition hover:-translate-y-0.5 hover:bg-[#007018] hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* HOW FIND WORK */}
      <section className="w-full py-12 sm:py-16 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto mb-12 max-w-3xl">
            <StrokeText
              text="How Find work"
              strokeColor="#008A1E"
              fillColor="#0f172a"
              strokeWidth={1.6}
              drawDuration={1.35}
              fillDelay={0.12}
              stagger={0.045}
              ease="power2.out"
              trigger="scroll"
              fillMode="wipe"
              fontSize={72}
              fontWeight={800}
              letterSpacing={-2}
              className="dark:[&_text:last-of-type]:fill-white"
            />
          </div>

          <div data-stagger className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {/* Dashed connector lines (desktop only) */}
            <div className="pointer-events-none absolute left-0 right-0 top-12 hidden lg:block z-0">
              <svg className="h-16 w-full" viewBox="0 0 1000 60" fill="none">
                {[ 
                  'M 170 30 Q 280 0 380 30',
                  'M 420 30 Q 530 60 630 30',
                  'M 670 30 Q 780 0 880 30',
                ].map((path, index) => (
                  <g key={path}>
                    <motion.path
                      d={path}
                      stroke="currentColor"
                      className="text-[#008A1E]/25 dark:text-emerald-500/25"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="7 7"
                      fill="none"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 0.55 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.55,
                        delay: 0.25 + index * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformOrigin: 'left center' }}
                    />
                    <motion.path
                      d={path}
                      stroke="currentColor"
                      className="text-[#008A1E] dark:text-emerald-400"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeDasharray="10 12"
                      fill="none"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 0.9 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.55,
                        delay: 0.25 + index * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformOrigin: 'left center' }}
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-44"
                        dur="1.25s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.45;1;0.45"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </motion.path>
                  </g>
                ))}
              </svg>
            </div>

            {workSteps.map(({ title, description, Icon, iconMotion }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="group relative z-10 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl p-6 text-center"
              >
                {/* Theme-aware hover card backdrop */}
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-[-4px] rounded-[24px] border border-[#008A1E]/20 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-emerald-500/35 dark:bg-slate-800/95 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />

                <motion.div
                  className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#008A1E]/15 bg-white/70 shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-emerald-500/10 transition-all duration-300 group-hover:border-[#008A1E] group-hover:bg-[#008A1E] group-hover:ring-8 group-hover:ring-[#008A1E]/20 dark:border-emerald-500/25 dark:bg-slate-900/80 dark:ring-emerald-500/20"
                  {...iconMotion}
                >
                  <Icon className="h-7 w-7 text-[#008A1E] transition-colors duration-300 group-hover:text-white dark:text-emerald-400 dark:group-hover:text-white" />
                </motion.div>
                <h3 className="relative z-10 text-base font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#008A1E] dark:text-white dark:group-hover:text-emerald-400">
                  {title}
                </h3>
                <p className="relative z-10 mt-2 max-w-[220px] text-xs font-medium leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES FOR JOB SEEKERS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
        <div className="mb-6 text-center lg:text-left">
          <span className="text-2xl font-extrabold text-[#008A1E]">Countries for Job Seekers</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start space-y-6">
            <h2 data-reveal className="text-3xl font-extrabold leading-tight text-[#008A1E] sm:text-4xl lg:text-5xl">
              So Many People Are <span className="text-[#F3BE00]">Engaged</span> All Over The World
            </h2>

            <p data-reveal className="max-w-lg text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-sm">
              A Land Of Opportunity With A Diverse Job Market And A Wide Range Of Industries Offering
              Countless Career Paths.
            </p>

            <button data-reveal className="mt-4 rounded-xl bg-[#F3BE00] px-8 py-3.5 text-xs font-extrabold text-[#008A1E] shadow-sm transition hover:bg-[#e2af00] active:scale-[0.98]">
              Post A Job
            </button>
          </div>

          {/* ---------- Community Orbit ---------- */}
          <div data-reveal data-parallax="20" className="relative w-full">
            <CommunityOrbit />
          </div>
        </div>
      </section>
    </>
  );
}
