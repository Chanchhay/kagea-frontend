"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Globe2, Bot, Target, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface MissionFeature {
  title: string;
  description: string;
  // Narrower than React.ElementType: @react-three/fiber augments
  // JSX.IntrinsicElements, which collapses `className` to never on ElementType.
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const missionFeatures: MissionFeature[] = [
  {
    title: "Flexible Job Search",
    description: "Learn anytime, anywhere at your own pace with tailored paths.",
    icon: Globe2,
    accentColor: "border-[#E8C222]/40 text-[#E8C222]",
    badgeBg: "bg-[#E8C222]/10 text-[#E8C222]",
  },
  {
    title: "24/7 AI Guidance",
    description: "AI tutors and mock interview mentors available round-the-clock.",
    icon: Bot,
    accentColor: "border-[#008A1E]/40 text-[#008A1E]",
    badgeBg: "bg-[#008A1E]/10 text-[#008A1E]",
  },
  {
    title: "Progress Guarantee",
    description: "Actionable analytics and structured roadmaps for real results.",
    icon: Target,
    accentColor: "border-[#E33434]/40 text-[#E33434]",
    badgeBg: "bg-[#E33434]/10 text-[#E33434]",
  },
  {
    title: "Verified Opportunities",
    description: "Direct connections with vetted recruiters and verified job listings.",
    icon: ShieldCheck,
    accentColor: "border-[#0284C7]/40 text-[#0284C7]",
    badgeBg: "bg-[#0284C7]/10 text-[#0284C7]",
  },
];

export default function MissionSection() {
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
      className="relative overflow-hidden py-10 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Empowering Careers
            </div>

            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              <span className="text-[#1fa628]">Our</span> <span className="text-[#F3BE00]">Mission</span>
            </h2>

            <p className="mb-8 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              To bridge the gap between ambitious job seekers and top tech companies by providing AI-driven skill building, real-time interview practice, and personalized career matching.
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
                    Built for next-generation tech talents & recruiters.
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
                  key={feature.title}
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
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {feature.description}
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