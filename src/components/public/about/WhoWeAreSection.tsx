"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Briefcase, Building2, Users, Award, Code2, GraduationCap, Layers } from "lucide-react";

const STATS = [
  {
    icon: Briefcase,
    value: "120K+",
    label: "Live Jobs",
    color: "text-[#008A1E]",
    bg: "bg-[#008A1E]/10",
  },
  {
    icon: Building2,
    value: "850K+",
    label: "Companies",
    color: "text-[#008A1E]",
    bg: "bg-[#008A1E]/10",
  },
  {
    icon: Users,
    value: "900K+",
    label: "Candidates",
    color: "text-[#008A1E]",
    bg: "bg-[#008A1E]/10",
  },
  {
    icon: Award,
    value: "100%",
    label: "Satisfaction",
    color: "text-[#E8C222]",
    bg: "bg-[#E8C222]/15",
  },
];

const SKILLS = ["Frontend", "Backend", "UI/UX", "Full-Stack Web"];

export default function WhoWeAreSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section ref={containerRef} className="relative overflow-hidden py-10 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Top Bar: Section Title + Stat Bar Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1fa628]">
              <Sparkles className="h-4 w-4 text-[#F3BE00]" />
              About Our Team
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl lg:text-5xl tracking-tight">
              Who are we<span className="text-[#F3BE00]">?</span>
            </h2>
          </motion.div>

          {/* Stats Grid Bar */}
          <motion.div
            variants={staggerContainer}
            className="grid flex-1 grid-cols-2 gap-3.5 sm:grid-cols-4 lg:max-w-2xl"
          >
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white/80 p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-[#1fa628]/50 hover:shadow-lg dark:border-slate-800/90 dark:bg-slate-900/80 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                >
                  <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Content Section: Team Showcase + Information */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12">
          {/* Team Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:col-span-6"
          >
            <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200/80 bg-slate-100 dark:border-slate-800/80 dark:bg-slate-800 shadow-xl">
              <Image
                src="/images/avatar/team.jpg"
                alt="ISTAD Students Team"
                width={800}
                height={600}
                className="h-auto w-full object-contain transition-transform duration-500 sm:h-[26rem] sm:object-cover sm:group-hover:scale-105"
                priority
              />

              {/* Floating Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/20 bg-slate-950/80 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1fa628] text-white shadow-md">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-300">Project Authors</p>
                    <p className="text-sm font-black text-white">ISTAD 2nd Year Students</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 lg:col-span-6"
          >
            <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white/80 p-6 backdrop-blur-md sm:p-8 dark:border-slate-800/90 dark:bg-slate-900/80 shadow-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1fa628]/30 bg-[#1fa628]/10 px-3 py-1 text-xs font-bold text-[#1fa628]">
                <Code2 className="h-3.5 w-3.5" />
                Software Engineering
              </div>

              <h3 className="text-2xl font-black leading-snug text-slate-900 dark:text-white sm:text-3xl tracking-tight">
                Passionate developers crafting modern web experiences at{" "}
                <span className="inline-block border-b-2 border-[#F3BE00] text-[#1fa628]">
                  ISTAD
                </span>
              </h3>

              <p className="text-base font-normal leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                We are 2nd-year Bachelor&apos;s degree students specializing in building responsive, scalable, and intuitive web applications using modern frontend and backend technologies.
              </p>

              {/* Skill Tags */}
              <div className="pt-2">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Layers className="h-3.5 w-3.5 text-[#1fa628]" />
                  Core Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-200 hover:border-[#1fa628]/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}