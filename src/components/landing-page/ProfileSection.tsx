'use client';

import { useEffect, useRef, useState } from 'react';
import type { SVGProps } from 'react';

/* ------------------------------------------------------------------ */
/*  Geometry — tweak these constants to nudge the whole diagram        */
/* ------------------------------------------------------------------ */
const W = 596;          // artboard width  (viewBox)
const H = 530;          // artboard height (viewBox)
const CX = 298;         // centre x
const CY = 265;         // centre y
const RING_R = 101;     // centre-line radius of the yellow ring
const RING_W = 18;      // yellow ring thickness
const INNER_R = 75;     // thin green outline circle
const DOT_R = 7.5;      // green node dots
const ELBOW_R = 150;    // where the connector bends into the underline

const GREEN = '#00921A';
const DEEP = '#008A1E';
const YELLOW = '#F3BE00';
const roundCoord = (value: number) => Number(value.toFixed(4));
const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: roundCoord(CX + r * Math.cos(rad)),
    y: roundCoord(CY - r * Math.sin(rad)),
  };
};
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const SkillsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
  </svg>
);

const NetworkingIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);

const ExperienceIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />
  </svg>
);

const ProjectsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const PortfolioIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const LanguagesIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </svg>
);

const EducationIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c3 2.8 9 2.8 12 0v-5" />
  </svg>
);

const AchievementsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 3h12v6a6 6 0 0 1-12 0V3ZM9 21h6M12 15v6" />
  </svg>
);

const PublicationsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);

const GoalsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Nodes — angle is in degrees, 90 = top, counter-clockwise           */
/* ------------------------------------------------------------------ */
type Side = 'top' | 'bottom' | 'left' | 'right';

const NODES: {
  id: string;
  label: string;
  angle: number;
  side: Side;
  Icon: (p: IconProps) => React.ReactNode;
}[] = [
  { id: 'skills', label: 'SKILLS', angle: 90, side: 'top', Icon: SkillsIcon },
  { id: 'experience', label: 'EXPERIENCE', angle: 60, side: 'right', Icon: ExperienceIcon },
  { id: 'portfolio', label: 'PORTFOLIO', angle: 20, side: 'right', Icon: PortfolioIcon },
  { id: 'education', label: 'EDUCATION', angle: 340, side: 'right', Icon: EducationIcon },
  { id: 'publications', label: 'PUBLICATIONS', angle: 300, side: 'right', Icon: PublicationsIcon },
  { id: 'goals', label: 'GOALS', angle: 270, side: 'bottom', Icon: GoalsIcon },
  { id: 'achievements', label: 'ACHIEVEMENTS', angle: 240, side: 'left', Icon: AchievementsIcon },
  { id: 'languages', label: 'LANGUAGES', angle: 200, side: 'left', Icon: LanguagesIcon },
  { id: 'projects', label: 'PROJECTS', angle: 160, side: 'left', Icon: ProjectsIcon },
  { id: 'networking', label: 'NETWORKING', angle: 120, side: 'left', Icon: NetworkingIcon },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
/* clockwise order from the top — drives entrance stagger + sweep sync */
const CW = [...NODES].sort(
  (a, b) => ((90 - a.angle + 360) % 360) - ((90 - b.angle + 360) % 360),
);
const cwIndex = (id: string) => CW.findIndex((n) => n.id === id);
const cwFraction = (angle: number) => ((90 - angle + 360) % 360) / 360;

const CIRC = 2 * Math.PI * RING_R; // ring circumference
const SWEEP = 9;                   // seconds for one full sweep

function ProfileWheel() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className={`kg-wheel relative aspect-[596/530] w-full max-w-[596px] select-none rounded-[28px] border border-transparent dark:border-slate-800/80 ${
        inView ? 'is-in' : ''
      }`}
      onMouseLeave={() => setActive(null)}
    >
      <style>{`
        .kg-wheel .kg-ring   { stroke-dasharray: ${CIRC}; }
        .kg-wheel .kg-dot    { transform-box: fill-box; transform-origin: center; }
        .kg-wheel .kg-pulse  { transform-box: fill-box; transform-origin: center; opacity: 0; }
        .kg-wheel .kg-spin   { transform-box: view-box; transform-origin: ${CX}px ${CY}px; }
        .kg-wheel .kg-core   { transform-box: fill-box; transform-origin: center; }

        @media (prefers-reduced-motion: no-preference) {
          .kg-wheel .kg-ring   { stroke-dashoffset: ${CIRC}; }
          .kg-wheel .kg-dot    { transform: scale(0); }
          .kg-wheel .kg-stem   { opacity: 0; }
          .kg-wheel .kg-label  { opacity: 0; transform: translateY(8px); }
          .kg-wheel .kg-inner,
          .kg-wheel .kg-core   { transform: scale(0); }
          .kg-wheel .kg-sweep  { opacity: 0; }

          .kg-wheel.is-in .kg-ring {
            animation: kg-draw 1.3s cubic-bezier(.65,0,.35,1) forwards;
          }
          .kg-wheel.is-in .kg-inner {
            animation: kg-pop .7s cubic-bezier(.34,1.4,.64,1) .55s forwards;
          }
          .kg-wheel.is-in .kg-core {
            animation: kg-pop .7s cubic-bezier(.34,1.6,.64,1) .75s forwards,
                       kg-breathe 4.5s ease-in-out 1.6s infinite;
          }
          .kg-wheel.is-in .kg-dot {
            animation: kg-pop .5s cubic-bezier(.34,1.6,.64,1) forwards;
          }
          .kg-wheel.is-in .kg-stem {
            animation: kg-in .5s ease-out forwards;
          }
          .kg-wheel.is-in .kg-label {
            animation: kg-in .55s cubic-bezier(.22,1,.36,1) forwards;
          }
          .kg-wheel.is-in .kg-sweep {
            animation: kg-fade .6s ease-out 1.3s forwards,
                       kg-spin ${SWEEP}s linear 1.3s infinite;
          }
          .kg-wheel.is-in .kg-pulse {
            animation: kg-ping ${SWEEP}s linear 1.3s infinite;
          }
        }

        @keyframes kg-draw   { to { stroke-dashoffset: 0; } }
        @keyframes kg-pop    { to { transform: scale(1); } }
        @keyframes kg-in     { to { opacity: 1; transform: translateY(0); } }
        @keyframes kg-fade   { to { opacity: 1; } }
        @keyframes kg-spin   { from { transform: rotate(-90deg); } to { transform: rotate(270deg); } }
        @keyframes kg-breathe{ 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes kg-ping {
          0%   { transform: scale(1);   opacity: .5; }
          9%   { transform: scale(2.8); opacity: 0; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `}</style>

      {/* ---------- vector layer ---------- */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* connector stems (drawn first so the ring covers their inner tip) */}
        {NODES.map(({ id, angle }) => {
          const d = polar(angle, RING_R);
          const e = polar(angle, ELBOW_R);
          const on = active === id;
          return (
            <line
              key={`line-${id}`}
              className="kg-stem"
              x1={d.x}
              y1={d.y}
              x2={e.x}
              y2={e.y}
              stroke={DEEP}
              strokeWidth={on ? 2.5 : 1.5}
              strokeLinecap="round"
              style={{
                animationDelay: `${0.5 + cwIndex(id) * 0.07}s`,
                transition: 'stroke-width .2s ease',
              }}
            />
          );
        })}

        {/* yellow ring — draws itself on scroll */}
        <circle
          className="kg-ring"
          cx={CX}
          cy={CY}
          r={RING_R}
          fill="none"
          stroke={YELLOW}
          strokeWidth={RING_W}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
        />

        {/* signature: a light sweep travelling around the ring */}
        <g className="kg-spin kg-sweep">
          <circle
            cx={CX}
            cy={CY}
            r={RING_R}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.6}
            strokeWidth={RING_W - 3}
            strokeLinecap="round"
            strokeDasharray={`${CIRC * 0.1} ${CIRC}`}
          />
        </g>

        {/* thin inner outline */}
        <circle
          className="kg-inner"
          cx={CX}
          cy={CY}
          r={INNER_R}
          fill="none"
          stroke={DEEP}
          strokeWidth={1.5}
          style={{ transformBox: 'view-box', transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* node dots + their sweep pulse */}
        {NODES.map(({ id, angle }) => {
          const d = polar(angle, RING_R);
          const on = active === id;
          return (
            <g key={`dot-${id}`}>
              <circle
                className="kg-pulse"
                cx={d.x}
                cy={d.y}
                r={DOT_R}
                fill="none"
                stroke={GREEN}
                strokeWidth={2}
                style={{ animationDelay: `${1.3 + cwFraction(angle) * SWEEP}s` }}
              />
              <circle
                className="kg-dot cursor-pointer"
                cx={d.x}
                cy={d.y}
                r={on ? DOT_R * 1.45 : DOT_R}
                fill={GREEN}
                onMouseEnter={() => setActive(id)}
                style={{
                  animationDelay: `${0.45 + cwIndex(id) * 0.07}s`,
                  transition: 'r .2s cubic-bezier(.34,1.6,.64,1)',
                }}
              />
            </g>
          );
        })}

        {/* centre mark */}
        <g className="kg-core">
          <circle cx={CX - 13} cy={CY} r={22} fill={GREEN} />
          <circle cx={CX + 14} cy={CY} r={22} fill={GREEN} />
          <circle cx={CX + 14} cy={CY} r={10.5} fill="#ffffff" />
        </g>
      </svg>

      {/* ---------- label layer (HTML so the underline hugs the text) ---------- */}
      {NODES.map(({ id, label, angle, side, Icon }) => {
        const e = polar(angle, ELBOW_R);
        const on = active === id;
        const delay = `${0.55 + cwIndex(id) * 0.07}s`;

        const text = (
          <span className="text-[10px] font-extrabold tracking-wide sm:text-[13px]">{label}</span>
        );
        const icon = <Icon className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />;

        if (side === 'top' || side === 'bottom') {
          return (
            <div
              key={id}
              className="absolute"
              style={{
                left: pct(e.x, W),
                top: pct(side === 'top' ? e.y - 6 : e.y + 6, H),
                transform: `translate(-50%, ${side === 'top' ? '-100%' : '0'})`,
              }}
            >
              <div
                className="kg-label flex cursor-pointer items-center gap-1.5 whitespace-nowrap"
                style={{ color: DEEP, animationDelay: delay, opacity: on ? 1 : undefined }}
                onMouseEnter={() => setActive(id)}
              >
                {icon}
                {text}
              </div>
            </div>
          );
        }

        const isLeft = side === 'left';
        return (
          <div
            key={id}
            className="absolute"
            style={{
              top: pct(e.y, H),
              transform: 'translateY(-100%)',
              ...(isLeft ? { right: pct(W - e.x, W) } : { left: pct(e.x, W) }),
            }}
          >
            <div
              className="kg-label flex cursor-pointer items-center gap-1.5 whitespace-nowrap pb-1"
              style={{
                color: DEEP,
                borderBottom: `${on ? 2.5 : 1.5}px solid ${DEEP}`,
                animationDelay: delay,
                transition: 'border-bottom-width .2s ease',
              }}
              onMouseEnter={() => setActive(id)}
            >
              {isLeft ? (
                <>
                  {icon}
                  {text}
                </>
              ) : (
                <>
                  {text}
                  {icon}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CandidateProfileSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* left — the wheel */}
        <div className="flex justify-center lg:justify-start">
          <ProfileWheel />
        </div>

        {/* right — the copy */}
        <div className="max-w-xl">
          <span
            className="inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold bg-[#E9F6E9] text-[#008A1E] dark:bg-slate-800 dark:text-emerald-400"
          >
            Profile
          </span>

          <h2
            className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]"
            style={{ color: YELLOW }}
          >
            Be the candidate employers are looking for
          </h2>

          <p className="mt-6 text-base leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400">
            Create a comprehensive profile and start receiving interview invites and job offers
            that align with your unique skills.
          </p>
          <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400">
            Don&rsquo;t miss out on your dream job&mdash;get started today and make your profile
            stand out.
          </p>

          <button
            type="button"
            className="mt-8 rounded-lg px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: DEEP }}
          >
            Create now
          </button>
        </div>
      </div>
    </section>
  );
}
