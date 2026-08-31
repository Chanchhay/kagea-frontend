'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { Globe3D, type GlobeMarker } from '@/components/ui/3d-globe';
import { NoiseBackground } from '@/components/ui/noise-background';
import ParticleText from './ParticleText';
import StrokeText from './StrokeText';
import { jobCategoryRows } from './data';
import { CheckIcon, SearchIcon, UploadIcon, UserPlusIcon } from './icons';

const globeMarkers: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, src: 'https://assets.aceternity.com/avatars/1.webp', label: 'New York' },
  { lat: 51.5074, lng: -0.1278, src: 'https://assets.aceternity.com/avatars/2.webp', label: 'London' },
  { lat: 35.6762, lng: 139.6503, src: 'https://assets.aceternity.com/avatars/3.webp', label: 'Tokyo' },
  { lat: -33.8688, lng: 151.2093, src: 'https://assets.aceternity.com/avatars/4.webp', label: 'Sydney' },
  { lat: 48.8566, lng: 2.3522, src: 'https://assets.aceternity.com/avatars/5.webp', label: 'Paris' },
  { lat: 28.6139, lng: 77.209, src: 'https://assets.aceternity.com/avatars/6.webp', label: 'New Delhi' },
  { lat: 55.7558, lng: 37.6173, src: 'https://assets.aceternity.com/avatars/7.webp', label: 'Moscow' },
  { lat: -22.9068, lng: -43.1729, src: 'https://assets.aceternity.com/avatars/8.webp', label: 'Rio de Janeiro' },
  { lat: 31.2304, lng: 121.4737, src: 'https://assets.aceternity.com/avatars/9.webp', label: 'Shanghai' },
  { lat: 25.2048, lng: 55.2708, src: 'https://assets.aceternity.com/avatars/10.webp', label: 'Dubai' },
  { lat: -34.6037, lng: -58.3816, src: 'https://assets.aceternity.com/avatars/11.webp', label: 'Buenos Aires' },
  { lat: 1.3521, lng: 103.8198, src: 'https://assets.aceternity.com/avatars/12.webp', label: 'Singapore' },
  { lat: 37.5665, lng: 126.978, src: 'https://assets.aceternity.com/avatars/13.webp', label: 'Seoul' },
];

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
      className={`flex min-h-[84px] items-center gap-4 rounded-2xl border bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,.08)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5 dark:bg-[#23272D]/95 dark:shadow-[0_18px_38px_rgba(0,0,0,.3)] ${isLast ? 'border-[#F3BE00]/70 dark:border-[#F3BE00]/45' : 'border-white/80 ring-1 ring-slate-200/80 dark:border-[#3E444B] dark:ring-transparent'}`}
    >
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${isLast ? 'bg-amber-50 text-[#D99F00] dark:bg-amber-400/10 dark:text-amber-300' : 'bg-emerald-50 text-[#008A1E] dark:bg-emerald-400/10 dark:text-emerald-300'}`}>
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
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 62%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    mass: 0.4,
  });
  const glowTop = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

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

          <div ref={timelineRef} className="relative">
            <div className="absolute bottom-6 left-[21px] top-6 w-px bg-slate-200 lg:left-1/2 dark:bg-white/10" />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-linear-to-b from-[#008A1E] via-emerald-400 to-[#F3BE00] shadow-[0_0_10px_rgba(0,146,26,.45)] lg:left-1/2"
              style={{ scaleY: prefersReducedMotion ? 1 : smoothProgress }}
            />

            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-[16px] z-20 size-[11px] -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(0,146,26,.12),0_0_18px_7px_rgba(16,185,129,.5)] lg:left-1/2 lg:-translate-x-1/2"
                style={{ top: glowTop }}
              />
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

          {/* ---------- Global community ---------- */}
          <div data-reveal data-parallax="20" className="relative w-full">
            <Globe3D
              markers={globeMarkers}
              className="h-[360px] sm:h-[440px] lg:h-[520px]"
              config={{
                atmosphereColor: '#4da6ff',
                atmosphereIntensity: 20,
                ambientIntensity: 2,
                pointLightIntensity: 3.5,
                bumpScale: 5,
                autoRotateSpeed: 0.3,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}




//// here is the other file
