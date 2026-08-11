import Image from 'next/image';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="space-y-2">
            <div className="w-fit bg-white dark:bg-slate-900">
              <Image
                src="/images/logo.png"
                alt="KaWork Logo"
                width={160}
                height={96}
                className="h-24 w-40 object-contain"
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Empowering learners through innovative education and technology. Providing
              the latest methodology with high-quality training and mentoring.
            </p>
          </div>

          <div>
            <p className="mb-4 text-base font-semibold text-green-600">Follow us</p>
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <span className="font-medium">Customer Service:</span> +855-81697501
              </p>
              <p>
                <span className="font-medium">Working Hours:</span> 08:30 - 18:00
              </p>
              <p>No. 24, Street 562, Sangkat Kak I, Khan Toul Kork, Phnom Penh.</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-base font-semibold text-green-600">Explore</p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>
                <Link href="/" className="transition hover:text-green-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-job" className="transition hover:text-green-600">
                  Find Job
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="transition hover:text-green-600">
                  Post Job
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="transition hover:text-green-600">
                  About us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-base font-semibold text-green-600">Sponsor and Organize</p>
            <div className="mt-2">
              <Image
                src="/images/istad.png"
                alt="ISTAD Logo"
                width={160}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Copyright 2026 KaWork | Sponsored and organized by ISTAD
          </p>
        </div>
      </div>
    </footer>
  );
}
