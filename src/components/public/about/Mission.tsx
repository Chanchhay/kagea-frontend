"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Globe2, Bot, Target, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";

interface MissionFeature {
  titleKey: string;
  descriptionKey: string;
  // Narrower than React.ElementType: @react-three/fiber augments
  // JSX.IntrinsicElements, which collapses `className` to never on ElementType.
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const missionFeatures: MissionFeature[] = [
  {
    titleKey: "about.mission.feature1Title",
    descriptionKey: "about.mission.feature1Description",
    icon: Globe2,
    accentColor: "border-[#E8C222]/40 text-[#E8C222]",
    badgeBg: "bg-[#E8C222]/10 text-[#E8C222]",
  },
  {
    titleKey: "about.mission.feature2Title",
    descriptionKey: "about.mission.feature2Description",
    icon: Bot,
    accentColor: "border-[#008A1E]/40 text-[#008A1E]",
    badgeBg: "bg-[#008A1E]/10 text-[#008A1E]",
  },
  {
    titleKey: "about.mission.feature3Title",
    descriptionKey: "about.mission.feature3Description",
    icon: Target,
    accentColor: "border-[#E33434]/40 text-[#E33434]",
    badgeBg: "bg-[#E33434]/10 text-[#E33434]",
  },
  {
    titleKey: "about.mission.feature4Title",
    descriptionKey: "about.mission.feature4Description",
    icon: ShieldCheck,
    accentColor: "border-[#0284C7]/40 text-[#0284C7]",
    badgeBg: "bg-[#0284C7]/10 text-[#0284C7]",
  },
];

export default function MissionSection() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative"
    >
      <div className="w-full">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Side: Headline & Organic Blob Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:col-span-6"
          >
            {/* Tagline Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1fa628]/30 bg-[#1fa628]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#1fa628]">
              <Sparkles className="h-3.5 w-3.5 text-[#F3BE00]" />
              {t("about.mission.badge")}
            </div>

            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              <span className="text-[#1fa628]">{t("about.mission.headingPart1")}</span> <span className="text-[#F3BE00]">{t("about.mission.headingPart2")}</span>
            </h2>

            <p className="mb-8 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              {t("about.mission.description")}
            </p>

            {/* Organic Blob Frame Container */}
            <div className="relative mx-auto aspect-[1.15/1] w-full max-w-[500px] lg:mx-0">
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-2 rounded-[38px] border-2 border-dashed border-[#1fa628]/20" />

              <div className="relative h-full w-full overflow-hidden rounded-[32px] border-2 border-slate-200/80 bg-slate-900 dark:border-slate-800 shadow-2xl">
                <Image
                  src="/images/about-us/mission.png"
                  alt="Online internship mission"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Subtle Image Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/80 p-3.5 backdrop-blur-md">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1fa628]" />
                  <p className="text-xs font-medium text-white">
                    {t("about.mission.imageCaption")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Animated Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex w-full flex-col gap-5 lg:col-span-6"
          >
            {missionFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.titleKey}
                  variants={fadeInUp}
                  whileHover={{ x: 8 }}
                  className={`group relative flex w-full items-start gap-5 rounded-3xl border border-slate-200/90 bg-white/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#1fa628]/50 hover:shadow-lg dark:border-slate-800/90 dark:bg-slate-900/80 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${
                    index === 1
                      ? "lg:ml-4"
                      : index === 2
                      ? "lg:ml-8"
                      : index === 3
                      ? "lg:ml-12"
                      : ""
                  }`}
                >
                  {/* Icon Container */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${feature.badgeBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}