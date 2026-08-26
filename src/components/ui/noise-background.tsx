import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type NoiseBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  containerClassName?: string;
  gradientColors?: string[];
};

type NoiseBackgroundStyle = CSSProperties & {
  '--noise-gradient': string;
};

const defaultGradientColors = [
  'rgb(34, 197, 94)',
  'rgb(243, 190, 0)',
  'rgb(16, 185, 129)',
];

export function NoiseBackground({
  children,
  className,
  containerClassName,
  gradientColors = defaultGradientColors,
  style,
  ...props
}: NoiseBackgroundProps) {
  const colors = gradientColors.length > 0 ? gradientColors : defaultGradientColors;
  const gradient = `conic-gradient(from 0deg, ${[...colors, colors[0]].join(', ')})`;
  const noiseStyle: NoiseBackgroundStyle = {
    '--noise-gradient': gradient,
    ...style,
  };

  return (
    <div
      className={cn(
        'noise-background relative isolate overflow-hidden',
        containerClassName,
        className,
      )}
      style={noiseStyle}
      {...props}
    >
      <span className="noise-background-gradient pointer-events-none absolute -inset-[70%] -z-20" />
      <span className="noise-background-grain pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-overlay" />
      <div className="relative z-10 h-full w-full">{children}</div>

      <style jsx>{`
        .noise-background-gradient {
          background: var(--noise-gradient);
          animation: noise-gradient-spin 5s linear infinite;
        }

        .noise-background-grain {
          background-image:
            radial-gradient(circle at 15% 25%, rgba(255,255,255,.9) 0 1px, transparent 1.5px),
            radial-gradient(circle at 75% 65%, rgba(0,0,0,.55) 0 1px, transparent 1.5px),
            radial-gradient(circle at 45% 85%, rgba(255,255,255,.7) 0 1px, transparent 1.5px);
          background-size: 13px 17px, 19px 23px, 29px 31px;
          animation: noise-grain-shift .7s steps(2) infinite;
        }

        @keyframes noise-gradient-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes noise-grain-shift {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(2px, -1px, 0); }
          100% { transform: translate3d(-1px, 2px, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .noise-background-gradient,
          .noise-background-grain {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
