export default function DecorativeBackground() {
  return (
    <>
      {/* Left wavy teal/cyan line */}
      <div className="pointer-events-none absolute left-0 top-24 hidden lg:block">
        <svg width="260" height="260" viewBox="0 0 260 260" fill="none" aria-hidden="true">
          <path
            d="M-20,30 C30,10 50,80 80,120 C110,160 90,200 130,220 C170,240 200,180 240,200"
            stroke="#67E8F9"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="16 13"
            opacity="0.35"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="58"
              dur="3.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.24;0.58;0.24"
              dur="2.9s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M-20,30 C30,10 50,80 80,120 C110,160 90,200 130,220 C170,240 200,180 240,200"
            stroke="#22D3EE"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 24"
            opacity="0.9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="84"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.35;0.95;0.35"
              dur="2.1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Right wavy green line */}
      <div className="pointer-events-none absolute right-0 top-10 hidden lg:block">
        <svg width="220" height="280" viewBox="0 0 220 280" fill="none" aria-hidden="true">
          <path
            d="M240,30 C180,20 200,80 170,120 C140,160 190,180 160,220 C130,260 100,240 80,270"
            stroke="#34D399"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="16 13"
            opacity="0.42"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-58"
              dur="3.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.26;0.64;0.26"
              dur="2.9s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M240,30 C180,20 200,80 170,120 C140,160 190,180 160,220 C130,260 100,240 80,270"
            stroke="#6EE7B7"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 24"
            opacity="0.95"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-86"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2.1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Subtle dot pattern behind hero */}
      <div className="pointer-events-none absolute left-1/2 top-40 -translate-x-1/2 hidden lg:block opacity-[0.03]">
        <div className="h-96 w-96 rounded-full bg-[#008A1E]" />
      </div>
    </>
  );
}
