'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const AUTOPLAY_MS = 6500;

const TESTIMONIALS = [
  {
    name: 'Srey ChanChhay',
    role: 'Fullstack Developer',
    company: 'Kosign Cambodia',
    rating: 5,
    quote:
      'ការងារ is a good website for learning IT with a great environment and mentors. A perfect place to start your IT career.',
    image:
      '/images/testimonials/chanchhay.png',
  },
  {
    name: 'Khann Kanhchana',
    role: 'Backend Engineer',
    company: 'Wing Bank',
    rating: 5,
    quote:
      'I applied to four companies in one afternoon. Two called me back the same week. The job descriptions here are honest about salary, which saved me a lot of time.',
    image:
      '/images/testimonials/kanha.png',
  },
  {
    name: 'Lut Lyna',
    role: 'UI/UX Designer',
    company: 'Freelance',
    rating: 5,
    quote:
      'The portfolio section lets me show real work instead of a plain CV. Three clients found me through my profile without me sending a single message.',
    image:
      '/images/testimonials/lyna.png',
  },
];

export default function TestimonialsSection() {
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
      <h2 data-reveal className="text-center text-3xl font-extrabold text-[#1A202C] dark:text-white sm:text-4xl">
        Clients Testimonial
      </h2>

      {/* Pagination dots */}
      <div data-reveal className="mt-6 flex justify-center items-center gap-2 mb-12">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
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
          aria-label="Previous testimonial"
          className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-900 dark:hover:text-white -ml-4 z-10"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Testimonial content */}
        <div data-stagger className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20 px-8 sm:px-16 w-full transition-opacity duration-500" key={index}>
          {/* Avatar Area */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Green squircle background */}
            <div className="relative flex h-[260px] w-[260px] items-center justify-center rounded-[64px] rounded-tr-[80px] rounded-bl-[80px] bg-[#108A12] shadow-sm">
              <img
                src={active.image}
                alt={active.name}
                className="h-[210px] w-[210px] rounded-full object-cover border-[3px] border-white bg-white"
              />
            </div>

            {/* Red Quote badge */}
            <div className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#E53E3E] text-white shadow-lg">
              <span className="text-3xl font-serif font-black leading-none mt-2">&ldquo;</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 min-w-0 py-4">
            <h3 className="text-3xl font-extrabold text-[#F3BE00]">
              {active.name}
            </h3>
            <p className="mt-1.5 text-lg font-medium text-[#E53E3E]">
              {active.role}
            </p>

            <blockquote className="relative mt-8 text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
              <span className="absolute -left-10 -top-4 text-6xl font-serif text-slate-100 dark:text-slate-800 select-none">&ldquo;</span>
              <span className="relative z-10">{active.quote}</span>
            </blockquote>
          </div>
        </div>

        {/* Right arrow */}
        <button 
          onClick={next}
          aria-label="Next testimonial"
          className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-900 dark:hover:text-white -mr-4 z-10"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
