"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useSpring,
} from "framer-motion";
import { Bot } from "lucide-react";
import { NoiseBackground } from "@/components/ui/noise-background";
import StrokeText from "./StrokeText";
import { jobCategoryRows } from "./data";
import { CheckIcon, SearchIcon, UploadIcon, UserPlusIcon } from "./icons";
import { useLocale } from "@/i18n/LocaleProvider";

/**
 * The Cambodia map as a plain background line behind the whole section, the way
 * the hero sits its globe behind the copy. `object-contain` across the full
 * section box, so the map is never cropped -- only held at low opacity so the
 * text stays the loudest thing on the page.
 *
 * The asset is drawn in near-white (#FBFBFB) on transparent, i.e. for a dark
 * ground, which made it invisible on the light theme at any opacity. `invert`
 * flips it to near-black lines for light mode; dark mode uses it as authored.
 * Inversion leaves the alpha channel alone, so the transparent field stays
 * transparent either way.
 */
function CambodiaMapBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
    return (
        <motion.div
            aria-hidden="true"
            initial={reducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: reducedMotion ? 0 : 0.9,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none absolute inset-0 z-0"
        >
            <Image
                src="/landing-assets/cambodia-map.png"
                alt=""
                fill
                sizes="100vw"
                className="object-contain opacity-[0.5] invert sm:opacity-[0.2] lg:opacity-[0.10] dark:opacity-[0.14] dark:invert-0"
            />
        </motion.div>
    );
}

/**
 * The five things a job seeker actually does on the platform, in the order the
 * product puts them in -- register, build the profile, search, rehearse, apply
 * -- with the concrete artefact each step leaves behind.
 */
const workSteps = [
    { key: "create", Icon: UserPlusIcon },
    { key: "buildProfile", Icon: UploadIcon },
    { key: "findRoles", Icon: SearchIcon },
    { key: "rehearse", Icon: Bot },
    { key: "apply", Icon: CheckIcon },
] as const;

type WorkStep = (typeof workSteps)[number];

function TimelineStep({
    step,
    index,
    reducedMotion,
}: {
    step: WorkStep;
    index: number;
    reducedMotion: boolean;
}) {
    const { t } = useLocale();
    const rowRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(rowRef, { once: true, amount: 0.5 });
    const active = reducedMotion || isInView;
    const StepIcon = step.Icon;

    return (
        <motion.div
            ref={rowRef}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
                duration: reducedMotion ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative grid grid-cols-[44px_1fr] gap-x-5 sm:grid-cols-[56px_1fr] sm:gap-x-8"
        >
            {/* Node on the spine. Filled once the row has been reached. */}
            <div className="relative">
                <div
                    className={`flex size-11 items-center justify-center rounded-full border bg-surface transition-colors duration-500 sm:size-12 ${
                        active
                            ? "border-brand text-brand dark:border-emerald-400 dark:text-emerald-400"
                            : "border-slate-200 text-slate-300 dark:border-white/15 dark:text-white/25"
                    }`}
                >
                    <StepIcon className="size-4.5" />
                </div>
            </div>

            <div className="min-w-0 pb-14 sm:pb-16">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-xs text-slate-400 dark:text-white/35">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                        {t(`landing.jobDiscovery.steps.${step.key}.title`)}
                    </h3>
                </div>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                    {t(`landing.jobDiscovery.steps.${step.key}.description`)}
                </p>

                <p className="mt-4 inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-[0.16em] text-brand dark:text-emerald-400">
                    <span className="h-px w-6 bg-brand/40 dark:bg-emerald-400/40" />
                    {t(`landing.jobDiscovery.steps.${step.key}.outcome`)}
                </p>
            </div>
        </motion.div>
    );
}

export default function JobDiscoverySection() {
    const { t, locale } = useLocale();
    const [jobCategoriesRow1, jobCategoriesRow2, jobCategoriesRow3] =
        jobCategoryRows;
    const timelineRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 72%", "end 62%"],
    });
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 105,
        damping: 30,
        mass: 0.35,
    });

    return (
        <>
            {/* HOW FIND WORK */}
            <section className="w-full py-16 transition-colors sm:py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div
                        data-reveal
                        className="mx-auto mb-14 max-w-3xl sm:mb-20"
                    >
                        {locale === "en" ? (
                            <StrokeText
                                text={t("landing.jobDiscovery.howItWorksHeading")}
                                strokeColor="#008A1E"
                                fillColor="#008A1E"
                                accentText="Work"
                                accentColor="#F3BE00"
                                fadeStrokeOnFill
                                strokeWidth={1.6}
                                drawDuration={1.35}
                                fillDelay={0.12}
                                stagger={0.045}
                                ease="power2.out"
                                trigger="scroll"
                                fillMode="wipe"
                                fontSize={72}
                                fontWeight={700}
                                letterSpacing={-2}
                                className="dark:[&_text:last-of-type]:fill-white"
                            />
                        ) : (
                            /*
                             * StrokeText draws each Unicode code point into its own SVG
                             * <tspan>, which breaks Khmer's combining vowels/subscript
                             * consonants (they need to shape together). Khmer gets a
                             * plain heading with the same weight instead of the
                             * character-stroke animation.
                             */
                            <h2 className="text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-tight tracking-tight text-brand">
                                {t("landing.jobDiscovery.howItWorksHeading")}
                            </h2>
                        )}
                    </div>

                    <div ref={timelineRef} className="relative">
                        {/* Rail behind the nodes, and the brand-green fill that tracks scroll. */}
                        <div className="absolute bottom-6 left-[21px] top-6 w-px bg-slate-200 sm:left-[27px] dark:bg-white/10" />
                        <motion.div
                            aria-hidden="true"
                            className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-brand sm:left-[27px] dark:bg-emerald-400"
                            style={{
                                scaleY: prefersReducedMotion
                                    ? 1
                                    : smoothProgress,
                            }}
                        />

                        <div>
                            {workSteps.map((step, index) => (
                                <TimelineStep
                                    key={step.key}
                                    step={step}
                                    index={index}
                                    reducedMotion={Boolean(
                                        prefersReducedMotion,
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CONNECTING TALENT -- the map runs behind the whole section as a line drawing */}
            <section className="relative w-full overflow-hidden py-24 sm:py-32 lg:py-40">
                <CambodiaMapBackdrop
                    reducedMotion={Boolean(prefersReducedMotion)}
                />

                <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p
                            data-reveal
                            className="text-lg font-semibold uppercase tracking-[0.22em] text-brand dark:text-emerald-400"
                        >
                            {t("landing.jobDiscovery.builtForCambodia")}
                        </p>

                        <h2
                            data-reveal
                            className="mx-auto mt-7 max-w-3xl text-[clamp(2.5rem,5.5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-brand"
                        >
                            {t("landing.jobDiscovery.connectingTitle")}{" "}
                            <span className="text-warning-text">
                                {t("landing.jobDiscovery.connectingHighlight")}
                            </span>
                        </h2>

                        <p
                            data-reveal
                            className="mx-auto mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300"
                        >
                            {t("landing.jobDiscovery.connectingBody")}
                        </p>

                        <div
                            data-reveal
                            className="mt-10 flex flex-wrap items-center justify-center gap-4"
                        >
                            <Link
                                href="/jobs"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-warning px-8 text-sm font-semibold text-brand-hover transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-warning active:translate-y-0 active:scale-[0.98]"
                            >
                                {t("landing.jobDiscovery.exploreJobs")}
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand/30 px-8 text-sm font-semibold text-brand transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-white dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:border-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                            >
                                {t("landing.hero.createAccountCta")}
                            </Link>
                        </div>
                    </div>

                    {/*
                     * Hairline three-up, the same clean rule-and-small-caps language the
                     * clients section uses -- it gives the map room to read as the only
                     * texture in the section.
                     */}
                    <div
                        data-stagger
                        className="mt-20 grid border-t border-slate-200/80 sm:mt-28 sm:grid-cols-3 dark:border-white/10"
                    >
                        {(["nationwide", "oneProfile", "aiPractice"] as const).map((key) => (
                            <div
                                key={key}
                                className="border-b border-slate-200/80 px-1 py-8 sm:border-b-0 sm:border-r sm:px-8 sm:py-10 sm:last:border-r-0 sm:first:pl-0 sm:last:pr-0 dark:border-white/10"
                            >
                                <p className="text-lg font-semibold uppercase tracking-[0.16em] text-slate-900 dark:text-white">
                                    {t(`landing.jobDiscovery.highlights.${key}.label`)}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {t(`landing.jobDiscovery.highlights.${key}.text`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

//// here is the other file
