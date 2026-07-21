"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowLeft,
  User,
  Briefcase,
  Heart,
  Bell,
  Mic,
  FileUp,
  FileText,
  FolderKanban,
  ClipboardList,
  LayoutGrid,
  Settings,
  Search,
  Pause,
  Play,
  SkipForward,
  XCircle,
  ClipboardCheck,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Design tokens (matches platform system: navy / green / yellow / blue on light
// blue-gray background, Inter font, 12px card radius)
// -----------------------------------------------------------------------------
const COLORS = {
  navy: "#1A2E44",
  navySoft: "#5B7089",
  green: "#22C55E",
  greenSoft: "#DCFCE7",
  yellow: "#EAB308",
  yellowSoft: "#FEF9C3",
  blue: "#3B82F6",
  blueSoft: "#DBEAFE",
  teal: "#2DB5A3",
  tealSoft: "#D9F5F0",
  purple: "#8B5CF6",
  purpleSoft: "#EDE6FE",
  bg: "#EEF3F9",
  card: "#FFFFFF",
  border: "#E4EAF2",
};

type NavItem = {
  label: string;
  icon: React.ElementType;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "My Profile", icon: User },
  { label: "Applied Jobs", icon: Briefcase },
  { label: "Favorite Jobs", icon: Heart },
  { label: "Job Alert", icon: Bell },
  { label: "AI Interview", icon: Mic, active: true },
  { label: "Submit CV", icon: FileUp },
  { label: "Resumes", icon: FileText },
  { label: "Project Submission", icon: FolderKanban },
  { label: "My Applications", icon: ClipboardList },
  { label: "My Portfolio", icon: LayoutGrid },
  { label: "Settings", icon: Settings },
  { label: "Find Job", icon: Search },
];

type Category =
  | "All"
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "Mobile"
  | "DevOps"
  | "Data Science";

const CATEGORIES: Category[] = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "Data Science",
];

type InterviewCard = {
  title: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  description: string;
  chips: string[];
  buttonColor: string;
  category: Category;
};

const INTERVIEWS: InterviewCard[] = [
  {
    title: "AI-Guided Frontend Developer Interview",
    tag: "FRONTEND",
    tagColor: COLORS.green,
    tagBg: COLORS.greenSoft,
    description:
      "Comprehensive frontend interview covering HTML, CSS, JavaScript, React, and problem solving.",
    chips: ["HTML", "CSS", "React"],
    buttonColor: COLORS.navy,
    category: "Frontend",
  },
  {
    title: "AI-Guided Mobile Developer Interview",
    tag: "MOBILE",
    tagColor: COLORS.blue,
    tagBg: COLORS.blueSoft,
    description:
      "Mobile application interview covering Flutter, Android, iOS, and system design.",
    chips: ["Mobile", "Android"],
    buttonColor: COLORS.blue,
    category: "Mobile",
  },
  {
    title: "Full Stack Architecture Interview",
    tag: "FULLSTACK",
    tagColor: COLORS.green,
    tagBg: COLORS.greenSoft,
    description:
      "System design interview covering full stack architecture, backend APIs, databases, scalability, and cloud infrastructure.",
    chips: ["FullStack", "Backend", "Cloud"],
    buttonColor: "#F59E0B",
    category: "Full Stack",
  },
  {
    title: "Backend Engineering Interview",
    tag: "BACKEND",
    tagColor: COLORS.teal,
    tagBg: COLORS.tealSoft,
    description:
      "API design, microservices, database optimization, security, and server-side programming.",
    chips: ["API", "Spring Boot"],
    buttonColor: COLORS.teal,
    category: "Backend",
  },
  {
    title: "Data Science & ML Interview",
    tag: "DATA SCIENCE",
    tagColor: COLORS.yellow,
    tagBg: COLORS.yellowSoft,
    description:
      "Statistics, machine learning, model evaluation, data pipelines, and ML concepts.",
    chips: ["ML", "SQL"],
    buttonColor: COLORS.yellow,
    category: "Data Science",
  },
  {
    title: "Leadership & Soft Skills Interview",
    tag: "LEADERSHIP",
    tagColor: COLORS.purple,
    tagBg: COLORS.purpleSoft,
    description:
      "Communication, teamwork, conflict resolution, leadership, and collaboration scenarios.",
    chips: ["Leadership", "Communication"],
    buttonColor: "#D946A8",
    category: "Full Stack",
  },
];

// -----------------------------------------------------------------------------
// Animation variants
// -----------------------------------------------------------------------------
const navContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.1 },
  },
};

const navItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardGrid: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function AiInterviewPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [isPaused, setIsPaused] = useState(false);

  const filteredInterviews =
    activeCategory === "All"
      ? INTERVIEWS
      : INTERVIEWS.filter((i) => i.category === activeCategory);

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ backgroundColor: COLORS.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar */}
      {/* ------------------------------------------------------------------ */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex md:w-64 shrink-0 flex-col gap-6 px-5 py-6"
        style={{ backgroundColor: COLORS.card, borderRight: `1px solid ${COLORS.border}` }}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: COLORS.yellow }}
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        <motion.div
          variants={navContainer}
          initial="hidden"
          animate="show"
          className="mt-2 flex flex-col gap-1"
        >
          <p
            className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: COLORS.navySoft }}
          >
            Main Menu
          </p>
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <motion.button
              key={label}
              variants={navItem}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium"
              style={active ? { color: COLORS.green } : { color: COLORS.navySoft }}
            >
              {active && (
                <motion.span
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: COLORS.greenSoft }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.aside>

      {/* ------------------------------------------------------------------ */}
      {/* Main content */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 px-6 py-8 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold" style={{ color: COLORS.navy }}>
            Your Interviews
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLORS.navySoft }}>
            Track your completed AI interviews and performance reports.
          </p>
        </motion.div>

        {/* Empty state card */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mb-10 flex flex-col items-center justify-center gap-4 rounded-xl py-14 text-center"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.greenSoft }}
          >
            <ClipboardCheck size={22} style={{ color: COLORS.green }} />
          </motion.div>
          <p className="text-sm font-medium" style={{ color: COLORS.navySoft }}>
            Your interview history will appear here.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: COLORS.green }}
          >
            Explore Interview Simulations
          </motion.button>
        </motion.div>

        {/* Live preview session */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-10 rounded-xl p-6"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>
                AI Interview Session — Live Preview
              </h2>
              <span
                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: COLORS.greenSoft, color: COLORS.green }}
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: COLORS.green }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                LIVE
              </span>
            </div>
            <div className="text-right">
              <p
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: COLORS.navySoft }}
              >
                Remaining Time
              </p>
              <p className="text-lg font-bold" style={{ color: COLORS.navy }}>
                14:29
              </p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: COLORS.navy }}>
              Full Stack Coding Interview
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: COLORS.bg, color: COLORS.navySoft }}
            >
              Round 2
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: COLORS.bg, color: COLORS.navySoft }}
            >
              Medium
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Avatars + question */}
            <div className="lg:col-span-2">
              <div
                className="flex items-center justify-center gap-10 rounded-xl py-8"
                style={{ backgroundColor: COLORS.bg }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    {/* pulsing "speaking" rings */}
                    {!isPaused && (
                      <>
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: COLORS.green, opacity: 0.25 }}
                          animate={{ scale: [1, 1.5], opacity: [0.35, 0] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: COLORS.green, opacity: 0.25 }}
                          animate={{ scale: [1, 1.5], opacity: [0.35, 0] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.5,
                          }}
                        />
                      </>
                    )}
                    <div
                      className="relative flex h-20 w-20 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: COLORS.green }}
                    >
                      <motion.div
                        animate={
                          !isPaused
                            ? { scale: [1, 1.12, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Mic size={28} />
                      </motion.div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>
                    AI Interviewer
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isPaused ? "paused" : "speaking"}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: COLORS.greenSoft, color: COLORS.green }}
                    >
                      {isPaused ? "Paused" : "Speaking"}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full"
                    style={{ backgroundColor: COLORS.blueSoft }}
                  >
                    <User size={32} style={{ color: COLORS.blue }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>
                    Lina Lut
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{ backgroundColor: COLORS.blueSoft, color: COLORS.blue }}
                  >
                    Listening
                  </span>
                </div>
              </div>

              <motion.div
                key={isPaused ? "q-paused" : "q-active"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-xl p-4"
                style={{ backgroundColor: COLORS.greenSoft }}
              >
                <p
                  className="mb-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: COLORS.green }}
                >
                  Current Question
                </p>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.navy }}>
                  “Tell me about a challenging project you’ve worked on, such as a
                  job portal platform. How did you design the AI interview workflow
                  and matching system?”
                </p>
              </motion.div>

              <div className="mt-4 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
                  style={{ borderColor: COLORS.border, color: COLORS.navy }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isPaused ? "play" : "pause"}
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      {isPaused ? <Play size={16} /> : <Pause size={16} />}
                      {isPaused ? "Resume" : "Pause"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  <SkipForward size={16} />
                  Next Question
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "#FEF2F2" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
                  style={{ borderColor: "#FCA5A5", color: "#EF4444" }}
                >
                  <XCircle size={16} />
                  End Session
                </motion.button>
              </div>
            </div>

            {/* Live analysis */}
            <div className="rounded-xl p-5" style={{ backgroundColor: COLORS.bg }}>
              <p className="mb-4 text-sm font-bold" style={{ color: COLORS.navy }}>
                Live Analysis
              </p>
              <AnalysisBar label="Technical Accuracy" value={82} color={COLORS.green} delay={0} />
              <AnalysisBar
                label="Communication Clarity"
                value={88}
                color={COLORS.green}
                delay={0.12}
              />
              <AnalysisBar
                label="Confidence Score"
                value={76}
                color={COLORS.yellow}
                delay={0.24}
              />

              <div className="mt-6 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: COLORS.blueSoft }}
                >
                  <User size={14} style={{ color: COLORS.blue }} />
                </div>
                <span className="text-xs font-medium" style={{ color: COLORS.navySoft }}>
                  My Profile
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Take Interviews */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>
                Take Interviews
              </h2>
              <p className="text-sm" style={{ color: COLORS.navySoft }}>
                Browse AI-powered interview simulations by role and category.
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-full px-4 py-1.5 text-sm font-semibold"
                style={
                  activeCategory === cat
                    ? { color: "#FFFFFF" }
                    : {
                        backgroundColor: COLORS.card,
                        color: COLORS.navySoft,
                        border: `1px solid ${COLORS.border}`,
                      }
                }
              >
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: COLORS.green }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>

          <motion.div
            layout
            variants={cardGrid}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredInterviews.map((item) => (
                <motion.div
                  key={item.title}
                  layout
                  variants={cardItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -12px rgba(26,46,68,0.18)" }}
                  className="flex flex-col rounded-xl p-5"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <span
                    className="mb-3 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide"
                    style={{ backgroundColor: item.tagBg, color: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                  <h3 className="mb-2 text-sm font-bold leading-snug" style={{ color: COLORS.navy }}>
                    {item.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed" style={{ color: COLORS.navySoft }}>
                    {item.description}
                  </p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {item.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: COLORS.bg, color: COLORS.navySoft }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="mt-auto rounded-full py-2.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: item.buttonColor }}
                  >
                    Start Interview
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Small helper component for the live analysis progress bars
// -----------------------------------------------------------------------------
function AnalysisBar({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
        <span style={{ color: "#5B7089" }}>{label}</span>
        <motion.span
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.3 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: COLORS.border }}>
        <motion.div
          className="h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}