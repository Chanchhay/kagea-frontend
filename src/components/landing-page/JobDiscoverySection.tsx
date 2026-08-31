'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { NoiseBackground } from '@/components/ui/noise-background';
import ParticleText from './ParticleText';
import StrokeText from './StrokeText';
import { jobCategoryRows } from './data';
import { CheckIcon, SearchIcon, UploadIcon, UserPlusIcon } from './icons';

const cambodiaJobHubs = [
  { name: 'Battambang', left: '17%', top: '39%', featured: false },
  { name: 'Siem Reap', left: '39%', top: '29%', featured: true },
  { name: 'Kampong Cham', left: '65%', top: '54%', featured: false },
  { name: 'Phnom Penh', left: '52%', top: '64%', featured: true },
  { name: 'Sihanoukville', left: '30%', top: '78%', featured: true },
] as const;

function CambodiaJobsMap({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-emerald-300/80 bg-[linear-gradient(145deg,#ecfdf3_0%,#dff7e8_55%,#fff8dc_100%)] shadow-[0_30px_70px_-34px_rgba(0,138,30,.42)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_50%_48%,rgba(16,185,129,.15),rgba(20,25,24,.94)_62%)] dark:shadow-[0_28px_70px_-35px_rgba(0,0,0,.8)]"
    >
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[#F3BE00]/20 blur-3xl dark:bg-[#F3BE00]/10" />
      <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-emerald-500/25 blur-3xl dark:bg-emerald-500/10" />
      <Image
        src="/landing-assets/cambodia-map.png"
        alt="Map of Cambodia showing regional job hubs"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-contain p-3 opacity-95 contrast-[1.12] drop-shadow-[0_18px_28px_rgba(0,100,25,.2)] sm:p-5 dark:opacity-35 dark:contrast-100 dark:drop-shadow-[0_16px_24px_rgba(0,0,0,.45)]"
      />

      {cambodiaJobHubs.map((hub, index) => (
        <motion.div
          key={hub.name}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reducedMotion ? 0 : 0.3 + index * 0.1, type: 'spring', stiffness: 240, damping: 18 }}
          className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${hub.featured ? '' : 'hidden sm:block'}`}
          style={{ left: hub.left, top: hub.top }}
        >
          <span className="relative flex size-4 items-center justify-center rounded-full bg-[#008A1E] ring-4 ring-emerald-50 shadow-[0_0_0_5px_rgba(0,138,30,.14),0_6px_16px_rgba(0,138,30,.32)] dark:ring-[#17201C]">
            {!reducedMotion && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-55" />}
            <span className="relative size-1.5 rounded-full bg-white" />
          </span>
          <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50/95 px-2.5 py-1 text-[10px] font-semibold text-[#075E22] shadow-[0_6px_16px_rgba(0,100,25,.15)] backdrop-blur dark:border-white/10 dark:bg-[#202621]/95 dark:text-emerald-100 sm:text-xs">
            {hub.name}
          </span>
        </motion.div>
      ))}

      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#008A1E] bg-[#008A1E] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(0,138,30,.28)] backdrop-blur-md dark:border-white/10 dark:bg-[#202621]/90 dark:text-emerald-300 sm:bottom-6 sm:text-sm">
        Opportunities across Cambodia
      </div>
    </motion.div>
  );
}

const workSteps = [
  {
    title: 'Create account',
    description: 'Aliquam facilisis egestas sapien, nec tempor leo tristique at.',
    eyebrow: 'Account setup',
    result: 'Profile Created',
    status: 'Verified',
    Icon: UserPlusIcon,
    iconMotion: {
      whileHover: { scale: 1.08 },
      transition: { type: 'spring', stiffness: 260, damping: 18 },
    },
  },
  {
    title: 'Upload CV/Resume',
    description: 'Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.',
    eyebrow: 'Resume & portfolio',
    result: 'CV/Resume.pdf',
    status: 'Parsed',
    Icon: UploadIcon,
    iconMotion: {
      whileHover: { y: -4, scale: 1.04 },
      transition: { type: 'spring', stiffness: 260, damping: 16 },
    },
  },
  {
    title: 'Find suitable job',
    description: 'Phasellus quis eleifend ex. Morbi nec fringilla nibh.',
    eyebrow: 'Job matching',
    result: '94% Match',
    status: 'Recommended',
    Icon: SearchIcon,
    iconMotion: {
      whileHover: { rotate: -9, x: 2, y: -2, scale: 1.04 },
      transition: { type: 'spring', stiffness: 260, damping: 16 },
    },
  },
  {
    title: 'Apply job',
    description: 'Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales purus.',
    eyebrow: 'Application',
    result: 'Applied Successfully',
    status: 'Submitted',
    Icon: CheckIcon,
    iconMotion: {
      whileHover: { scale: 1.1 },
      transition: { type: 'spring', stiffness: 280, damping: 18 },
    },
  },
] as const;

type WorkStep = (typeof workSteps)[number];

function TimelineStep({
  step,
  index,
  reducedMotion,
}: {
  step: WorkStep;
  index: number;
  reducedMotion: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, {
    once: true,
    amount: 0.6,
    margin: '0px 0px -12% 0px',
  });
  const isOdd = index % 2 === 0;
  const isLast = index === workSteps.length - 1;
  const active = reducedMotion || isInView;
  const StepIcon = isLast ? PartyPopper : step.Icon;

  const copy = (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`pt-1 lg:pt-5 ${isOdd ? 'lg:text-right' : 'lg:text-left'}`}
    >
      <span className={`font-mono text-[11px] tracking-[0.2em] ${isLast ? 'text-[#D99F00]' : 'text-[#008A1E]'}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[28px] dark:text-white">
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
        {step.description}
      </p>
    </motion.div>
  );

  const card = (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6, margin: '0px 0px -12% 0px' }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 20,
        delay: reducedMotion ? 0 : 0.14,
      }}
      className={`flex min-h-[100px] items-center gap-5 rounded-2xl border bg-white/80 p-5 shadow-[0_14px_35px_rgba(15,23,42,.08)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 dark:bg-[#23272D]/95 dark:shadow-[0_18px_38px_rgba(0,0,0,.3)] ${isLast ? 'border-[#F3BE00]/70 dark:border-[#F3BE00]/45' : 'border-white/80 ring-1 ring-slate-200/80 dark:border-[#3E444B] dark:ring-transparent'}`}
    >
      <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${isLast ? 'bg-amber-50 text-[#D99F00] dark:bg-amber-400/10 dark:text-amber-300' : 'bg-emerald-50 text-[#008A1E] dark:bg-emerald-400/10 dark:text-emerald-300'}`}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          {step.eyebrow}
        </p>
        <p className={`mt-1 truncate text-lg font-bold ${isLast ? 'text-[#D99F00] dark:text-amber-300' : 'text-slate-950 dark:text-white'}`}>
          {step.result}
        </p>
      </div>
      <span className={`hidden shrink-0 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] sm:inline-flex ${isLast ? 'bg-amber-50 text-[#B98600] dark:bg-amber-400/10 dark:text-amber-300' : 'bg-emerald-50 text-[#008A1E] dark:bg-emerald-400/10 dark:text-emerald-300'}`}>
        {step.status}
      </span>
    </motion.div>
  );

  return (
    <div ref={rowRef} className="relative grid grid-cols-[44px_1fr] gap-x-4 lg:grid-cols-[1fr_64px_1fr] lg:gap-x-6">
      <div className="col-start-2 space-y-5 lg:col-auto lg:contents">
        <div className={isOdd ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-3 lg:row-start-1'}>{copy}</div>
        <div className={isOdd ? 'lg:col-start-3 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'}>{card}</div>
      </div>

      <div className="absolute left-0 top-0 z-10 flex size-11 items-center justify-center lg:left-1/2 lg:-translate-x-1/2">
        <motion.div
          className={`flex size-10 items-center justify-center rounded-full border-2 bg-white transition-[border-color,box-shadow,background-color] duration-500 dark:bg-[#0B0F19] ${active
            ? isLast
              ? 'border-[#F3BE00] shadow-[0_0_0_5px_rgba(243,190,0,0.14)]'
              : 'border-[#00921A] shadow-[0_0_0_5px_rgba(0,146,26,0.12)]'
            : 'border-slate-300 shadow-none dark:border-white/20'
          }`}
        >
          <motion.span
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20, delay: reducedMotion ? 0 : 0.08 }}
            className={`flex size-7 items-center justify-center rounded-full ${isLast ? 'bg-[#F3BE00] text-slate-950' : 'bg-[#00921A] text-white'}`}
          >
            <StepIcon className="size-4" />
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

export default function JobDiscoverySection() {
  const [jobCategoriesRow1, jobCategoriesRow2, jobCategoriesRow3] = jobCategoryRows;
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 62%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 30,
    mass: 0.35,
  });
  const glowY = useTransform(smoothProgress, [0, 1], [0, timelineHeight]);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const updateHeight = () => setTimelineHeight(timeline.getBoundingClientRect().height);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(timeline);

    return () => resizeObserver.disconnect();
  }, []);

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
                <NoiseBackground
                  key={title}
                  containerClassName="rounded-xl p-[2px] shadow-[0_8px_22px_rgba(0,138,30,.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,138,30,.2)] sm:rounded-2xl dark:shadow-[0_8px_24px_rgba(0,0,0,.35)]"
                  gradientColors={[
                    'rgb(0, 138, 30)',
                    'rgb(243, 190, 0)',
                    'rgb(52, 211, 153)',
                  ]}
                >
                  <button className="cursor-pointer rounded-[10px] bg-[#008A1E] px-6 py-3.5 font-['Inter',sans-serif] text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#007018] active:scale-[0.98] sm:rounded-[14px] sm:px-7 sm:py-4 sm:text-base lg:text-[17px] dark:bg-emerald-950 dark:text-emerald-50 dark:hover:bg-emerald-900">
                    {title}
                  </button>
                </NoiseBackground>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* HOW FIND WORK */}
      <section className="w-full py-16 transition-colors sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto mb-14 max-w-3xl sm:mb-20">
            <StrokeText
              text="How to Find Work"
              strokeColor="#008A1E"
              fillColor="#008A1E"
              accentText="Work"
              accentColor="#F3BE00"
              fadeStrokeOnFill
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

          <div ref={timelineRef} className="relative">
            <div className="absolute bottom-6 left-[21px] top-6 w-[2px] bg-slate-200 lg:left-1/2 lg:-translate-x-1/2 dark:bg-white/10" />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-6 left-[21px] top-6 w-[2px] origin-top bg-linear-to-b from-[#008A1E] via-emerald-400 to-[#F3BE00] shadow-[0_0_10px_rgba(0,146,26,.45)] lg:left-1/2 lg:-translate-x-1/2"
              style={{ scaleY: prefersReducedMotion ? 1 : smoothProgress }}
            />

            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-20 will-change-transform"
                style={{ y: glowY }}
              >
                <span className="absolute left-[16px] block size-[11px] -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(0,146,26,.12),0_0_18px_7px_rgba(16,185,129,.5)] lg:left-1/2 lg:-translate-x-1/2" />
              </motion.div>
            )}

            <div className="space-y-12 sm:space-y-16">
              {workSteps.map((step, index) => (
                <TimelineStep
                  key={step.title}
                  step={step}
                  index={index}
                  reducedMotion={Boolean(prefersReducedMotion)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRIES FOR JOB SEEKERS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
        <div className="mb-6 text-center lg:text-left">
          <span className="text-2xl font-extrabold text-[#008A1E]">Built for Cambodia&apos;s Talent and Employers</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start space-y-7">
            <h2 data-reveal className="max-w-xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[#008A1E]">
              Connecting Talent With <span className="text-[#F3BE00]">Better Opportunities</span>
            </h2>

            <p data-reveal className="max-w-xl text-base font-normal leading-7 tracking-normal text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              Discover job opportunities, build your professional profile, and practice interviews
              with AI—all in one platform.
            </p>

            <button data-reveal className="mt-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#F3BE00] px-8 py-3 text-sm font-semibold text-[#006F18] shadow-[0_8px_20px_-10px_rgba(243,190,0,.75)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#E8B500] hover:shadow-[0_12px_24px_-10px_rgba(243,190,0,.85)] active:translate-y-0 active:scale-[0.98]">
              Explore Jobs
            </button>
          </div>

          {/* ---------- Cambodia job hubs ---------- */}
          <div className="relative w-full">
            <CambodiaJobsMap reducedMotion={Boolean(prefersReducedMotion)} />
          </div>
        </div>
      </section>
    </>
  );
}




//// here is the other file
