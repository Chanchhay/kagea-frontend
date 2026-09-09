"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Clock3, MapPin, Menu, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { NavbarAccount } from "@/components/auth/NavbarAccount";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocale } from "@/i18n/LocaleProvider";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNavigationOpen } from "@/store/uiSlice";

const landingNavigation = [
    { href: "/", labelKey: "nav.home" },
    { href: "/jobs", labelKey: "nav.findJob" },
    { href: "/recruiter/jobs/new", labelKey: "nav.postJob" },
    { href: "/about-us", labelKey: "nav.about" },
] as const;

/** A link is current for "/" only on an exact match; sections match by prefix. */
function isCurrent(pathname: string, href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function PublicShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const mobileNavigationOpen = useAppSelector(
        (state) => state.ui.mobileNavigationOpen,
    );
    const scrolled = useScrolled();
    const { t } = useLocale();

    return (
        <div className="min-h-screen bg-surface text-heading">
            {/*
             * The header is flat and borderless over the hero and only grows a
             * hairline plus a soft shadow once the page scrolls under it, so the
             * landing artwork keeps the full height of the viewport.
             */}
            <header
                className={cn(
                    "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
                    /*
                     * The dark values are pinned to the landing page's neutral
                     * charcoal rather than `--surface`, whose dark value is a
                     * green-tinted #171E17 -- against the page's #181B1C that
                     * read as a tinted bar with a seam under it.
                     */
                    scrolled
                        ? "border-b border-border/70 bg-surface/80 shadow-[0_1px_24px_-12px_rgba(0,0,0,.35)] backdrop-blur-xl supports-backdrop-filter:bg-surface/70 dark:border-[#3E444B]/70 dark:bg-[#181B1C]/80 dark:supports-backdrop-filter:bg-[#181B1C]/70"
                        : "border-b border-transparent bg-surface dark:bg-[#181B1C]",
                )}
            >
                {/*
                 * The gutters mirror the landing hero's own padding ladder
                 * (px-5 / sm:px-8 / lg:px-12 / xl:px-16 / 2xl:px-24), so the
                 * logo lines up with the copy beneath it instead of hugging the
                 * window edge. The height stays 64/72px: `scroll-padding-top`
                 * and the hero's `100svh-78px` are keyed to it.
                 */}
                <div className="mx-auto flex h-16 w-full max-w-[120rem] items-center gap-4 px-5 sm:px-8 lg:h-18 lg:px-12 xl:px-16 2xl:px-24">
                    {/*
                     * The two side rails share `flex-1 basis-0` so they always
                     * measure the same width, which pins the nav to the true
                     * centre of the header -- `mx-auto` alone would only centre
                     * it in the leftover space and drift as the account cluster
                     * changes width between signed-out and signed-in.
                     */}
                    <div className="flex flex-1 basis-0 items-center">
                        <Link
                            href="/"
                            className="shrink-0 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/30"
                            aria-label="Kagea home"
                        >
                            <BrandLogo height={36} priority />
                        </Link>
                    </div>

                    {/*
                     * Centred pill nav: the active route is marked by a filled
                     * chip rather than colour alone, which survives both themes
                     * and reads at a glance next to the brand green.
                     */}
                    <nav
                        aria-label={t("nav.public")}
                        className="hidden shrink-0 items-center gap-1 rounded-full border border-border/60 bg-surface-muted/60 p-1 lg:flex"
                    >
                        {landingNavigation.map((link) => {
                            const current = isCurrent(pathname, link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={current ? "page" : undefined}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-[15px] font-medium transition-colors",
                                        current
                                            ? "bg-surface text-brand shadow-sm"
                                            : "text-body hover:bg-surface/70 hover:text-heading",
                                    )}
                                >
                                    {t(link.labelKey)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden flex-1 basis-0 items-center justify-end gap-2 lg:flex">
                        <LanguageToggle />
                        <ThemeToggle />
                        <NavbarAccount />
                    </div>

                    <Sheet
                        open={mobileNavigationOpen}
                        onOpenChange={(open) =>
                            dispatch(setMobileNavigationOpen(open))
                        }
                    >
                        <div className="ml-auto flex items-center gap-1 lg:hidden">
                            <LanguageToggle />
                            <ThemeToggle />
                            <SheetTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-11 rounded-full"
                                    />
                                }
                            >
                                <Menu aria-hidden="true" />
                                <span className="sr-only">{t("nav.open")}</span>
                            </SheetTrigger>
                        </div>
                        <SheetContent
                            side="right"
                            className="w-[min(22rem,calc(100vw-2rem))]"
                        >
                            <SheetHeader>
                                <SheetTitle className="flex items-center">
                                    <BrandLogo height={30} />
                                    <span className="sr-only">{t("nav.navigation")}</span>
                                </SheetTitle>
                            </SheetHeader>
                            <nav
                                aria-label={t("nav.mobile")}
                                className="grid gap-1 px-4"
                            >
                                {landingNavigation.map((link) => {
                                    const current = isCurrent(
                                        pathname,
                                        link.href,
                                    );
                                    return (
                                        <SheetClose
                                            key={link.href}
                                            render={<Link href={link.href} />}
                                        >
                                            <span
                                                className={cn(
                                                    "block rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-surface-muted hover:text-heading",
                                                    current &&
                                                        "bg-brand-tint text-brand",
                                                )}
                                            >
                                                {t(link.labelKey)}
                                            </span>
                                        </SheetClose>
                                    );
                                })}
                                <NavbarAccount
                                    mobile
                                    onNavigate={() =>
                                        dispatch(setMobileNavigationOpen(false))
                                    }
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
            <main className="overflow-x-clip">
                {children}
            </main>
        </div>
    );
}

/** True once the window has scrolled past the header's own height. */
function useScrolled(threshold = 8) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > threshold);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);

    return scrolled;
}

export function PublicFooter() {
    const { t } = useLocale();

    return (
        <footer className="relative overflow-hidden bg-white text-slate-700 dark:bg-[#181B1C] dark:text-[#CBD0D5]">
            <div className="relative mx-auto grid w-full max-w-[120rem] grid-cols-2 gap-x-6 gap-y-6 px-5 py-8 sm:gap-x-10 sm:gap-y-8 sm:px-8 sm:py-12 lg:px-12 xl:grid-cols-[1.2fr_1.05fr_.65fr_1fr] xl:gap-x-12 xl:px-16 xl:py-14 2xl:gap-x-16 2xl:px-24 max-sm:[overflow-wrap:anywhere]">
                <div className="relative col-span-2 min-w-0 sm:col-span-1 sm:pr-4 xl:col-span-1 xl:pr-0">
                    <Link href="/" className="relative block w-fit rounded-lg outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-emerald-600/25" aria-label="Kagea home">
                        <BrandLogo height={40} />
                    </Link>
                    <p className="relative mt-4 max-w-sm text-sm leading-6 text-slate-600 sm:mt-5 dark:text-slate-400">
                        {t("footer.tagline")}
                    </p>
                </div>

                <div className="col-span-2 min-w-0 border-t border-emerald-950/8 pt-6 sm:col-span-1 sm:border-0 sm:pt-0 dark:border-white/8 xl:col-span-1">
                    <h2 className="text-sm font-semibold tracking-wide text-slate-950 dark:text-white">{t("footer.contact")}</h2>
                    <ul className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
                        <FooterContact icon={Phone} label={t("footer.customerService")}>+855-81697501</FooterContact>
                        <FooterContact icon={Clock3} label={t("footer.workingHours")}>08:30 - 18:00</FooterContact>
                        <FooterContact icon={MapPin} label={t("footer.address")}>No. 24, Street 562, Sangkat Kak I, Khan Toul Kork, Phnom Penh.</FooterContact>
                    </ul>
                </div>

                <div className="col-span-2 min-w-0 border-t border-emerald-950/8 pt-6 sm:col-span-1 sm:pt-7 dark:border-white/8 xl:border-0 xl:pt-0">
                    <h2 className="text-sm font-semibold tracking-wide text-slate-950 dark:text-white">{t("footer.explore")}</h2>
                    <nav
                        className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:mt-5 sm:grid-cols-1 sm:gap-3.5"
                        aria-label="Footer navigation"
                    >
                        {landingNavigation.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group flex min-h-11 w-fit items-center gap-1.5 font-medium text-slate-600 transition-colors duration-200 hover:text-brand sm:min-h-0 dark:text-slate-400 dark:hover:text-emerald-400"
                            >
                                {t(link.labelKey)}
                                <ArrowUpRight className="size-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="col-span-2 min-w-0 border-t border-emerald-950/8 pt-6 sm:col-span-1 sm:pt-7 dark:border-white/8 xl:border-0 xl:pt-0">
                    <h2 className="text-sm font-semibold leading-5 tracking-wide text-slate-950 dark:text-white">{t("footer.sponsor")}</h2>
                    <div className="relative mt-3 h-12 w-full max-w-40 sm:mt-5 sm:h-16 sm:max-w-56">
                        <Image src="/landing-assets/istad-logo-color.png" alt="ISTAD" fill sizes="224px" loading="eager" unoptimized className="object-contain object-left dark:hidden" />
                        <Image src="/landing-assets/istad-logo.png" alt="" aria-hidden="true" fill sizes="224px" loading="eager" unoptimized className="hidden object-contain object-left dark:block" />
                    </div>
                    <div className="mt-4 flex w-fit flex-wrap gap-2.5 sm:mt-5">
                        {[
                            { Icon: FaFacebookF, label: "Facebook" },
                            { Icon: FaYoutube, label: "YouTube" },
                            { Icon: FaInstagram, label: "Instagram" },
                            { Icon: FaLinkedinIn, label: "LinkedIn" },
                        ].map(({ Icon, label }) => (
                            <span
                                key={label}
                                aria-label={label}
                                role="img"
                                className="flex size-11 items-center justify-center rounded-full border border-emerald-900/10 bg-white text-brand shadow-sm transition-[transform,background-color,border-color] duration-200 hover:scale-105 hover:border-emerald-600/25 hover:bg-emerald-50 sm:size-10 dark:border-[#3E444B] dark:bg-[#23272D] dark:text-emerald-400 dark:hover:border-emerald-400/30 dark:hover:bg-[#2B3036]"
                            >
                                <Icon className="size-4 sm:size-[18px]" />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="relative border-t border-emerald-950/10 bg-white/45 dark:border-[#3E444B] dark:bg-[#151819]">
                <div className="mx-auto flex w-full max-w-[120rem] flex-col items-center gap-1.5 px-5 py-4 text-center text-xs text-slate-500 sm:px-8 md:flex-row md:justify-between md:text-left lg:px-12 xl:px-16 2xl:px-24 dark:text-slate-400">
                    <p>© 2026 ការងារ. {t("footer.rights")}</p>
                    <p>{t("footer.sponsor")} <span className="font-semibold text-slate-700 dark:text-slate-200">ISTAD</span></p>
                </div>
            </div>
        </footer>
    );
}

function FooterContact({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-white text-brand shadow-sm dark:border-[#3E444B] dark:bg-[#23272D] dark:text-emerald-400">
                <Icon className="size-4" />
            </span>
            <span className="min-w-0 pt-0.5 text-sm">
                <span className="block font-semibold text-slate-900 dark:text-white">{label}</span>
                <span className="mt-1.5 block max-w-64 leading-6 text-slate-500 sm:mt-0.5 sm:leading-5 dark:text-slate-400">{children}</span>
            </span>
        </li>
    );
}
