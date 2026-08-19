'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  color: string;
};

type InteractiveParticleBandProps = {
  className?: string;
};

export default function InteractiveParticleBand({
  className = '',
}: InteractiveParticleBandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const themeRef = useRef<'light' | 'dark'>('light');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const particles: Particle[] = [];

    const readTheme = () => {
      themeRef.current = root.classList.contains('dark') ? 'dark' : 'light';
    };

    const getColors = (isDark: boolean) => {
      if (isDark) {
        return {
          particleBases: [
            'rgba(16, 185, 129, 0.85)',
            'rgba(52, 211, 153, 0.85)',
            'rgba(243, 190, 0, 0.75)',
          ],
          lineRgb: '16, 185, 129',
          mouseLineRgb: '52, 211, 153',
        };
      }
      return {
        particleBases: [
          'rgba(0, 138, 30, 0.75)',
          'rgba(16, 185, 129, 0.65)',
          'rgba(226, 175, 0, 0.7)',
        ],
        lineRgb: '0, 138, 30',
        mouseLineRgb: '16, 185, 129',
      };
    };

    const resize = () => {
      const width = parent.clientWidth || window.innerWidth;
      const height = parent.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 768;
      const particleCount = isMobile ? 55 : 130;
      const isDark = themeRef.current === 'dark';
      const colors = getColors(isDark);

      particles.length = 0;
      for (let i = 0; i < particleCount; i += 1) {
        const baseVx = (Math.random() - 0.5) * 0.6;
        const baseVy = (Math.random() - 0.5) * 0.6;
        const color =
          colors.particleBases[Math.floor(Math.random() * colors.particleBases.length)];

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          size: 1.2 + Math.random() * 2.2,
          color,
        });
      }
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const isDark = themeRef.current === 'dark';
      const colors = getColors(isDark);

      const maxLinkDist = width < 768 ? 110 : 150;
      const mouseRadius = 180;

      context.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        if (!prefersReducedMotion) {
          if (pointer.active) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);

            if (distance < mouseRadius && distance > 0) {
              const force = (1 - distance / mouseRadius) * 0.035;
              particle.vx += (dx / distance) * force;
              particle.vy += (dy / distance) * force;

              // Connect lines to mouse (particles.js grab effect)
              const mouseAlpha = (1 - distance / mouseRadius) * (isDark ? 0.35 : 0.25);
              context.strokeStyle = `rgba(${colors.mouseLineRgb}, ${mouseAlpha})`;
              context.lineWidth = 1.2;
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(pointer.x, pointer.y);
              context.stroke();
            }
          }

          particle.vx += (particle.baseVx - particle.vx) * 0.03;
          particle.vy += (particle.baseVy - particle.vy) * 0.03;
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
          if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));
        }

        // Draw network connections between particles
        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxLinkDist) {
            const alpha = (1 - distance / maxLinkDist) * (isDark ? 0.22 : 0.12);
            context.strokeStyle = `rgba(${colors.lineRgb}, ${alpha})`;
            context.lineWidth = 0.85;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }

      // Draw particle nodes
      for (const particle of particles) {
        context.beginPath();
        context.fillStyle = particle.color;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      pointerRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    readTheme();
    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    resizeObserver.observe(parent);

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden bg-transparent ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
