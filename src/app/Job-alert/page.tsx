"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  User,
  Briefcase,
  Bookmark,
  Bell,
  Settings,
  Layers,
  FileText,
  ClipboardList,
  Grid3x3,
  UserCircle2,
  SlidersHorizontal,
  Search,
  MapPin,
  Wallet,
  Pencil,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JobAlertItem {
  id: string;
  title: string;
  role: string;
  location: string;
  experience: string;
  bookmarked: boolean;
  highlighted?: boolean;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const mainMenu: NavItem[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "applied", label: "Applied Jobs", icon: Briefcase },
  { key: "favorite", label: "Favorite Jobs", icon: Bookmark },
  { key: "alert", label: "Job Alert", icon: Bell },
  { key: "interview", label: "AI interview", icon: Settings },
  { key: "submit", label: "Submit CV", icon: Layers },
  { key: "resumes", label: "Resumes", icon: FileText },
  { key: "projects", label: "Project Submissions", icon: ClipboardList },
  { key: "applications", label: "My Applications", icon: Grid3x3 },
  { key: "portfolio", label: "My Portfolio", icon: UserCircle2 },
  { key: "settings", label: "Settings", icon: SlidersHorizontal },
  { key: "find", label: "Find Job", icon: Search },
];

const initialJobAlerts: JobAlertItem[] = [
  {
    id: "1",
    title: "Designer",
    role: "Interaction Designer",
    location: "PhnomPenh",
    experience: "3 Years experience",
    bookmarked: true,
  },
  {
    id: "2",
    title: "Graphic Designer",
    role: "Junior Graphic Designer",
    location: "Beanteaymeanchey",
    experience: "1 Years experience",
    bookmarked: true,
  },
  {
    id: "3",
    title: "Software Enginer",
    role: "Software Engineer",
    location: "PhnomPenh",
    experience: "3 Years experience",
    bookmarked: false,
  },
  {
    id: "4",
    title: "Full-stack",
    role: "Senior Full-stack",
    location: "PhnomPenh",
    experience: "3 Years experience",
    bookmarked: false,
    highlighted: true,
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const listContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const navContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const navItemVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

// ---------------------------------------------------------------------------
// Sub components
// ---------------------------------------------------------------------------

function Sidebar({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <aside className="w-[220px] shrink-0 px-4 py-6">
      <motion.button
        type="button"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.94 }}
        className="mb-8 flex items-center gap-1 rounded-full bg-[#F5B32C] px-5 py-2 text-sm font-semibold text-[#1A2E44]"
      >
        <motion.span
          animate={{ x: [0, -2, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.6 }}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </motion.span>
        BACK
      </motion.button>

      <p className="mb-3 px-2 text-xs font-semibold tracking-wide text-slate-400">
        MAIN MENU
      </p>

      <motion.nav
        variants={navContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1"
      >
        {mainMenu.map(({ key, label, icon: Icon }) => {
          const active = key === activeKey;
          return (
            <motion.a
              key={key}
              href="#"
              variants={navItemVariant}
              onClick={(e) => {
                e.preventDefault();
                onSelect(key);
              }}
              whileHover={{ x: active ? 0 : 3 }}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] text-slate-500 transition-colors"
              style={{ color: active ? "#1A2E44" : undefined }}
            >
              {active && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Icon
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                  style={{ color: active ? "#1A2E44" : undefined }}
                />
                <span className={active ? "font-semibold" : "font-normal"}>
                  {label}
                </span>
              </span>
            </motion.a>
          );
        })}
      </motion.nav>
    </aside>
  );
}

function JobCard({
  job,
  onToggleBookmark,
}: {
  job: JobAlertItem;
  onToggleBookmark: (id: string) => void;
}) {
  const { title, role, location, experience, bookmarked, highlighted } = job;

  return (
    <motion.div
      variants={cardVariant}
      layout
      whileHover={{
        y: -3,
        boxShadow:
          "0 12px 24px -8px rgba(26,46,68,0.12), 0 4px 8px -4px rgba(26,46,68,0.08)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex items-center justify-between rounded-2xl border bg-white p-4 ${
        highlighted
          ? "border-[#22C55E] ring-1 ring-[#22C55E]/40"
          : "border-slate-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="h-16 w-16 shrink-0 rounded-xl bg-slate-400"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        <div>
          <h3
            className={`text-[15px] font-semibold ${
              highlighted ? "text-[#22C55E]" : "text-[#1A2E44]"
            }`}
          >
            {title}
          </h3>
          <p className="mt-0.5 text-[13px] text-slate-500">{role}</p>

          <div className="mt-2 flex items-center gap-4 text-[12px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" strokeWidth={1.8} />
              {experience}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          aria-label="Bookmark job"
          onClick={() => onToggleBookmark(job.id)}
          whileTap={{ scale: 0.85 }}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            highlighted
              ? "bg-[#DCFCE7] text-[#22C55E]"
              : bookmarked
              ? "bg-[#1A2E44] text-white"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(bookmarked || highlighted)}
              initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex"
            >
              <Bookmark
                className="h-4 w-4"
                strokeWidth={1.8}
                fill={bookmarked || highlighted ? "currentColor" : "none"}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          type="button"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          className={`group flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold ${
            highlighted
              ? "bg-[#22C55E] text-white"
              : "bg-[#DCFCE7] text-[#16A34A]"
          }`}
        >
          View Detail
          <motion.span
            className="flex"
            variants={{ hover: { x: 4 } }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlertItem[]>(initialJobAlerts);
  const [activeKey, setActiveKey] = useState("alert");
  const newCount = alerts.length + 5;

  const toggleBookmark = (id: string) => {
    setAlerts((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, bookmarked: !job.bookmarked } : job
      )
    );
  };

  return (
    <div
      className="min-h-screen bg-[#E8ECF7] p-6"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto flex max-w-6xl overflow-hidden rounded-3xl border-2 border-[#8B7BD8]/30 bg-[#DDE3F7]"
      >
        <Sidebar activeKey={activeKey} onSelect={setActiveKey} />

        <main className="flex-1 bg-white p-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mb-5 flex items-center justify-between"
          >
            <h1 className="text-[17px] font-semibold text-[#1A2E44]">
              Job Alerts{" "}
              <span className="text-sm font-normal text-slate-400">
                ({newCount} new jobs)
              </span>
            </h1>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#1A2E44]"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
              Edit Job Alerts
            </motion.button>
          </motion.div>

          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            <AnimatePresence>
              {alerts.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}