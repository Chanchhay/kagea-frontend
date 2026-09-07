"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Sparkles,
  X,
  GraduationCap,
  ArrowRight,
  Send,
  ChevronLeft,
  ChevronRight,
  Code2,
  CheckCircle2,
  Briefcase,
  Quote,
  Milestone,
  ExternalLink,
  Layers3,
  UserCheck,
} from "lucide-react";
import { developmentTeam, mentors, type TeamMember } from "./data";
import { useLocale } from "@/i18n/LocaleProvider";

// Custom GitHub Icon Component
function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Custom LinkedIn Icon Component
function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z" />
    </svg>
  );
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type TabType = "ABOUT" | "STACK" | "PROJECTS" | "JOURNEY";

export default function TeamSection() {
  const { t } = useLocale();
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Disable background scrolling when modal drawer is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMember]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Duplicate list for infinite smooth marquee
  const marqueeMembers = [...developmentTeam, ...developmentTeam];

  return (
    <div className="space-y-28">
      {/* SECTION 1: MEET OUR MENTORS */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2.5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F3BE00]/40 bg-[#F3BE00]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#D9A700] dark:text-[#F3BE00]">
            <Sparkles className="h-3.5 w-3.5" />
            {t("about.team.mentorsBadge")}
          </div>
          <h2 className="text-3xl font-bold text-[#F3BE00] sm:text-4xl lg:text-5xl tracking-tight">
            {t("about.team.mentorsHeading")}
          </h2>
          <p className="max-w-md mx-auto text-sm font-medium text-slate-500 dark:text-slate-400">
            {t("about.team.mentorsSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-start max-w-7xl mx-auto"
        >
          {mentors.map((mentor, index) => (
            <MemberCard
              key={mentor.id}
              member={mentor}
              index={index + 1}
              accentColor="gold"
            />
          ))}
        </motion.div>
      </section>

      {/* SECTION 2: OUR MEMBERS / DEVELOPMENT TEAM */}
      <section className="space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1fa628]/40 bg-[#1fa628]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1fa628]">
            <Code2 className="h-3.5 w-3.5" />
            {t("about.team.membersBadge")}
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl tracking-tight">
            <span className="text-[#1fa628]">{t("about.team.membersHeadingPart1")}</span>{" "}
            <span className="text-[#F3BE00]">{t("about.team.membersHeadingPart2")}</span>
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
            {t("about.team.membersSubtitlePre")}{" "}
            <span className="font-semibold text-[#1fa628]">{t("about.team.membersSubtitleBrand")}</span>{" "}
            {t("about.team.membersSubtitlePost")}
          </p>
        </motion.div>

        {/* CONTINUOUS HORIZONTAL MARQUEE TRACK */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Ambient Gradient Fades on Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#181B1C] dark:via-[#181B1C]/80 dark:to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#181B1C] dark:via-[#181B1C]/80 dark:to-transparent" />

          {/* Arrow Navigation */}
          <div className="mb-4 flex w-full items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollLeft}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#1fa628] hover:text-[#1fa628] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                aria-label={t("about.team.scrollLeft")}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#1fa628] hover:text-[#1fa628] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                aria-label={t("about.team.scrollRight")}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Infinite Marquee Track */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsMarqueePaused(true)}
            onMouseLeave={() => setIsMarqueePaused(false)}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <motion.div
              animate={
                isMarqueePaused
                  ? false
                  : {
                      x: ["0%", "-50%"],
                    }
              }
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 36,
                  ease: "linear",
                },
              }}
              className="flex gap-6 flex-shrink-0"
            >
              {marqueeMembers.map((member, index) => {
                const originalIndex = (index % developmentTeam.length) + 1;
                return (
                  <div
                    key={`${member.id}-${index}`}
                    className="w-[290px] sm:w-[320px] flex-shrink-0"
                  >
                    <MemberCard
                      member={member}
                      index={originalIndex}
                      accentColor="green"
                      floatingWave={true}
                      waveDelay={(index % 7) * 0.25}
                      onSelect={() => setSelectedMember(member)}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* RIGHT-SIDE SLIDE-OVER DRAWER MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailDrawer
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// Member Front Card Component
// -------------------------------------------------------------
interface MemberCardProps {
  member: TeamMember;
  index: number;
  accentColor?: "green" | "gold";
  floatingWave?: boolean;
  waveDelay?: number;
  onSelect?: () => void;
}

function MemberCard({
  member,
  index,
  accentColor = "green",
  floatingWave = false,
  waveDelay = 0,
  onSelect,
}: MemberCardProps) {
  const { t } = useLocale();
  const formattedIndex = index < 10 ? `0${index}` : `${index}`;
  const isGold = accentColor === "gold";

  const pillBg = isGold
    ? "bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300"
    : "bg-[#1fa628]/10 text-[#1fa628] border border-[#1fa628]/30 dark:bg-[#1fa628]/20 dark:text-[#1fa628]";

  const roleColor = isGold
    ? "text-[#F3BE00] dark:text-[#F3BE00]"
    : "text-[#1fa628]";

  const hoverIconColor = isGold
    ? "hover:text-[#F3BE00]"
    : "hover:text-[#1fa628]";

  return (
    <motion.div
      variants={cardVariants}
      animate={
        floatingWave
          ? {
              y: [0, -6, 0],
              transition: {
                repeat: Infinity,
                duration: 3.5,
                delay: waveDelay,
                ease: "easeInOut",
              },
            }
          : undefined
      }
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onSelect}
      className={`group relative flex h-[370px] w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/95 ${
        onSelect ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Top Index Badge */}
      <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-[18px] font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
        {formattedIndex}
      </div>

      {/* Orbit Avatar Container */}
      <div className="relative mx-auto mt-2 flex h-32 w-32 items-center justify-center">
        {/* Animated Dashed Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className={`absolute inset-0 rounded-full border border-dashed border-slate-300/80 dark:border-slate-700/80 transition-colors ${
            isGold ? "group-hover:border-[#F3BE00]/60" : "group-hover:border-[#1fa628]/60"
          }`}
        />

        {/* Avatar Frame */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md transition-transform duration-300 group-hover:scale-105 dark:border-slate-800 dark:bg-slate-800">
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Middle Text Info */}
      <div className="flex flex-col items-center">
        <h3
          className={`text-base font-bold text-slate-900 dark:text-white line-clamp-1 transition-colors ${
            isGold ? "group-hover:text-[#F3BE00]" : "group-hover:text-[#1fa628]"
          }`}
        >
          {member.name}
        </h3>

        <p className={`mt-1 text-[18px] font-bold uppercase tracking-wider ${roleColor}`}>
          {member.role}
        </p>

        <div
          className={`mt-2.5 inline-block rounded-full px-4 py-0.5 text-[18px] font-semibold ${pillBg}`}
        >
          {member.badge}
        </div>
      </div>

      {/* Bottom Social Links & Action prompt */}
      <div className="w-full border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <div className={`flex items-center px-1 ${onSelect ? "justify-between" : "justify-center"}`}>
          {/* Social Icons */}
          <div className="flex items-center gap-3.5 text-slate-400 dark:text-slate-500">
            <motion.a
              whileHover={{ scale: 1.25, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={member.social.github || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${hoverIconColor}`}
              aria-label={t("about.team.github")}
              onClick={(e) => e.stopPropagation()}
            >
              <GithubIcon className="h-4 w-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.25, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={member.social.telegram || "https://t.me"}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${hoverIconColor}`}
              aria-label={t("about.team.telegram")}
              onClick={(e) => e.stopPropagation()}
            >
              <Send className="h-4 w-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.25, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={member.social.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${hoverIconColor}`}
              aria-label={t("about.team.linkedin")}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkedinIcon className="h-4 w-4" />
            </motion.a>
          </div>

          {/* Quick Drawer Open Hint (Only for cards with onSelect) */}
          {onSelect && (
            <div className="flex items-center gap-1 text-[18px] font-semibold text-[#1fa628] opacity-80 group-hover:opacity-100 transition-opacity">
              <span>{t("about.team.profile")}</span>
              <ArrowRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// Right-Side Slide-Over Drawer Modal Component
// -------------------------------------------------------------
interface MemberDetailDrawerProps {
  member: TeamMember;
  onClose: () => void;
}

function MemberDetailDrawer({ member, onClose }: MemberDetailDrawerProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>("ABOUT");

  const tabs: TabType[] = ["ABOUT", "STACK", "PROJECTS", "JOURNEY"];
  const tabLabels: Record<TabType, string> = {
    ABOUT: t("about.team.tabAbout"),
    STACK: t("about.team.tabStack"),
    PROJECTS: t("about.team.tabProjects"),
    JOURNEY: t("about.team.tabJourney"),
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="relative z-50 flex h-full w-full max-w-md lg:max-w-lg flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Top Floating Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/70 hover:scale-105 active:scale-95"
          aria-label={t("about.team.closeDrawer")}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* 1. Member Cover Banner */}
          <div className="relative h-64 w-full overflow-hidden bg-slate-900">
            {/* Background Image with Blur Overlay */}
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              priority
              className="object-cover object-center opacity-40 blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Banner Content */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white/90 shadow-xl dark:border-slate-800">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 pb-1">
                <span className="inline-block rounded-full bg-[#1fa628]/20 px-3 py-0.5 text-[18px] font-bold uppercase tracking-wider text-[#22c55e] border border-[#22c55e]/30 mb-1">
                  {member.roleTitle || member.role}
                </span>
                <h3
                  id="drawer-title"
                  className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight line-clamp-1"
                >
                  {member.name}
                </h3>
                <p className="text-xs text-slate-300/90 font-medium">
                  {member.badge} • ID: {member.id}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Social Pill Buttons Bar */}
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <a
              href={member.social.github || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#1fa628] hover:text-[#1fa628] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>{t("about.team.github")}</span>
            </a>

            <a
              href={member.social.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#1fa628] hover:text-[#1fa628] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              <span>{t("about.team.linkedin")}</span>
            </a>

            <a
              href={member.social.telegram || "https://t.me"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#1fa628] hover:text-[#1fa628] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t("about.team.telegram")}</span>
            </a>
          </div>

          {/* 3. Navigation Tabs */}
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex space-x-6">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-3.5 text-xs font-bold tracking-wider transition-colors ${
                      isActive
                        ? "text-[#1fa628] dark:text-[#22c55e]"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {tabLabels[tab]}
                    {isActive && (
                      <motion.div
                        layoutId="activeDrawerTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1fa628] dark:bg-[#22c55e]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Tab Content Area */}
          <div className="p-6 space-y-6">
            {/* TAB: ABOUT */}
            {activeTab === "ABOUT" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Bio Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t("about.team.biography")}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {member.bio}
                  </p>
                </div>

                {/* Quote Block */}
                {member.quote && (
                  <div className="rounded-2xl border-l-4 border-[#1fa628] bg-[#1fa628]/10 p-4 dark:bg-[#1fa628]/15">
                    <div className="flex items-start gap-2.5">
                      <Quote className="h-5 w-5 flex-shrink-0 text-[#1fa628] rotate-180" />
                      <p className="text-xs sm:text-sm font-medium italic text-slate-800 dark:text-slate-200">
                        &quot;{member.quote}&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t("about.team.educationBackground")}
                  </h4>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1fa628]/15 text-[#1fa628]">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {member.education}
                      </p>
                      <p className="text-[18px] text-slate-500 dark:text-slate-400">
                        {t("about.team.studentYear")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Breakdown / Key Responsibilities */}
                {member.roleBreakdown && member.roleBreakdown.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {t("about.team.coreResponsibilities")}
                    </h4>
                    <div className="space-y-2">
                      {member.roleBreakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#1fa628] mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: STACK */}
            {activeTab === "STACK" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Categorized Skills */}
                {member.stackCategories && member.stackCategories.length > 0 ? (
                  member.stackCategories.map((group, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <Layers3 className="h-3.5 w-3.5 text-[#1fa628]" />
                        <span>{group.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200 hover:border-[#1fa628] transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === "PROJECTS" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {member.projects && member.projects.length > 0 ? (
                  member.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/60 space-y-2 hover:border-[#1fa628]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1fa628]/10 text-[#1fa628]">
                          <Briefcase className="h-3.5 w-3.5" />
                        </div>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {proj.name}
                        </h5>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {proj.description}
                      </p>

                      {proj.impact && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[18px] font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <Sparkles className="h-3 w-3 text-[#1fa628]" />
                          <span>{t("about.team.impact")}: {proj.impact}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    {t("about.team.noProjects")}
                  </p>
                )}
              </motion.div>
            )}

            {/* TAB: JOURNEY */}
            {activeTab === "JOURNEY" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {member.journey && member.journey.length > 0 ? (
                  <div className="relative border-l-2 border-slate-200 pl-6 dark:border-slate-800 space-y-6 ml-2">
                    {member.journey.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Icon */}
                        <div className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#1fa628] bg-white dark:bg-slate-900 text-[#1fa628]">
                          <div className="h-2 w-2 rounded-full bg-[#1fa628]" />
                        </div>

                        <span className="inline-block text-[18px] font-bold uppercase tracking-wider text-[#1fa628]">
                          {item.period}
                        </span>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                          {item.title}
                        </h5>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mt-1">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    {t("about.team.noJourney")}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* 5. Bottom Action Bar */}
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <Link
            href={member.social.linkedin || "https://linkedin.com"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1fa628] hover:bg-[#1fa628]/90 text-white px-4 py-2.5 text-xs font-semibold transition shadow-sm"
          >
            <span>{t("about.team.viewFullProfile")}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            {t("about.team.close")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}