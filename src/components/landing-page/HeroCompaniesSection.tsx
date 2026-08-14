'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { companies } from './data';
import { ChevronDownIcon, MapPinIcon, SearchIcon } from './icons';
import RobotHeroLight from './RobotHeroLight';
import { TypewriterText } from './shared/TypewriterText';
import { AnimatedNumber } from './shared/animated-number';
import { GlobeBackground } from './shared/GlobeBackground';
import { ScaleReveal } from './shared/ScaleReveal';

export default function HeroCompaniesSection() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const robotTiltRef = useRef<HTMLDivElement>(null);
  const robotHighlightRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const heroEl = heroSectionRef.current;
    const tiltEl = robotTiltRef.current;
    const highlightEl = robotHighlightRef.current;
    if (!heroEl || !tiltEl || !highlightEl) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      tiltEl.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      highlightEl.style.transform = 'translate3d(0px, 0px, 0)';
      highlightEl.style.opacity = '0.16';
      return;
    }

    let rafId = 0;
    let pointerInside = false;
    let lastMoveAt = performance.now();

    const current = { rotateX: 0, rotateY: 0, lightX: 0, lightY: 0 };
    const target = { rotateX: 0, rotateY: 0, lightX: 0, lightY: 0 };

    const animate = (time: number) => {
      const idleBob = pointerInside ? 0 : Math.sin(time / 1100) * 3.5;
      const easing = time - lastMoveAt < 180 ? 0.12 : 0.08;

      current.rotateX += (target.rotateX - current.rotateX) * easing;
      current.rotateY += (target.rotateY - current.rotateY) * easing;
      current.lightX += (target.lightX - current.lightX) * 0.1;
      current.lightY += (target.lightY - current.lightY) * 0.1;

      tiltEl.style.transform =
        `perspective(1400px) rotateX(${current.rotateX.toFixed(2)}deg) ` +
        `rotateY(${current.rotateY.toFixed(2)}deg) translateY(${idleBob.toFixed(2)}px)`;

      highlightEl.style.transform =
        `translate3d(${current.lightX.toFixed(2)}px, ${(current.lightY + idleBob * 0.2).toFixed(2)}px, 0)`;
      highlightEl.style.opacity = `${0.16 + Math.min(Math.abs(current.rotateX) + Math.abs(current.rotateY), 18) * 0.018}`;

      rafId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const normalizedX = Math.max(-1, Math.min(1, (x - 0.5) * 2));
      const normalizedY = Math.max(-1, Math.min(1, (y - 0.5) * 2));

      pointerInside = true;
      lastMoveAt = performance.now();
      target.rotateY = normalizedX * 16;
      target.rotateX = -normalizedY * 14;
      target.lightX = normalizedX * 24;
      target.lightY = normalizedY * 18;
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      target.rotateX = 0;
      target.rotateY = 0;
      target.lightX = 0;
      target.lightY = 0;
    };

    heroEl.addEventListener('pointermove', handlePointerMove);
    heroEl.addEventListener('pointerleave', handlePointerLeave);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      heroEl.removeEventListener('pointermove', handlePointerMove);
      heroEl.removeEventListener('pointerleave', handlePointerLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════ HERO SECTION ═══════════════════════════════════════════ */}
      <section ref={heroSectionRef} className="relative overflow-hidden pb-12 pt-2 lg:pt-4">

        {/* Globe Background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center">
          <div className="h-[650px] w-[650px] max-w-[100vw] overflow-hidden rounded-full opacity-40 dark:opacity-25">
            <GlobeBackground
              className="h-full w-full"
              color="#bfd9fb"
              rotationSpeed={0.00035}
              enableParallax={false}
              scale={3.9}
              latLines={18}
              lonLines={24}
              enableDots
            />
          </div>
        </div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/3 top-10 z-0 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-950/20" />
        <div className="pointer-events-none absolute right-[-12%] top-[6%] z-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(243,190,0,0.28)_0%,_rgba(0,138,30,0.22)_42%,_transparent_72%)] blur-3xl sm:h-[34rem] sm:w-[34rem] lg:h-[42rem] lg:w-[42rem]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[42vw] bg-[linear-gradient(270deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.52)_30%,rgba(255,255,255,0.16)_58%,rgba(255,255,255,0)_100%)] lg:block dark:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[42vw] bg-[linear-gradient(270deg,rgba(7,12,20,0.92)_0%,rgba(7,12,20,0.7)_28%,rgba(7,12,20,0.34)_58%,rgba(7,12,20,0)_100%)] lg:hidden dark:lg:block" />

        {/* 2-Column Hero Grid (Prevents text overlapping AI robot image) */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 items-center gap-10 lg:min-h-[46rem] lg:grid-cols-12 lg:gap-8">

            {/* Left Column: Headline, Subtext, Stats */}
            <div className="relative z-20 flex max-w-2xl flex-col items-center text-center lg:col-span-7 lg:max-w-[42rem] lg:items-start lg:justify-center lg:py-10 lg:text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-[#EEF6F0] px-4 py-1.5 text-xs font-bold text-[#008A1E] shadow-xs dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
              >
                <span className="flex h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                <span>⚡ #1 Job Search Engine in Cambodia &amp; Global</span>
              </motion.div>

              {/* Restored Main Headline with TypewriterText */}
              <h1 className="max-w-[12.5ch] whitespace-pre-line font-['Inter',sans-serif] text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:max-w-[12ch] sm:text-5xl sm:leading-[0.98] lg:max-w-[11.2ch] lg:text-[72px]">
                <TypewriterText
                  segments={[
                    { text: 'Explore new ', className: 'text-[#008A1E]' },
                    { text: 'job', className: 'text-[#F3BE00]' },
                    { text: '\nvacancies', className: 'text-[#F3BE00]' },
                    { text: '\nall over the world', className: 'text-[#F3BE00]' },
                  ]}
                  speed={50}
                />
              </h1>

              {/* Subtext */}
              <p className="mt-6 max-w-xl font-['Inter',sans-serif] text-base font-medium leading-relaxed text-slate-500 dark:text-slate-300">
                Our platform features more than 1.2 million job vacancies worldwide, connecting
                you with top employers who value your skills and experience.
              </p>

              {/* Animated Stats Pill */}
              <ScaleReveal delay={0.3} className="w-full">
                <div
                  ref={statsRef}
                  className="mt-8 grid w-full max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-[24px] border border-slate-100 bg-white/85 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.14)] backdrop-blur-md dark:divide-slate-800 dark:border-slate-800/80 dark:bg-slate-900/70"
                >
                  <div className="px-2 text-center">
                    <p className="text-xl font-black text-[#008A1E] dark:text-emerald-400 sm:text-2xl lg:text-3xl">
                      <AnimatedNumber
                        value={statsVisible ? 1.2 : 0}
                        className="inline"
                        springOptions={{ bounce: 0, duration: 2000 }}
                        format={(v) => v.toFixed(1)}
                      />
                      <span>M+</span>
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Active Jobs
                    </p>
                  </div>

                  <div className="px-2 text-center">
                    <p className="text-xl font-black text-[#F3BE00] sm:text-2xl lg:text-3xl">
                      <AnimatedNumber
                        value={statsVisible ? 1200 : 0}
                        className="inline"
                        springOptions={{ bounce: 0, duration: 2000 }}
                      />
                      <span>+</span>
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Top Companies
                    </p>
                  </div>

                  <div className="px-2 text-center">
                    <p className="text-xl font-black text-[#008A1E] dark:text-emerald-400 sm:text-2xl lg:text-3xl">
                      <AnimatedNumber
                        value={statsVisible ? 98 : 0}
                        className="inline"
                        springOptions={{ bounce: 0, duration: 2000 }}
                      />
                      <span>%</span>
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Successful Matches
                    </p>
                  </div>
                </div>
              </ScaleReveal>
            </div>

            {/* Right Column: AI Robot Image */}
            <div className="relative flex min-h-[20rem] justify-center lg:col-span-5 lg:min-h-[46rem] lg:justify-end">
              <div
                ref={robotTiltRef}
                className="group relative z-10 h-[22rem] w-[17.5rem] transform-gpu opacity-75 sm:h-[29rem] sm:w-[22rem] sm:opacity-90 md:h-[33rem] md:w-[25rem] lg:absolute lg:bottom-[-12%] lg:right-[-5%] lg:h-[44rem] lg:w-[36rem] lg:opacity-100 xl:bottom-[-14%] xl:right-[-7%] xl:h-[49rem] xl:w-[40rem]"
                style={{
                  transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* Glow behind robot */}
                <div
                  aria-hidden="true"
                  className="absolute inset-[14%_8%_6%_10%] rounded-full bg-[radial-gradient(circle,_rgba(251,146,60,0.38)_0%,_rgba(34,197,94,0.2)_42%,_transparent_74%)] blur-[70px] lg:inset-[10%_6%_2%_8%] lg:blur-[110px]"
                />

                {/* Floating mini status badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute left-[-6px] top-10 z-20 hidden rounded-2xl border border-white/40 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:flex sm:items-center sm:gap-3 lg:left-[6%] lg:top-[8%]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    🤖
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">AI Assistant</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Matching 24/7</p>
                  </div>
                </motion.div>

                {/* Robot image */}
                <Image
                  src="/images/ai-hero.png"
                  alt="AI recruiting assistant"
                  fill
                  priority={false}
                  loading="lazy"
                  sizes="(min-width: 1280px) 640px, (min-width: 1024px) 576px, (min-width: 768px) 400px, 280px"
                  className="object-contain object-center drop-shadow-[0_32px_48px_rgba(15,23,42,0.22)] lg:object-right-top"
                />
                <div
                  ref={robotHighlightRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[8%_10%_6%_10%] rounded-[44%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.38)_0%,_rgba(255,255,255,0.16)_18%,_rgba(255,255,255,0.07)_30%,_transparent_56%)] mix-blend-screen opacity-15 blur-2xl lg:inset-[6%_8%_4%_10%]"
                  style={{ willChange: 'transform, opacity' }}
                />
                <RobotHeroLight />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ SEARCH SECTION ═══════════════════════════════════════════ */}
      <section className="mt-4 flex flex-col items-center px-4">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="flex w-full max-w-3xl flex-col items-center gap-2 rounded-2xl bg-[#EEF6F0] p-2 shadow-sm dark:bg-slate-900 sm:flex-row"
        >
          <div className="flex w-full flex-1 items-center gap-3 px-4 py-2.5">
            <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Company or industry"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          <div className="hidden h-6 w-px bg-slate-300 dark:bg-slate-700 sm:block" />

          <div className="flex w-full items-center gap-2 px-4 py-2.5 sm:w-auto">
            <MapPinIcon className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 sm:w-28"
            />
          </div>

          <div className="hidden h-6 w-px bg-slate-300 dark:bg-slate-700 sm:block" />

          <div className="relative flex shrink-0 items-center px-3 py-2">
            <select className="cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium text-slate-700 outline-none dark:text-slate-200">
              <option>20 mi</option>
              <option>10 mi</option>
              <option>50 mi</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 h-4 w-4 text-slate-500" />
          </div>

          <button className="w-full shrink-0 rounded-xl bg-[#00921A] px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#007A16] active:scale-[0.98] sm:w-auto">
            Search
          </button>
        </motion.div>

        {/* Tags */}
        <motion.div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {['Remote', 'Work from home', 'Part-time', 'Design'].map((tag, idx) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              viewport={{ once: true, margin: '-50px' }}
              className="cursor-pointer rounded-xl bg-[#EEF6F0] px-4 py-2 text-xs font-semibold text-[#008A1E] transition hover:bg-emerald-100 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════ TOP COMPANIES SECTION ═══════════════════════════════════════════ */}
      <section className="mt-12 sm:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Top companies
        </motion.h2>

        <motion.div
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {companies.map((company) => (
            <motion.div
              key={company.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#FDE68A] bg-white p-5 shadow-[0_14px_38px_rgba(245,158,11,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F3BE00] hover:shadow-[0_18px_44px_rgba(245,158,11,0.16)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-6 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${company.bg} ${company.text} text-[11px] font-bold shadow-sm`}
                  >
                    {company.logoText}
                  </div>
                  <div>
                    <p className="text-base font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#0F8A22] dark:text-white dark:group-hover:text-emerald-400">
                      {company.category}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPinIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>

                {company.featured && (
                  <span className="shrink-0 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-semibold text-[#FB7185] ring-1 ring-[#FECDD3] backdrop-blur-sm dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/70">
                    Featured
                  </span>
                )}
              </div>

              <button className="w-full rounded-xl bg-[#ECFDF3] py-3 text-xs font-bold text-[#0F8A22] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-[#D1FAE5] transition-all duration-300 group-hover:bg-[#0F8A22] group-hover:text-white group-hover:ring-[#0F8A22] dark:bg-slate-800/80 dark:text-emerald-400 dark:ring-slate-700 dark:group-hover:bg-[#00921A] dark:group-hover:text-white dark:group-hover:ring-[#00921A]">
                Open Position
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
