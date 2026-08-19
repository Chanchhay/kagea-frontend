import { GlobeBackground } from './shared/GlobeBackground';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white font-sans text-slate-900">
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-16">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-emerald-200 bg-white/80 px-3 py-1.5 text-lg font-bold tracking-wider text-emerald-700 shadow-sm backdrop-blur-sm">
            LOGOTIPUM
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
          <a href="#" className="transition hover:text-emerald-700">
            Home
          </a>
          <a href="#" className="transition hover:text-emerald-700">
            Services
          </a>
          <a href="#" className="transition hover:text-emerald-700">
            Reviews
          </a>
          <a href="#" className="transition hover:text-emerald-700">
            Contact us
          </a>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button className="hidden transition hover:text-emerald-700 sm:block">
            Sign In
          </button>
          <button className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
            Get Started
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-16 sm:pt-20">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <div className="h-[720px] w-[720px] max-w-[115vw] opacity-45">
              <GlobeBackground
                className="h-full w-full"
                color="#bfd9fb"
                rotationSpeed={0.00035}
                enableParallax={false}
                scale={4.05}
                latLines={18}
                lonLines={24}
                enableDots
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-28 z-0 flex justify-center">
            <div className="h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
          </div>

          <div className="relative z-20 flex min-h-[32rem] flex-col items-center justify-center text-center">
            <div className="max-w-4xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Automate repetitive.
            <br />
            <span className="font-serif font-normal italic text-amber-500">
              Focus on growth.
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            The next-generation AI agent platform that handles lead generation,
            customer support, and data entry while you build.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700">
              Get Started Free
            </button>
            <button className="rounded-xl border border-slate-200 bg-white/85 px-6 py-3 font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white">
              Watch 2min Demo
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-5xl translate-y-12 px-4 sm:translate-y-16">
        <div className="rounded-t-2xl border border-slate-200 bg-white/88 p-4 text-left shadow-2xl backdrop-blur-md sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">
                Finlytic
              </span>
              <span className="ml-4 text-xs text-slate-500">
                Dashboard Overview
              </span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
              Search anything...
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-500 sm:text-sm">
            <div className="pb-1 font-medium text-slate-700">
              Recent Activity Logs
            </div>
            <div className="grid grid-cols-4 gap-2 border-b border-slate-100 py-2 text-slate-400">
              <span>Timestamp</span>
              <span>Status</span>
              <span>Source</span>
              <span>Data Rate</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-2 py-1">
              <span className="text-slate-700">2025-05-03 10:24</span>
              <span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-700">
                  In Queue
                </span>
              </span>
              <span>CRM</span>
              <span className="text-slate-700">$347.09</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-2 py-1">
              <span className="text-slate-700">2025-05-02 18:50</span>
              <span>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700">
                  Processed
                </span>
              </span>
              <span>Traffic Event</span>
              <span className="text-slate-700">Web Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
