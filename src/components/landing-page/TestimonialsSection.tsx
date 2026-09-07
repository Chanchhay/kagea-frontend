'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useLocale } from '@/i18n/LocaleProvider';

const AUTOPLAY_MS = 6500;

const TESTIMONIALS = [
  {
    key: 't1',
    name: 'Srey ChanChhay',
    company: 'Kosign Cambodia',
    rating: 5,
    image: '/images/testimonials/chanchhay.png',
  },
  {
    key: 't2',
    name: 'Khann Kanhchana',
    company: 'Wing Bank',
    rating: 5,
    image: '/images/testimonials/kanha.png',
  },
  {
    key: 't3',
    name: 'Lut Lyna',
    company: 'Freelance',
    rating: 5,
    image: '/images/testimonials/lyna.png',
  },
] as const;

export default function TestimonialsSection() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const total = TESTIMONIALS.length;
  const active = TESTIMONIALS[index];

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Autoplay timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        setIndex((i) => (i + 1) % total);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [total]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
      <h2 data-reveal className="text-center text-3xl font-bold text-[#1A202C] dark:text-white sm:text-4xl">
        {t('landing.testimonials.heading')}
      </h2>

      {/* Pagination dots */}
      <div data-reveal className="mt-6 flex justify-center items-center gap-2 mb-12">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`${t('landing.testimonials.goToSlide')} ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-[#22C55E]' : 'w-2 bg-[#22C55E]'
            }`}
          />
        ))}
      </div>

      <div 
        data-reveal
        data-parallax="12"
        className="relative flex items-center justify-between focus:outline-none max-w-6xl mx-auto"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Left arrow */}
        <button
          onClick={prev}
          aria-label={t('landing.testimonials.previous')}
          className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#23272D] dark:border dark:border-[#3E444B] shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-900 dark:hover:text-white -ml-4 z-10"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Testimonial content */}
        <div data-stagger className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20 px-8 sm:px-16 w-full transition-opacity duration-500" key={index}>
          {/* Avatar Area */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Green squircle background */}
            <div className="relative flex h-45 w-45 items-center justify-center rounded-[48px] rounded-tr-[60px] rounded-bl-[60px] bg-[#108A12] shadow-sm sm:h-65 sm:w-65 sm:rounded-[64px] sm:rounded-tr-[80px] sm:rounded-bl-[80px]">
              <img
                src={active.image}
                alt={active.name}
                className="h-36.5 w-36.5 rounded-full object-cover border-[3px] border-white bg-white sm:h-52.5 sm:w-52.5"
              />
            </div>

            {/* Red Quote badge */}
            <div className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#E53E3E] text-white shadow-lg">
              <span className="text-3xl font-serif font-bold leading-none mt-2">&ldquo;</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 min-w-0 py-4">
            <h3 className="text-3xl font-bold text-[#F3BE00]">
              {active.name}
            </h3>
            <p className="mt-1.5 text-lg font-medium text-[#E53E3E]">
              {t(`landing.testimonials.items.${active.key}.role`)}
            </p>

            <blockquote className="relative mt-8 text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
              <span className="absolute -left-10 -top-4 text-6xl font-serif text-slate-100 dark:text-slate-800 select-none">&ldquo;</span>
              <span className="relative z-10">{t(`landing.testimonials.items.${active.key}.quote`)}</span>
            </blockquote>
          </div>
        </div>

        {/* Right arrow */}
        <button 
          onClick={next}
          aria-label="Next testimonial"
          className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#23272D] dark:border dark:border-[#3E444B] shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-900 dark:hover:text-white -mr-4 z-10"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
