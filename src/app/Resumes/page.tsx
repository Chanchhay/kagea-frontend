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
  Plus,
  Paperclip,
  Pencil,
  Trash2,
  Star,
  Sparkles,
  ChevronDown,
} from "lucide-react";

/* --------------------------------------------------------------------- */
/* Design tokens                                                         */
/* --------------------------------------------------------------------- */
const C = {
  navy: "#1A2E44",
  navySoft: "#5B7089",
  green: "#22C55E",
  greenSoft: "#DCFCE7",
  yellow: "#F5B93F",
  yellowSoft: "#FEF3C7",
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
  { label: "AI Interview", icon: Mic },
  { label: "Submit CV", icon: FileUp },
  { label: "Resumes", icon: FileText, active: true },
  { label: "Project Submissions", icon: FolderKanban },
  { label: "My Applications", icon: ClipboardList },
  { label: "My Portfolio", icon: LayoutGrid },
  { label: "Settings", icon: Settings },
  { label: "Find Job", icon: Search },
];

const filterTabs = ["All", "Default", "Has file", "Draft"];

type ResumeStatus = "Complete" | "Draft";

type Resume = {
  title: string;
  thumbnailBg: string;
  hasFile: boolean;
  status: ResumeStatus;
  updated: string;
  isDefault?: boolean;
  starFilled?: boolean;
  starDisabled?: boolean;
  tag: "Default" | "Has file" | "Draft";
};

const RESUMES: Resume[] = [
  {
    title: "Software Engineer CV",
    thumbnailBg: "bg-slate-100",
    hasFile: true,
    status: "Complete",
    updated: "Updated Oct 24, 2023",
    isDefault: true,
    starDisabled: true,
    tag: "Default",
  },
  {
    title: "Product Manager 2024",
    thumbnailBg: "bg-slate-100",
    hasFile: false,
    status: "Draft",
    updated: "Updated Nov 09, 2023",
    tag: "Draft",
  },
  {
    title: "UX Designer Portfolio",
    thumbnailBg: "bg-slate-900",
    hasFile: true,
    status: "Complete",
    updated: "Updated Oct 18, 2023",
    tag: "Has file",
  },
  {
    title: "Marketing Strategy Resume",
    thumbnailBg: "bg-slate-100",
    hasFile: true,
    status: "Complete",
    updated: "Updated Sep 30, 2023",
    starFilled: true,
    tag: "Has file",
  },
];

/* --------------------------------------------------------------------- */
/* Animation variants                                                    */
/* --------------------------------------------------------------------- */
const navContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

const navItemVariant: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const gridContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.18, ease: "easeIn" } },
};

/* --------------------------------------------------------------------- */
/* Small reusable pieces                                                 */
/* --------------------------------------------------------------------- */

function StatusBadge({ status }: { status: ResumeStatus }) {
  const isComplete = status === "Complete";
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block w-fit text-[11px] font-semibold px-3 py-1 rounded-full text-white"
      style={{ backgroundColor: isComplete ? C.green : C.yellow }}
    >
      {status}
    </motion.span>
  );
}

function ResumeCard({ resume }: { resume: Resume }) {
  return (
    <motion.div
      layout
      variants={cardVariant}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -5, boxShadow: "0 14px 28px -14px rgba(26,46,68,0.2)" }}
      className="rounded-2xl border p-3 flex flex-col"
      style={{ borderColor: C.border }}
    >
      {/* thumbnail */}
      <div className={`relative rounded-xl h-40 mb-3 overflow-hidden ${resume.thumbnailBg}`}>
        {resume.isDefault && (
          <span className="absolute top-2 right-2 text-[9px] font-bold tracking-wider text-slate-400 bg-white/80 px-2 py-0.5 rounded-full">
            DEFAULT
          </span>
        )}
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className={`w-20 h-28 rounded-md shadow-sm ${
              resume.thumbnailBg === "bg-slate-900" ? "bg-slate-800" : "bg-white"
            } border border-slate-200/60 flex flex-col gap-1.5 p-2`}
          >
            <div className="w-5 h-5 rounded-full bg-slate-200 mb-1" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-4/5 rounded bg-slate-200" />
            <div className="h-1 w-full rounded bg-slate-100 mt-1.5" />
            <div className="h-1 w-3/5 rounded bg-slate-100" />
            <div className="h-1 w-full rounded bg-slate-100" />
          </motion.div>
        </div>
      </div>

      {/* title + file status */}
      <h3 className="text-sm font-semibold" style={{ color: C.navy }}>
        {resume.title}
      </h3>
      <div className="flex items-center gap-1.5 mt-1 mb-2">
        <Paperclip size={12} style={{ color: resume.hasFile ? C.navySoft : C.yellow }} />
        <span className="text-xs" style={{ color: resume.hasFile ? C.navySoft : C.yellow }}>
          {resume.hasFile ? "File attached" : "No file"}
        </span>
      </div>

      <StatusBadge status={resume.status} />

      <p className="text-[11px] mt-2 mb-3" style={{ color: C.navySoft }}>
        {resume.updated}
      </p>

      {/* actions */}
      <div className="flex items-center gap-2 mt-auto">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex-1 flex items-center justify-center border rounded-lg py-1.5"
          style={{ borderColor: C.yellow }}
        >
          <Pencil size={14} style={{ color: C.yellow }} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex-1 flex items-center justify-center border border-red-200 rounded-lg py-1.5"
        >
          <Trash2 size={14} className="text-red-400" />
        </motion.button>
        <motion.button
          disabled={resume.starDisabled}
          whileHover={!resume.starDisabled ? { scale: 1.08 } : {}}
          whileTap={!resume.starDisabled ? { scale: 0.92, rotate: 15 } : {}}
          className={`flex-1 flex items-center justify-center border rounded-lg py-1.5 ${
            resume.starDisabled ? "opacity-40 border-slate-200" : "border-slate-200"
          }`}
        >
          <Star
            size={14}
            className={resume.starFilled ? "text-slate-900" : "text-slate-400"}
            fill={resume.starFilled ? "currentColor" : "none"}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------------------- */
/* Page                                                                   */
/* --------------------------------------------------------------------- */

export default function ResumesPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredResumes =
    activeTab === "All" ? RESUMES : RESUMES.filter((r) => r.tag === activeTab);

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ backgroundColor: C.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* --------------------------------------------------------- */}
      {/* Sidebar */}
      {/* --------------------------------------------------------- */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex md:w-64 shrink-0 flex-col gap-6 px-5 py-6"
        style={{ backgroundColor: C.card, borderRight: `1px solid ${C.border}` }}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: C.yellow }}
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
            style={{ color: C.navySoft }}
          >
            Main Menu
          </p>
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <motion.button
              key={label}
              variants={navItemVariant}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium"
              style={active ? { color: "#FFFFFF" } : { color: C.navySoft }}
            >
              {active && (
                <motion.span
                  layoutId="activeResumesNav"
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: C.navy }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Icon
                size={18}
                className="relative z-10"
                style={active ? { color: C.yellow } : undefined}
              />
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.aside>

      {/* --------------------------------------------------------- */}
      {/* Main content */}
      {/* --------------------------------------------------------- */}
      <main className="flex-1 px-6 py-8 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-wrap items-start justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.navy }}>
              Resumes
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: C.yellow }}>
              Manage and organize your resumes
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: C.navy }}
          >
            <Plus size={16} />
            Create New Resume
          </motion.button>
        </motion.div>

        {/* Tabs + sort */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between border-b mb-6 pb-3"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center gap-6">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-3 -mb-3 text-sm font-semibold"
                style={{ color: activeTab === tab ? C.navy : C.yellow }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.span
                    layoutId="activeResumeTab"
                    className="absolute left-0 -bottom-[1px] w-full h-[2px] rounded-full"
                    style={{ backgroundColor: C.navy }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: C.yellow }}
          >
            Sort by: Newest
            <ChevronDown size={14} />
          </button>
        </motion.div>

        {/* Resume grid */}
        <motion.div
          layout
          variants={gridContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume.title} resume={resume} />
            ))}
          </AnimatePresence>

          {/* Add new resume card */}
          <motion.button
            layout
            variants={cardVariant}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.02, borderColor: C.yellow }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 px-6 text-center"
            style={{ borderColor: C.border }}
          >
            <motion.span
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.25 }}
              className="w-11 h-11 rounded-full border flex items-center justify-center"
              style={{ borderColor: C.border }}
            >
              <Plus size={18} style={{ color: C.navySoft }} />
            </motion.span>
            <span className="text-xs font-medium max-w-[160px]" style={{ color: C.yellow }}>
              Add another resume version to tailor your applications
            </span>
          </motion.button>
        </motion.div>

        {/* AI review banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
          className="rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
          style={{ backgroundColor: C.green }}
        >
          <div className="flex items-start gap-3">
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: C.yellow }}
            >
              <Sparkles size={18} className="text-white" />
            </motion.span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">
                HireFlow AI Review
              </p>
              <p className="text-white/90 text-xs max-w-xl leading-relaxed">
                Our AI just reviewed your &ldquo;Software Engineer CV&rdquo; and
                found 3 areas for improvement to increase your ATS score. Want to
                see the feedback?
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-sm font-semibold px-5 py-2 rounded-full shrink-0"
            style={{ color: C.green }}
          >
            Review Now
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}