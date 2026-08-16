'use client';

import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
  distance?: number;
  amount?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.75,
  className = '',
  distance = 48,
  amount = 0.2,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const initialState = useMemo(() => {
    const directionVariants = {
      up: { y: distance, opacity: 0 },
      down: { y: -distance, opacity: 0 },
      left: { x: -distance, opacity: 0 },
      right: { x: distance, opacity: 0 },
    };

    return directionVariants[direction];
  }, [direction, distance]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const startViewport = Math.round((1 - amount) * 100);

    const ctx = gsap.context(() => {
      const revealItems = Array.from(element.querySelectorAll<HTMLElement>('[data-reveal]'));
      const staggerGroups = Array.from(element.querySelectorAll<HTMLElement>('[data-stagger]'));
      const parallaxItems = Array.from(element.querySelectorAll<HTMLElement>('[data-parallax]'));

      gsap.set(element, {
        ...initialState,
        willChange: 'transform, opacity',
      });

      if (revealItems.length > 0) {
        gsap.set(revealItems, {
          y: 32,
          opacity: 0,
          filter: 'blur(8px)',
          willChange: 'transform, opacity, filter',
        });
      }

      staggerGroups.forEach((group) => {
        const groupChildren = Array.from(group.children) as HTMLElement[];
        if (groupChildren.length > 0) {
          gsap.set(groupChildren, {
            y: 40,
            opacity: 0,
            scale: 0.96,
            willChange: 'transform, opacity',
          });
        }
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: `top ${startViewport}%`,
          toggleActions: 'play none none none',
          once: true,
        },
      });

      timeline.to(element, {
        x: 0,
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        clearProps: 'willChange',
      });

      if (revealItems.length > 0) {
        timeline.to(
          revealItems,
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'willChange,filter',
          },
          '-=0.45',
        );
      }

      staggerGroups.forEach((group, index) => {
        const groupChildren = Array.from(group.children) as HTMLElement[];
        if (groupChildren.length > 0) {
          timeline.to(
            groupChildren,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.75,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'willChange',
            },
            index === 0 ? '-=0.5' : '-=0.62',
          );
        }
      });

      parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.parallax ?? 18);
        gsap.fromTo(
          item,
          { y: depth },
          {
            y: depth * -1,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          },
        );
      });
    }, element);

    return () => ctx.revert();
  }, [amount, delay, duration, initialState, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
