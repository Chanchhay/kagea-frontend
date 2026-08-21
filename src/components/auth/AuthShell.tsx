import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function AuthShell({
  title,
  description,
  children,
  className,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background px-3 py-3 sm:px-4 sm:py-4 lg:h-dvh lg:min-h-dvh lg:overflow-hidden lg:px-4 lg:py-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(43,201,94,.15),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(34,164,71,.08),transparent_26%),linear-gradient(180deg,#edf4ed_0%,#e4ece4_100%)] dark:bg-[radial-gradient(circle_at_12%_16%,rgba(43,201,94,.14),transparent_24%),radial-gradient(circle_at_76%_18%,rgba(62,240,123,.08),transparent_22%),linear-gradient(180deg,#06110c_0%,#030706_100%)]" />

      <div
        className={cn(
          "relative mx-auto overflow-hidden rounded-[30px]"
            + " border border-black/[.08] bg-surface shadow-[0_24px_64px_rgba(0,0,0,.10),0_1px_3px_rgba(0,0,0,.06)]"
            + " dark:border-white/12 dark:bg-[#0a1310] dark:shadow-[0_30px_90px_rgba(0,0,0,.55)]"
            + " lg:grid lg:h-[calc(100dvh-2rem)] lg:max-h-[calc(100dvh-2rem)] lg:max-w-[1460px] lg:grid-cols-[minmax(0,.45fr)_minmax(0,.55fr)]",
          className,
        )}
      >
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(96,220,140,.2),transparent_24%),radial-gradient(circle_at_76%_22%,rgba(34,164,71,.12),transparent_28%),linear-gradient(160deg,#f5fff8_0%,#e7f4ea_52%,#dbece0_100%)] text-[#102218] lg:flex lg:h-full lg:flex-col lg:overflow-hidden dark:bg-[radial-gradient(circle_at_60%_24%,rgba(52,223,114,.22),transparent_18%),linear-gradient(160deg,#020907_0%,#05110c_55%,#07130d_100%)] dark:text-white xl:px-10 px-9 py-7">
          {/*
            * Decorative rings and glow, light mode only: over the dark panel they
            * sat on top of the artwork and muddied it.
            */}
          <div className="pointer-events-none absolute z-[2] left-[56%] top-[5%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-[#43e77d]/18 dark:hidden" />
          <div className="pointer-events-none absolute z-[2] left-[56%] top-[-1%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-[#2ddc74]/8 dark:hidden" />
          <div className="pointer-events-none absolute z-[2] left-[56%] top-[16%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(57,255,136,.12),transparent_65%)] blur-2xl dark:hidden" />
          <div className="pointer-events-none absolute z-[2] bottom-[-16%] left-[-2%] h-[30rem] w-[30rem] rounded-full border border-[#34df72]/8 dark:hidden" />
          <div className="pointer-events-none absolute z-[2] bottom-[4%] left-[10%] h-[21rem] w-[21rem] rounded-full border border-[#34df72]/8 dark:hidden" />
          <Link href="/" className="relative z-10 w-fit">
            <Image
              src="/figma/brand-logo.png"
              alt="KAGEA"
              width={240}
              height={120}
              priority
              unoptimized
              className="h-auto w-[172px] object-contain object-left brightness-[.95] contrast-[1.02] xl:w-[190px] dark:brightness-[1.04]"
            />
          </Link>

          {/*
            * Full-bleed background for the panel. `object-cover` scales the
            * artwork past the panel on both axes, which is also what retires
            * the source PNG's hard bottom cut -- at this scale the cut falls
            * outside the panel entirely. The focal point is biased right and
            * high so the figure sits in the empty half, away from the copy.
            */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/login-illustration.png?v=2026-08-20-2"
              alt=""
              aria-hidden="true"
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 45vw, 0px"
              className="object-cover object-[62%_22%] brightness-[1.04] saturate-[1.02] dark:brightness-[.92]"
            />
          </div>

          {/*
            * Two scrims, both built from the panel gradient's own stops so they
            * read as the panel itself fading in rather than a grey wash laid on
            * top. The horizontal one keeps the copy column legible over the
            * artwork; the vertical one does the same for the footer.
            */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(100deg,#f3faf5_0%,rgba(243,250,245,.95)_28%,rgba(233,245,236,.66)_48%,rgba(226,240,230,.18)_68%,transparent_84%)] dark:bg-[linear-gradient(100deg,#020907_0%,rgba(2,9,7,.95)_28%,rgba(5,17,12,.66)_48%,rgba(7,19,13,.18)_68%,transparent_84%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[#dbece0] via-[#dbece0]/70 to-transparent dark:from-[#07130d] dark:via-[#07130d]/70" />

          {/* Copy column: flows above the artwork, inside the scrimmed half. */}
          <div className="relative z-10 mt-8 flex min-h-0 w-[21rem] flex-1 flex-col xl:w-[23rem]">
            <h2 className="text-[clamp(2.9rem,3.4vw,4rem)] font-semibold leading-[.95] tracking-[-0.055em] text-[#142217] dark:text-white">
              <span className="block">Your future.</span>
              <span className="mt-2 block">
                <span className="text-brand">AI</span>-powered.
              </span>
            </h2>
            <p className="mt-5 max-w-[19rem] text-[1rem] leading-7 text-[#375145] dark:text-white/78">
              Create your account and unlock smarter career opportunities.
            </p>
          </div>

          <div className="relative z-10 mt-4 w-[19rem] text-[#41584d] dark:text-white/72">
            <div className="flex items-start gap-2.5 text-[12px] leading-5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-2xl border border-[#3be172]/20 bg-white/60 text-[#199b43] dark:border-[#3be172]/30 dark:bg-white/5 dark:text-[#5ff08d]">
                <ShieldCheck aria-hidden="true" className="size-4.5" />
              </span>
              <p>Secure access to public opportunities, personalized career tools, and recruiter workflows.</p>
            </div>
            <p className="mt-2.5 text-[11px] text-[#64776e] dark:text-white/50">
              Copyright 2026 Kagea. All rights reserved.
            </p>
          </div>
        </section>

        <section className="relative min-h-dvh bg-surface text-foreground dark:bg-[#0a1310] lg:h-full lg:min-h-0 lg:overflow-y-auto">
          <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col justify-center px-6 py-8 sm:px-8 lg:min-h-full lg:py-10 xl:px-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-brand dark:bg-brand/20 dark:text-[#8df6a8]">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Secure access
            </span>
            <h1 className="mt-4 text-[clamp(1.6rem,2vw,2.3rem)] font-semibold tracking-[-0.045em] text-heading">
              {title}
            </h1>
            <p className="mt-2 text-[13.5px] leading-5 text-body">
              {description}
            </p>
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
