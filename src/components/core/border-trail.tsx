'use client';

import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BorderTrailProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
  duration?: number;
  delay?: number;
};

type BorderTrailStyle = CSSProperties & {
  '--border-trail-size': string;
  '--border-trail-duration': string;
  '--border-trail-delay': string;
};

export function BorderTrail({
  className,
  size = 120,
  duration = 6,
  delay = 0,
  style,
  ...props
}: BorderTrailProps) {
  const trailStyle: BorderTrailStyle = {
    '--border-trail-size': `${size}px`,
    '--border-trail-duration': `${duration}s`,
    '--border-trail-delay': `${delay}s`,
    ...style,
  };

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
    >
      <span
        className={cn(
          'border-trail-runner absolute left-0 top-0 h-[2px] rounded-full',
          className,
        )}
        style={trailStyle}
        {...props}
      />
      <style jsx>{`
        .border-trail-runner {
          width: var(--border-trail-size);
          offset-path: rect(0 auto auto 0 round 16px);
          offset-rotate: auto;
          animation: border-trail var(--border-trail-duration) linear
            var(--border-trail-delay) infinite;
        }

        @keyframes border-trail {
          to {
            offset-distance: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .border-trail-runner {
            animation: none;
            offset-distance: 0%;
          }
        }
      `}</style>
    </span>
  );
}
