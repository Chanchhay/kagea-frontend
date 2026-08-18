'use client';

import Image from 'next/image';

const innerOrbitUsers = [
  {
    id: 1,
    src: '/images/avatar/kanhchana.jpg',
    alt: 'Khan Kanhchana',
    posClass: 'top-0 left-1/2 -translate-x-[27.5px] -translate-y-[27.5px]',
  },
  {
    id: 2,
    src: '/images/avatar/lina.jpg',
    alt: 'Lut Lina',
    posClass: 'bottom-[15%] left-[5%] -translate-x-[27.5px] translate-y-[27.5px]',
  },
  {
    id: 3,
    src: '/images/avatar/bunlong.jpg',
    alt: 'Heang BunLong',
    posClass: 'bottom-[15%] right-[5%] translate-x-[27.5px] translate-y-[27.5px]',
  },
];

const outerOrbitUsers = [
  {
    id: 4,
    src: '/images/avatar/fary.jpg',
    alt: 'Man Tolfary',
    posClass: 'top-[15%] left-[15%] -translate-x-[27.5px] -translate-y-[27.5px]',
  },
  {
    id: 5,
    src: '/images/avatar/samrach.jpg',
    alt: 'Sithon Somrach',
    posClass: 'top-[15%] right-[15%] translate-x-[27.5px] -translate-y-[27.5px]',
  },
  {
    id: 6,
    src: '/images/avatar/phakley.jpg',
    alt: 'Pech PhakLey',
    posClass: 'bottom-[15%] left-[15%] -translate-x-[27.5px] translate-y-[27.5px]',
  },
  {
    id: 7,
    src: '/images/avatar/chanchhay.jpg',
    alt: 'Srey ChanChhay ',
    posClass: 'bottom-[15%] right-[15%] translate-x-[27.5px] translate-y-[27.5px]',
  },
];

export default function CommunityOrbit() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center bg-transparent">
      <div
        className="relative flex h-[420px] w-[420px] items-center justify-center overflow-hidden sm:h-[520px] sm:w-[520px] lg:h-[600px] lg:w-[600px]"
        style={{ perspective: '1200px' }}
      >
        <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full bg-[#F3BE00]/8 blur-[120px] dark:bg-[#F3BE00]/10 sm:h-[320px] sm:w-[320px]" />

        <div className="animate-float absolute z-50 h-24 w-24 overflow-hidden rounded-full border-[2.5px] border-[#F3BE00] shadow-[0_0_28px_rgba(243,190,0,0.24)] dark:border-[#F3BE00] dark:shadow-[0_0_40px_rgba(243,190,0,0.45)]">
          <Image
            src="/images/avatar/chhaya.jpg"
            alt="Srey ChanChhay"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div className="container-3d absolute flex h-full w-full items-center justify-center transition-transform duration-500">
          <div
            className="animate-orbit-ccw group absolute h-[240px] w-[240px] rounded-full border-[1.5px] border-dashed border-[#EAB308]/40 dark:border-[#F3BE00]/40 sm:h-[300px] sm:w-[300px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {innerOrbitUsers.map((user) => (
              <div key={user.id} className={`avatar-wrapper absolute ${user.posClass}`}>
                <Image src={user.src} alt={user.alt} fill sizes="55px" className="object-cover" />
              </div>
            ))}
          </div>

          <div
            className="animate-orbit-cw group absolute h-[420px] w-[420px] rounded-full border-[1.5px] border-dashed border-[#EAB308]/28 dark:border-[#F3BE00]/20 sm:h-[520px] sm:w-[520px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {outerOrbitUsers.map((user) => (
              <div key={user.id} className={`avatar-wrapper absolute ${user.posClass}`}>
                <Image src={user.src} alt={user.alt} fill sizes="55px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container-3d {
          transform: rotateX(60deg) rotateY(-10deg);
          transform-style: preserve-3d;
        }

        @keyframes orbit-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes counteract-3d-cw {
          from { transform: rotate(0deg) rotateY(10deg) rotateX(-60deg); }
          to { transform: rotate(-360deg) rotateY(10deg) rotateX(-60deg); }
        }

        @keyframes counteract-3d-ccw {
          from { transform: rotate(-360deg) rotateY(10deg) rotateX(-60deg); }
          to { transform: rotate(0deg) rotateY(10deg) rotateX(-60deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .animate-orbit-cw { animation: orbit-clockwise 45s linear infinite; }
        .animate-orbit-ccw { animation: orbit-counter 30s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }

        .animate-orbit-cw:hover,
        .animate-orbit-ccw:hover,
        .animate-orbit-cw:hover .avatar-wrapper,
        .animate-orbit-ccw:hover .avatar-wrapper {
          animation-play-state: paused;
        }

        .avatar-wrapper {
          width: 55px;
          height: 55px;
          border-radius: 9999px;
          border: 2.5px solid rgba(234, 179, 8, 0.92);
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.88);
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.14);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        :global(.dark) .avatar-wrapper {
          background-color: #0b0f19;
          border-color: #facc15;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .avatar-wrapper:hover {
          border-color: #ffffff;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }

        .animate-orbit-cw .avatar-wrapper { animation: counteract-3d-cw 45s linear infinite; }
        .animate-orbit-ccw .avatar-wrapper { animation: counteract-3d-ccw 30s linear infinite; }
      `}</style>
    </div>
  );
}
