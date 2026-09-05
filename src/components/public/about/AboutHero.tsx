"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, Bot, Users, CheckCircle2 } from "lucide-react";

export default function AboutHeroSection() {
  // Stagger variants for content reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative">
      <div className="w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20 2xl:gap-28"
        >
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                <Sparkles className="h-3.5 w-3.5 text-[#F3BE00]" />
                Get Best Employee
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-heading sm:text-5xl lg:text-6xl"
            >
              We find the{" "}
              <span className="relative inline-block text-brand">
                best
                {/* Yellow Highlight Bar behind "best" */}
                <span className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-[#F3BE00]/40 rounded-sm sm:h-4" />
              </span>{" "}
              asset for your team
            </motion.h1>

            {/* Subheading / Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg"
            >
              <span className="font-semibold text-brand">Find Job</span> is an
              innovative recruitment platform that connects technology
              enthusiasts with quality opportunities using AI-driven mock interviews
              and real-time skill matching.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-body sm:text-sm"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2">
                <CheckCircle2 className="h-4 w-4 text-[#1fa628]" />
                Top Tech Talent
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2">
                <Bot className="h-4 w-4 text-[#F3BE00]" />
                AI Mock Interviewer
              </div>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button className="group flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]">
                Explore Talent
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="rounded-xl border border-border bg-surface px-6 py-3.5 font-semibold text-heading transition-colors hover:bg-surface-muted">
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Right Visual Graphic Container */}
          <div className="relative flex justify-center lg:col-span-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative h-72 w-72 sm:h-96 sm:w-96"
            >
              {/* Outer Pulsing Ring */}
              <div className="absolute inset-0 animate-ping rounded-full border border-[#F3BE00]/25 duration-3000" />
              <div className="absolute -inset-4 rounded-full border border-brand/20" />

              {/* Main Globe Image with Floating Effect */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative h-full w-full"
              >
                <img
                  src="/images/avatar/globe.png"
                  alt="Global Connection Network"
                  className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(31,166,40,0.25)]"
                />
              </motion.div>

              {/* Floating Stat Card 1: Matches */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -left-4 top-1/4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-[0_8px_24px_rgba(24,25,28,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:-left-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-fg">
                    Active Seekers
                  </p>
                  <p className="text-sm font-semibold text-heading">
                    10,000+
                  </p>
                </div>
              </motion.div>

              {/* Floating Stat Card 2: AI Tech */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-[0_8px_24px_rgba(24,25,28,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:-right-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3BE00]/15 text-[#F3BE00]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-fg">
                    AI Interview Practice
                  </p>
                  <p className="text-sm font-semibold text-heading">
                    Instant Feedback
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
