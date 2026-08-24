"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Camera, Globe2, Mail, MapPin, Menu, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarAccount } from "@/components/auth/NavbarAccount";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Find Job" },
    { href: "/recruiter/jobs/new", label: "Post Job" },
    { href: "/about-us", label: "About Us" },
];

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
                    scrolled
                        ? "border-b border-border/70 bg-surface/80 shadow-[0_1px_24px_-12px_rgba(0,0,0,.35)] backdrop-blur-xl supports-backdrop-filter:bg-surface/70"
                        : "border-b border-transparent bg-surface",
                )}
            >
                <div className="mx-auto flex h-16 max-w-352 items-center gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
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
                        aria-label="Public navigation"
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
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden flex-1 basis-0 items-center justify-end gap-2 lg:flex">
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
                                <span className="sr-only">Open navigation</span>
                            </SheetTrigger>
                        </div>
                        <SheetContent
                            side="right"
                            className="w-[min(22rem,calc(100vw-2rem))]"
                        >
                            <SheetHeader>
                                <SheetTitle className="flex items-center">
                                    <BrandLogo height={30} />
                                    <span className="sr-only">Navigation</span>
                                </SheetTitle>
                            </SheetHeader>
                            <nav
                                aria-label="Mobile public navigation"
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
                                                {link.label}
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
            <main className="overflow-x-hidden">
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
    return (
        <footer className="border-t border-border bg-surface">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_.7fr_1fr] lg:px-8">
                <div>
                    <Link href="/" className="block w-fit" aria-label="Kagea home">
                        <BrandLogo height={40} />
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-body">
                        Empowering learners through innovative education and
                        technology. Providing the latest methodology with
                        high-quality training and mentoring.
                    </p>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-brand">
                        Follow us
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm text-body">
                        <li className="flex items-center gap-2">
                            <Phone className="size-4 text-brand" />
                            Customer Service: +855-81697501
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="size-4 text-brand" />
                            Working Hours: 08:30 - 18:00
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                            No. 24, Street 562, Sangkat Kak I, Khan Toul Kork,
                            Phnom Penh.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-brand">
                        Explore
                    </h2>
                    <nav
                        className="mt-4 grid gap-3 text-sm text-body"
                        aria-label="Footer navigation"
                    >
                        {landingNavigation.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="w-fit hover:text-brand"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-brand">
                        Sponsored and organized by
                    </h2>
                    <div className="relative mt-4 h-24 w-52">
                        <Image
                            src="/landing-assets/istad-logo-color.png"
                            alt="ISTAD"
                            fill
                            sizes="208px"
                            loading="eager"
                            unoptimized
                            className="object-contain object-left dark:hidden"
                        />
                        <Image
                            src="/landing-assets/istad-logo.png"
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="208px"
                            loading="eager"
                            unoptimized
                            className="hidden object-contain object-left dark:block"
                        />
                    </div>
                    <div className="mt-5 flex gap-2">
                        {[Camera, Globe2, Video].map((Icon, index) => (
                            <span
                                key={index}
                                aria-label={
                                    ["Instagram", "Website", "YouTube"][index]
                                }
                                role="img"
                                className="flex size-9 items-center justify-center rounded-full border border-border text-brand"
                            >
                                <Icon className="size-4" />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="border-t border-border px-4 py-4 text-center text-xs text-body">
                © 2026 Kagea | Sponsored and organized by ISTAD
            </div>
        </footer>
    );
}
