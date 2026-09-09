'use client';

type RobotHeroLightProps = {
  className?: string;
  /**
   * Must mirror however the robot PNG is fitted into the same box, because the
   * paths below are drawn in the artwork's own pixel space (the viewBox is
   * exactly ai-hero.png's 1024x1338). `meet` matches `object-contain`, `slice`
   * matches `object-cover`, and xMin/xMid/xMax + YMin/YMid/YMax match the
   * corresponding `object-position`. Mismatch slides the strip off the robot.
   */
  preserveAspectRatio?: string;
};

export default function RobotHeroLight({
  className = '',
  preserveAspectRatio = 'xMidYMid meet',
}: RobotHeroLightProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 1024 1338"
        className="h-full w-full"
        preserveAspectRatio={preserveAspectRatio}
      >
        <defs>
          <linearGradient
            id="robot-strip-gradient"
            x1="425"
            y1="128"
            x2="301"
            y2="483"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fff7d6" />
            <stop offset="0.28" stopColor="#ffd166" />
            <stop offset="0.7" stopColor="#ff9f0a" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>

          <filter id="robot-strip-glow" x="-42%" y="-24%" width="184%" height="148%">
            <feGaussianBlur stdDeviation="7" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="robot-strip-core" x="-24%" y="-18%" width="148%" height="136%">
            <feGaussianBlur stdDeviation="1.7" />
          </filter>

          <filter id="robot-led-halo" x="-260%" y="-260%" width="620%" height="620%">
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
        </defs>

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .robot-light-motion {
              display: none;
            }
          }
        `}</style>

        <g>
          <path
            d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
            fill="none"
            stroke="url(#robot-strip-gradient)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#robot-strip-core)"
            opacity="0.58"
          >
            <animate
              className="robot-light-motion"
              attributeName="opacity"
              values="0.42;0.68;0.42"
              dur="3.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
            />
          </path>
          <g className="robot-light-motion">
            <path
              d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
              fill="none"
              pathLength="1"
              stroke="url(#robot-strip-gradient)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray="0.18 0.1 0.12 0.12 0.08 0.4"
              filter="url(#robot-strip-glow)"
              opacity="0.76"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="3s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
            <path
              d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
              fill="none"
              pathLength="1"
              stroke="#fff8dc"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray="0.07 0.18"
              filter="url(#robot-strip-core)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="3s"
                begin="-0.08s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
            <path
              d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
              fill="none"
              pathLength="1"
              stroke="rgba(255,177,44,0.42)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="0.045 0.205"
              filter="url(#robot-strip-glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="3s"
                begin="-1.5s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
          </g>
        </g>

        <g className="robot-light-motion" opacity="0.9">
          <circle cx="413" cy="276" r="10" fill="rgba(255,166,42,0.28)" filter="url(#robot-led-halo)">
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2.8s"
              begin="-0.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="opacity"
              values="0.18;0.42;0.18"
              dur="2.8s"
              begin="-0.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </circle>
          <circle cx="413" cy="276" r="3.4" fill="#fff8dc">
            <animate
              attributeName="opacity"
              values="0.68;1;0.68"
              dur="2.8s"
              begin="-0.68s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="r"
              values="3.1;4;3.1"
              dur="2.8s"
              begin="-0.68s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </circle>
          <circle cx="413" cy="276" r="2" fill="rgba(255,186,88,0.78)">
            <animate
              attributeName="opacity"
              values="0.38;0.8;0.38"
              dur="2.8s"
              begin="-0.56s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}
