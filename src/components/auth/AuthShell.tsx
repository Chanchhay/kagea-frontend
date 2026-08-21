import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  MessageSquareMore,
  ShieldCheck,
  Target,
} from "lucide-react";
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
            + " border border-black/[.07] bg-white/70 shadow-[0_24px_64px_rgba(0,0,0,.10),0_1px_3px_rgba(0,0,0,.06)] backdrop-blur-sm"
            + " dark:border-white/10 dark:bg-black/20 dark:shadow-[0_30px_90px_rgba(0,0,0,.4)]"
            + " lg:grid lg:h-[calc(100dvh-2rem)] lg:max-h-[calc(100dvh-2rem)] lg:max-w-[1460px] lg:grid-cols-[minmax(0,.45fr)_minmax(0,.55fr)]",
          className,
        )}
      >
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(96,220,140,.2),transparent_24%),radial-gradient(circle_at_76%_22%,rgba(34,164,71,.12),transparent_28%),linear-gradient(160deg,#f5fff8_0%,#e7f4ea_52%,#dbece0_100%)] text-[#102218] lg:flex lg:h-full lg:flex-col lg:overflow-hidden dark:bg-[radial-gradient(circle_at_60%_24%,rgba(52,223,114,.22),transparent_18%),linear-gradient(160deg,#020907_0%,#05110c_55%,#07130d_100%)] dark:text-white xl:px-10 px-9 py-7">
          <div className="pointer-events-none absolute left-[56%] top-[5%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-[#43e77d]/18 dark:border-[#43e77d]/28" />
          <div className="pointer-events-none absolute left-[56%] top-[-1%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-[#2ddc74]/8 dark:border-[#2ddc74]/10" />
          <div className="pointer-events-none absolute left-[56%] top-[16%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(57,255,136,.12),transparent_65%)] blur-2xl motion-safe:animate-[auth-glow_6s_ease-in-out_infinite] motion-reduce:animate-none dark:bg-[radial-gradient(circle,rgba(57,255,136,.22),transparent_65%)]" />
          <div className="pointer-events-none absolute bottom-[-16%] left-[-2%] h-[30rem] w-[30rem] rounded-full border border-[#34df72]/8 dark:border-[#34df72]/10" />
          <div className="pointer-events-none absolute bottom-[4%] left-[10%] h-[21rem] w-[21rem] rounded-full border border-[#34df72]/8 dark:border-[#34df72]/10" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.12),transparent_42%)] dark:hidden" />

          <Link href="/" className="relative z-10 w-fit">
            <Image
              src="/figma/brand-logo.png"
              alt="KAGEA"
              width={240}
              height={120}
              priority
              unoptimized
              className="h-auto w-[200px] object-contain object-left brightness-[.95] contrast-[1.02] xl:w-[220px] dark:brightness-[1.04]"
            />
          </Link>

          <div className="relative z-10 mt-6 max-w-[16rem] xl:max-w-[17rem]">
            <h2 className="text-[clamp(2.75rem,3vw,3.85rem)] font-semibold leading-[.92] tracking-[-0.055em] text-[#142217] dark:text-white">
              <span className="block">Your future.</span>
              <span className="mt-2 block">
                <span className="text-[#39ff88]">AI</span>-powered.
              </span>
            </h2>
            <p className="mt-4 max-w-[14rem] text-[0.96rem] leading-6 text-[#375145] dark:text-white/78">
              Create your account and unlock smarter career opportunities.
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-[18%] right-[-6%] top-[5%] z-[1]">
            <div className="animate-auth-float h-full w-full motion-reduce:animate-none">
              <Image
                src="/images/login-illustration.png?v=2026-08-20-2"
                alt="AI career assistant illustration"
                fill
                priority
                unoptimized
                className="object-contain object-[50%_55%] brightness-[1.04] saturate-[1.02] dark:brightness-100"
              />
            </div>
          </div>

          <div className="absolute left-0 top-[38%] z-20 flex w-[15rem] flex-col gap-2.5">
            <FeatureBadge
              icon={Bot}
              title="AI Career Assistant"
              description="Personalized guidance for your career growth."
            />
            <FeatureBadge
              icon={Target}
              title="Smart Job Match"
              description="Find roles that fit your skills and goals."
            />
            <FeatureBadge
              icon={MessageSquareMore}
              title="Interview Coach"
              description="Practice and get better with AI feedback."
            />
            <FeatureBadge
              icon={ShieldCheck}
              title="Trusted & secure"
              description="Your data is protected with enterprise-grade security."
            />
          </div>

          <div className="min-h-0 flex-1" />

          <div className="relative z-10 mt-3 flex items-end justify-between gap-4 text-[#41584d] dark:text-white/72">
            <div className="flex max-w-[15rem] items-start gap-2.5 text-[12px] leading-5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-2xl border border-[#3be172]/20 bg-white/60 text-[#199b43] dark:border-[#3be172]/30 dark:bg-white/5 dark:text-[#5ff08d]">
                <ShieldCheck aria-hidden="true" className="size-4.5" />
              </span>
              <p>Secure access to public opportunities, personalized career tools, and recruiter workflows.</p>
            </div>
            <div className="text-[11px] text-[#64776e] dark:text-white/50">Copyright 2026 Kagea. All rights reserved.</div>
          </div>
        </section>

        <section className="min-h-dvh bg-white/94 text-foreground backdrop-blur-md dark:bg-[#050706] dark:text-white lg:min-h-0 lg:h-full lg:overflow-y-auto">
          <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col justify-center px-6 py-5 sm:px-8 lg:min-h-full xl:px-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-brand dark:bg-brand/18 dark:text-[#8df6a8]">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Secure access
            </span>
            <h1 className="mt-3 text-[clamp(1.6rem,2vw,2.3rem)] font-semibold tracking-[-0.045em] text-heading">
              {title}
            </h1>
            <p className="mt-1.5 text-[13.5px] leading-5 text-body">
              {description}
            </p>
            <div className="mt-2">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureBadge({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bot;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#d7e8db] bg-white/72 p-3 shadow-[0_18px_40px_rgba(24,54,35,.12)] backdrop-blur-md transition-transform duration-500 ease-out motion-safe:animate-[auth-badge_6s_ease-in-out_infinite] motion-reduce:animate-none dark:border-white/12 dark:bg-white/7 dark:shadow-[0_18px_40px_rgba(0,0,0,.18)]">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#7fd29a]/45 bg-[#ebfff1] text-[#15803d] shadow-[inset_0_0_0_1px_rgba(255,255,255,.5)] dark:border-[#48e67a]/35 dark:bg-[#12311f] dark:text-[#65ef94] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,.03)]">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-[0.875rem] font-semibold text-[#163222] dark:text-white">{title}</p>
          <p className="mt-0.5 text-[12px] leading-4 text-[#466252] dark:text-white/72">{description}</p>
        </div>
      </div>
    </div>
  );
}
