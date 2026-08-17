export default function DecorativeBackground() {
  return (
    <>
      {/* Left wavy teal/cyan line */}
      <div className="pointer-events-none absolute left-0 top-24 hidden lg:block">
        <svg width="260" height="260" viewBox="0 0 260 260" fill="none" aria-hidden="true">
          <path
            d="M-20,30 C30,10 50,80 80,120 C110,160 90,200 130,220 C170,240 200,180 240,200"
            stroke="#4DD0E1"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Right wavy green line */}
      <div className="pointer-events-none absolute right-0 top-10 hidden lg:block">
        <svg width="220" height="280" viewBox="0 0 220 280" fill="none" aria-hidden="true">
          <path
            d="M240,30 C180,20 200,80 170,120 C140,160 190,180 160,220 C130,260 100,240 80,270"
            stroke="#34D399"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Subtle dot pattern behind hero */}
      <div className="pointer-events-none absolute left-1/2 top-40 -translate-x-1/2 hidden lg:block opacity-[0.03]">
        <div className="h-96 w-96 rounded-full bg-[#008A1E]" />
      </div>
    </>
  );
}
