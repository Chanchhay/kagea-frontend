'use client';

import { jobCategoryRows } from './data';
import { CheckIcon, SearchIcon, UploadIcon, UserPlusIcon } from './icons';
import { Globe3D } from './shared/3d-globe';
import type { GlobeMarker } from './shared/3d-globe';

/* ------------------------------------------------------------------ */
/*  Globe markers — world cities with avatar images                    */
/* ------------------------------------------------------------------ */
const globeMarkers: GlobeMarker[] = [
  {
    lat: 11.5564,
    lng: 104.9282,
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    label: 'Phnom Penh',
  },
  {
    lat: 13.3633,
    lng: 103.8564,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    label: 'Siem Reap',
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    label: 'Singapore',
  },
  {
    lat: 13.7563,
    lng: 100.5018,
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    label: 'Bangkok',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    label: 'Tokyo',
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    label: 'Seoul',
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    label: 'London',
  },
  {
    lat: 40.7128,
    lng: -74.006,
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    label: 'New York',
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    label: 'Sydney',
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    label: 'Dubai',
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    label: 'Paris',
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    label: 'New Delhi',
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    label: 'Shanghai',
  },
];

export default function JobDiscoverySection() {
  const [jobCategoriesRow1, jobCategoriesRow2, jobCategoriesRow3] = jobCategoryRows;

  return (
    <>
      {/* POPULAR JOBS IN CAMBODIA */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 sm:py-12">
        <h2 data-reveal className="mb-10 sm:mb-12 text-center text-3xl font-extrabold sm:text-4xl lg:text-5xl text-[#F3BE00] font-['Inter',sans-serif] tracking-tight">
          Popular jobs in Cambodia
        </h2>

        <div data-stagger className="flex flex-col items-center gap-4 sm:gap-5">
          {[jobCategoriesRow1, jobCategoriesRow2, jobCategoriesRow3].map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-4.5">
              {row.map((title) => (
                <button
                  key={title}
                  className="rounded-xl sm:rounded-2xl bg-[#008A1E] px-6 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base lg:text-[17px] font-semibold text-white font-['Inter',sans-serif] transition hover:-translate-y-0.5 hover:bg-[#007018] hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* HOW FIND WORK */}
      <section className="w-full py-12 sm:py-16 transition-colors">
        <style>{`
          @keyframes kgDashFlow {
            from { stroke-dashoffset: 24; }
            to   { stroke-dashoffset: 0; }
          }
          .kg-animated-dash {
            stroke-dasharray: 6 6;
            animation: kgDashFlow 1.2s linear infinite;
          }
        `}</style>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 data-reveal className="mb-14 text-center text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            How Find work
          </h2>

          <div data-stagger className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {/* Dashed connector lines (desktop only) */}
            <div className="pointer-events-none absolute left-0 right-0 top-12 hidden lg:block z-0">
              <svg className="h-16 w-full" viewBox="0 0 1000 60" fill="none">
                <path className="kg-animated-dash" d="M 170 30 Q 280 0 380 30" stroke="#008A1E" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path className="kg-animated-dash" d="M 420 30 Q 530 60 630 30" stroke="#008A1E" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path className="kg-animated-dash" d="M 670 30 Q 780 0 880 30" stroke="#008A1E" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Step 1: Create account */}
            <div className="group relative z-10 flex flex-col items-center rounded-3xl p-6 text-center bg-white/50 dark:bg-slate-800/40 backdrop-blur-xs border border-amber-200/60 dark:border-slate-700/40 shadow-xs transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-[#008A1E]/30 dark:border-emerald-700/50 shadow-md ring-4 ring-emerald-500/10 group-hover:bg-[#008A1E] group-hover:border-[#008A1E] group-hover:ring-8 group-hover:ring-[#008A1E]/20 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <UserPlusIcon className="h-7 w-7 text-[#008A1E] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create account</h3>
              <p className="mt-2 max-w-[220px] text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Aliquam facilisis egestas sapien, nec tempor leo tristique at.
              </p>
            </div>

            {/* Step 2: Upload CV */}
            <div className="group relative z-10 flex flex-col items-center rounded-3xl p-6 text-center bg-white/50 dark:bg-slate-800/40 backdrop-blur-xs border border-amber-200/60 dark:border-slate-700/40 shadow-xs transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-[#008A1E]/30 dark:border-emerald-700/50 shadow-md ring-4 ring-emerald-500/10 group-hover:bg-[#008A1E] group-hover:border-[#008A1E] group-hover:ring-8 group-hover:ring-[#008A1E]/20 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <UploadIcon className="h-7 w-7 text-[#008A1E] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload CV/Resume</h3>
              <p className="mt-2 max-w-[220px] text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.
              </p>
            </div>

            {/* Step 3: Find suitable job */}
            <div className="group relative z-10 flex flex-col items-center rounded-3xl p-6 text-center bg-white/50 dark:bg-slate-800/40 backdrop-blur-xs border border-amber-200/60 dark:border-slate-700/40 shadow-xs transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-[#008A1E]/30 dark:border-emerald-700/50 shadow-md ring-4 ring-emerald-500/10 group-hover:bg-[#008A1E] group-hover:border-[#008A1E] group-hover:ring-8 group-hover:ring-[#008A1E]/20 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <SearchIcon className="h-7 w-7 text-[#008A1E] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Find suitable job</h3>
              <p className="mt-2 max-w-[220px] text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Phasellus quis eleifend ex. Morbi nec fringilla nibh.
              </p>
            </div>

            {/* Step 4: Apply job */}
            <div className="group relative z-10 flex flex-col items-center rounded-3xl p-6 text-center bg-white/50 dark:bg-slate-800/40 backdrop-blur-xs border border-amber-200/60 dark:border-slate-700/40 shadow-xs transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-[#008A1E]/30 dark:border-emerald-700/50 shadow-md ring-4 ring-emerald-500/10 group-hover:bg-[#008A1E] group-hover:border-[#008A1E] group-hover:ring-8 group-hover:ring-[#008A1E]/20 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <CheckIcon className="h-7 w-7 text-[#008A1E] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply job</h3>
              <p className="mt-2 max-w-[220px] text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales purus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRIES FOR JOB SEEKERS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
        <div className="mb-6 text-center lg:text-left">
          <span className="text-2xl font-extrabold text-[#008A1E]">Countries for Job Seekers</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start space-y-6">
            <h2 data-reveal className="text-3xl font-extrabold leading-tight text-[#008A1E] sm:text-4xl lg:text-5xl">
              So Many People Are <span className="text-[#F3BE00]">Engaged</span> All Over The World
            </h2>

            <p data-reveal className="max-w-lg text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-sm">
              A Land Of Opportunity With A Diverse Job Market And A Wide Range Of Industries Offering
              Countless Career Paths.
            </p>

            <button data-reveal className="mt-4 rounded-xl bg-[#F3BE00] px-8 py-3.5 text-xs font-extrabold text-[#008A1E] shadow-sm transition hover:bg-[#e2af00] active:scale-[0.98]">
              Post A Job
            </button>
          </div>

          {/* ---------- 3D Globe ---------- */}
          <div data-reveal data-parallax="20" className="relative w-full">
            <Globe3D
              markers={globeMarkers}
              className="h-[450px] sm:h-[500px] lg:h-[550px]"
              config={{
                atmosphereColor: '#008A1E',
                atmosphereIntensity: 20,
                showAtmosphere: true,
                atmosphereBlur: 3,
                bumpScale: 5,
                autoRotateSpeed: 0.3,
                enableZoom: false,
                enablePan: false,
              }}
              onMarkerClick={(marker) => {
                console.log('Clicked marker:', marker.label);
              }}
              onMarkerHover={(marker) => {
                if (marker) {
                  console.log('Hovering:', marker.label);
                }
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
