'use client';

type RobotHeroLightProps = {
  className?: string;
};

export default function RobotHeroLight({ className = '' }: RobotHeroLightProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
    >
      <svg
        viewBox="0 0 1024 1338"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
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

        <g opacity="0.96">
          <path
            d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
            fill="none"
            stroke="rgba(255,180,56,0.1)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#robot-strip-core)"
          />
          <path
            d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
            fill="none"
            pathLength="1"
            stroke="rgba(255,176,38,1)"
            strokeWidth="12.5"
            strokeLinecap="round"
            strokeDasharray="0.33 1"
            filter="url(#robot-strip-glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0.34;0;-0.34"
              dur="1.45s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="opacity"
              values="0.18;1;0.18"
              dur="1.45s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.48;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </path>
          <path
            d="M425 128 C391 166 358 205 335 247 C315 283 304 324 301 364 C298 410 304 449 316 483"
            fill="none"
            pathLength="1"
            stroke="rgba(255,250,236,1)"
            strokeWidth="5.8"
            strokeLinecap="round"
            strokeDasharray="0.2 1.02"
            filter="url(#robot-strip-core)"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0.26;0;-0.26"
              dur="1.45s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="opacity"
              values="0.14;0.98;0.14"
              dur="1.45s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </path>
        </g>

        <g opacity="0.95">
          <circle cx="413" cy="276" r="8" fill="rgba(255,176,70,0.18)" filter="url(#robot-led-halo)">
            <animate
              attributeName="r"
              values="7.2;10.4;7.2"
              dur="1.55s"
              begin="0.3s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="opacity"
              values="0.18;0.42;0.18"
              dur="1.55s"
              begin="0.3s"
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
              dur="1.55s"
              begin="0.08s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate
              attributeName="r"
              values="3;4;3"
              dur="1.55s"
              begin="0.08s"
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
              dur="1.55s"
              begin="0.18s"
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
