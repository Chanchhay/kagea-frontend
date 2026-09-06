"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Briefcase, Building2, Users, Award, Code2, GraduationCap, Layers } from "lucide-react";

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
    <section ref={containerRef} className="relative">
      <div className="w-full">
        {/* Top Bar: Section Title + Stat Bar Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              <Sparkles className="h-4 w-4 text-[#F3BE00]" />
              About Our Team
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-5xl">
              Who are we<span className="text-[#F3BE00]">?</span>
            </h2>
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
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface-muted">
              <Image
                src="/images/avatar/team.jpg"
                alt="ISTAD Students Team"
                width={800}
                height={600}
                className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[26rem]"
                priority
              />

              {/* Floating Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#18191c]/75 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">Project Authors</p>
                    <p className="text-sm font-bold text-white">ISTAD 2nd Year Students</p>
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
            <div className="space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.07] px-3 py-1 text-xs font-semibold text-brand">
                <Code2 className="h-3.5 w-3.5" />
                Software Engineering
              </div>

              <h3 className="text-2xl font-bold leading-snug tracking-tight text-heading sm:text-3xl">
                Passionate developers crafting modern web experiences at{" "}
                <span className="relative inline-block text-brand">
                  ISTAD
                  <span className="absolute bottom-0.5 left-0 -z-10 h-2.5 w-full rounded-sm bg-[#F3BE00]/40" />
                </span>
              </h3>

              <p className="text-base leading-relaxed text-body sm:text-lg">
                We are 2nd-year Bachelor&apos;s degree students specializing in building responsive, scalable, and intuitive web applications using modern frontend and backend technologies.
              </p>

              {/* Skill Tags */}
              <div className="pt-2">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-fg">
                  <Layers className="h-3.5 w-3.5 text-[#F3BE00]" />
                  Core Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-border bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-body transition-colors hover:border-brand/40 hover:text-brand"
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
