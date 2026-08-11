import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between text-white font-sans">
      {/* Background Globe Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/purple-moon-bg.png"
          alt="Purple Planet Background"
          fill
          priority
          className="object-cover object-center scale-105"
        />
      </div>

      {/* Subtle Overlay for Contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Header / Navbar */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-wider bg-neutral-900/80 px-3 py-1.5 rounded-md border border-neutral-800">
            LOGOTIPUM
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition flex items-center gap-1">Services ▾</a>
          <a href="#" className="hover:text-white transition">Reviews</a>
          <a href="#" className="hover:text-white transition">Contact us</a>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button className="hidden sm:block hover:text-gray-300 transition">Sign In</button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition shadow-lg shadow-purple-900/50">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Main Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-8 mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          Automate repetitive. <br />
          <span className="italic font-normal font-serif text-purple-200">Focus on growth.</span>
        </h1>
        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
          The next-generation AI agent platform that handles lead generation, customer support, and data entry while you build.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-lg shadow-purple-900/50">
            Get Started Free
          </button>
          <button className="px-6 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-white font-medium rounded-xl border border-neutral-700 transition">
            Watch 2min Demo
          </button>
        </div>
      </div>

      {/* Dashboard Preview Card overlapping the bottom */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-4 transform translate-y-12 sm:translate-y-16">
        <div className="bg-[#0b0c10]/90 backdrop-blur-md rounded-t-2xl border border-neutral-800 shadow-2xl p-4 sm:p-6 text-left">
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="font-semibold text-sm text-gray-200">Finlytic</span>
              <span className="text-xs text-neutral-500 ml-4">Dashboard Overview</span>
            </div>
            <div className="text-xs bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-gray-400">
              🔍 Search anything...
            </div>
          </div>

          {/* Dummy Table/Data Row Preview */}
          <div className="space-y-3 text-xs sm:text-sm text-gray-400">
            <div className="font-medium text-gray-300 pb-1">Recent Activity Logs</div>
            <div className="grid grid-cols-4 gap-2 py-2 border-b border-neutral-900 text-neutral-500">
              <span>Timestamp</span>
              <span>Status</span>
              <span>Source</span>
              <span>Data Rate</span>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center py-1">
              <span className="text-gray-300">2025-05-03 10:24</span>
              <span><span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs">In Queue</span></span>
              <span>CRM</span>
              <span className="text-gray-300">$347.09</span>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center py-1">
              <span className="text-gray-300">2025-05-02 18:50</span>
              <span><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-xs">Processed</span></span>
              <span>Traffic Event</span>
              <span className="text-gray-300">Web Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
