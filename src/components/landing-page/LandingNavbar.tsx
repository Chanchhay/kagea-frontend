'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const navItems = [
  { href: '/find-job', label: 'Find Job' },
  { href: '/post-job', label: 'Post Job' },
  { href: '/about-us', label: 'About Us' },
];

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="KaWork Logo"
            width={80}
            height={80}
            priority
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
          />
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <select
            aria-label="Language"
            className="hidden rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-900 transition hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-600 sm:block"
            defaultValue="EN"
          >
            <option value="EN">EN</option>
            <option value="KM">Khmer</option>
          </select>

          <Link
            href="/auth/login"
            className="hidden rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700 sm:inline-block"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
