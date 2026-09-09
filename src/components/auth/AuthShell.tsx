import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

/**
 * A brand panel and the form, side by side above `lg` and form-only below it —
 * on a phone the panel would push the only thing on the page that does
 * anything below the fold.
 *
 * <p>The page scrolls normally. It used to pin itself to `h-dvh` with
 * `overflow-hidden` and scroll the form column inside that, which wrapped a
 * nine-field form in a second scrollbar on any laptop screen.
 *
 * <p>The panel is one illustration under one scrim. It previously carried five
 * absolutely-positioned rings and glows, three stacked radial gradients on the
 * panel, another three on the page behind it, and two scrims — roughly a dozen
 * layers, all in bespoke hexes, to produce a background. Tokens do the same job
 * here and follow the theme instead of pinning their own colours.
 */
export function AuthShell({
  title,
  description,
  children,
  className,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh bg-canvas">
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl lg:min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]",
          className,
        )}
      >
        <aside className="relative hidden overflow-hidden bg-brand-wash p-10 lg:flex lg:flex-col lg:justify-between dark:bg-surface">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/images/login-illustration.png?v=2026-08-20-2"
              alt=""
              aria-hidden="true"
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 45vw, 0px"
              className="object-cover object-[62%_22%] dark:brightness-[.9]"
            />
            {/*
              * One scrim, built from the panel's own fill so it reads as the
              * panel fading in rather than a grey wash on top. It keeps the
              * copy column legible over the artwork; the figure sits in the
              * clear half on the right.
              */}
            <div className="absolute inset-0 bg-linear-to-r from-brand-wash via-brand-wash/85 to-transparent dark:from-surface dark:via-surface/85" />
          </div>

          <Link href="/" className="relative z-10 w-fit">
            <BrandLogo height={36} priority />
          </Link>

          <div className="relative z-10 max-w-[18rem]">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-heading">
              <span className="block">Your future.</span>
              <span className="block">
                <span className="text-brand">AI</span>-powered.
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Create your account and unlock smarter career opportunities.
            </p>
          </div>

          <div className="relative z-10 max-w-[20rem] space-y-3">
            <p className="flex items-start gap-2.5 text-sm leading-relaxed text-body">
              <span className="mt-px flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <ShieldCheck aria-hidden="true" className="size-4" />
              </span>
              Secure access to public opportunities, personalized career tools,
              and recruiter workflows.
            </p>
            <p className="text-xs text-muted-fg">
              &copy; 2026 Kagea. All rights reserved.
            </p>
          </div>
        </aside>

        <section className="flex flex-col justify-center bg-surface px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="mb-8 inline-block lg:hidden">
              <BrandLogo height={32} priority />
            </Link>

            <span className="type-eyebrow inline-flex items-center gap-1.5 text-brand">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Secure access
            </span>

            <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
              {title}
            </h1>
            <p className="type-description mt-2">{description}</p>

            <div className="mt-7">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
