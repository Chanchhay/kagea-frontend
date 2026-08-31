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
          <filter id="robot-strip-glow" x="-42%" y="-24%" width="184%" height="148%">
            <feGaussianBlur stdDeviation="4.8" result="softGlow" />
            <feColorMatrix
              in="softGlow"
              type="matrix"
              values="1 0 0 0 0
                      0 0.64 0 0 0
                      0 0.16 0 0 0
                      0 0 0 1 0"
            />
          </filter>

          <filter id="robot-strip-core" x="-24%" y="-18%" width="148%" height="136%">
            <feGaussianBlur stdDeviation="1.7" />
          </filter>

          <filter id="robot-led-halo" x="-220%" y="-220%" width="540%" height="540%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .robot-light-motion {
              display: none;
            }
          }
        `}</style>

        <g opacity="0.96">
          <path
            d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
            fill="none"
            stroke="rgba(255,180,56,0.16)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#robot-strip-core)"
          />
          <g className="robot-light-motion">
            <path
              d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
              fill="none"
              pathLength="1"
              stroke="rgba(255,168,24,0.92)"
              strokeWidth="12.5"
              strokeLinecap="round"
              strokeDasharray="0.24 0.76"
              filter="url(#robot-strip-glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="2.8s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
            <path
              d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
              fill="none"
              pathLength="1"
              stroke="rgba(255,249,230,0.98)"
              strokeWidth="5.4"
              strokeLinecap="round"
              strokeDasharray="0.12 0.88"
              filter="url(#robot-strip-core)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="2.8s"
                begin="-0.12s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
            <path
              d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
              fill="none"
              pathLength="1"
              stroke="rgba(255,194,86,0.48)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="0.08 0.92"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="2.8s"
                begin="-1.4s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
          </g>
        </g>

        <g className="robot-light-motion" opacity="0.95">
          <circle cx="413" cy="276" r="8" fill="rgba(255,176,70,0.18)" filter="url(#robot-led-halo)">
            <animate
              attributeName="r"
              values="7.2;9.4;7.2"
              dur="2.4s"
              begin="-0.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="opacity"
              values="0.16;0.36;0.16"
              dur="2.4s"
              begin="-0.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </circle>
          <circle cx="413" cy="276" r="3.4" fill="rgba(255,244,226,0.95)">
            <animate
              attributeName="opacity"
              values="0.46;1;0.46"
              dur="2.4s"
              begin="-0.68s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="r"
              values="3.1;3.8;3.1"
              dur="2.4s"
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
              values="0.32;0.84;0.32"
              dur="2.4s"
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
