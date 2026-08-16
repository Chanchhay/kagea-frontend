'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { companies } from './data';
import { ChevronDownIcon, MapPinIcon, SearchIcon, StarIcon } from './icons';
import { TypewriterText } from './shared/TypewriterText';
import { AnimatedNumber } from './shared/animated-number';
import { ScaleReveal } from './shared/ScaleReveal';

export default function HeroCompaniesSection() {
  const statsRef = useRef<HTMLDivElement>(null);
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

  return (
    <>
      {/* Hero Section */}
      <section className="text-center pt-8 pb-4">
        {/* Animated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#EEF6F0] dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 px-4 py-1.5 text-xs font-bold text-[#008A1E] dark:text-emerald-400 mb-6 shadow-xs"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>⚡ #1 Job Search Engine in Cambodia & Global</span>
        </motion.div>

        <h1
          data-reveal
          data-parallax="22"
          className="text-4xl sm:text-6xl lg:text-[80px] font-bold font-['Inter',sans-serif] tracking-tight leading-[1.1] sm:leading-[1.12]"
        >
          <TypewriterText
            segments={[
              { text: 'Explore new ', className: 'text-[#008A1E]' },
              { text: 'job vacancies', className: 'text-[#F3BE00]' },
              { text: '\nall over the world', className: 'text-[#F3BE00]' },
            ]}
            speed={50}
          />
        </h1>
        <p
          data-reveal
          data-parallax="16"
          className="mx-auto mt-5 max-w-2xl text-[18px] font-semibold font-['Inter',sans-serif] text-slate-500 dark:text-slate-300 leading-relaxed"
        >
          Our platform features more than 1.2 million job vacancies worldwide, connecting
          you with top employers who value your skills and experience.
        </p>

        {/* Live Platform Stats Row */}
        <ScaleReveal delay={0.3}>
          <div
            ref={statsRef}
            data-reveal
            data-parallax="12"
            data-stagger
            className="mt-8 grid grid-cols-3 max-w-xl mx-auto divide-x divide-slate-200 dark:divide-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-xs"
          >
            <div>
              <p className="text-lg sm:text-2xl font-black text-[#008A1E] dark:text-emerald-400">
                <AnimatedNumber
                  value={statsVisible ? 1.2 : 0}
                  className="inline"
                  springOptions={{ bounce: 0, duration: 2000 }}
                  format={(v) => v.toFixed(1)}
                />
                <span>M+</span>
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Active Jobs</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-black text-[#F3BE00]">
                <AnimatedNumber
                  value={statsVisible ? 1200 : 0}
                  className="inline"
                  springOptions={{ bounce: 0, duration: 2000 }}
                />
                <span>+</span>
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Top Companies</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-black text-[#008A1E] dark:text-emerald-400">
                <AnimatedNumber
                  value={statsVisible ? 98 : 0}
                  className="inline"
                  springOptions={{ bounce: 0, duration: 2000 }}
                />
                <span>%</span>
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Successful Matches</p>
            </div>
          </div>
        </ScaleReveal>

        {/* Review Cards */}
        <motion.div data-stagger className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
          {[
            'Superb job matching service',
            'Found my perfect role fast',
            'Helped me find work quickly',
          ].map((quote, idx) => (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: '-100px' }}
              className="rounded-2xl bg-[#EEF6F0] px-6 py-4 sm:px-7 sm:py-4.5 dark:bg-slate-900 border border-transparent dark:border-slate-800 transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex justify-center gap-1 mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
                &ldquo;{quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Search Box Section */}
      <section className="mt-6 flex flex-col items-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          data-reveal
          data-parallax="18"
          className="flex w-full max-w-3xl flex-col sm:flex-row items-center rounded-2xl bg-[#EEF6F0] p-1.5 dark:bg-slate-900 gap-2 shadow-sm"
        >
          {/* Keyword Input */}
          <div className="flex flex-1 items-center gap-3 px-4 py-2.5 w-full">
            <SearchIcon className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Company or industry"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          {/* Separator */}
          <div className="hidden sm:block h-6 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Location Input */}
          <div className="flex items-center gap-2 px-4 py-2.5 w-full sm:w-auto">
            <MapPinIcon className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Location"
              className="w-full sm:w-28 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          {/* Separator */}
          <div className="hidden sm:block h-6 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Radius Select */}
          <div className="relative flex items-center px-3 py-2 shrink-0">
            <select className="appearance-none bg-transparent pr-6 text-sm font-medium text-slate-700 outline-none dark:text-slate-200 cursor-pointer">
              <option>20 mi</option>
              <option>10 mi</option>
              <option>50 mi</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 h-4 w-4 text-slate-500" />
          </div>

          {/* Submit Button */}
          <button className="w-full sm:w-auto rounded-xl bg-[#00921A] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#007A16] active:scale-[0.98] shrink-0 shadow-sm">
            Search
          </button>
        </motion.div>

        {/* Filter Tags */}
        <motion.div data-stagger className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {['Remote', 'Work from home', 'Part-time', 'Design'].map((tag, idx) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              viewport={{ once: true, margin: '-50px' }}
              className="rounded-xl bg-[#EEF6F0] px-4 py-2 text-xs font-semibold text-[#008A1E] dark:bg-slate-900 dark:text-emerald-400 cursor-pointer hover:bg-emerald-100 dark:hover:bg-slate-800 transition"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Top Companies Section */}
      <section className="mt-10 sm:mt-12">
        <motion.h2
          data-reveal
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          Top companies
        </motion.h2>

        <motion.div
          data-stagger
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
              className="group relative flex flex-col justify-between rounded-2xl border border-[#FDE68A] bg-white p-5 shadow-[0_14px_38px_rgba(245,158,11,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F3BE00] hover:shadow-[0_18px_44px_rgba(245,158,11,0.16)] dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg ${company.bg} ${company.text} flex items-center justify-center font-bold text-[11px] shrink-0 shadow-sm`}>
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

              <button
                className="w-full rounded-xl bg-[#ECFDF3] py-3 text-xs font-bold text-[#0F8A22] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-[#D1FAE5] transition-all duration-300 group-hover:bg-[#0F8A22] group-hover:text-white group-hover:ring-[#0F8A22] dark:bg-slate-800/80 dark:text-emerald-400 dark:ring-slate-700 dark:group-hover:bg-[#00921A] dark:group-hover:text-white dark:group-hover:ring-[#00921A]"
              >
                Open Position
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
