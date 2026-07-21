"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Search,
  MapPin,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  Bookmark,
  ArrowRight,
  ChevronRight,
  User,
  Briefcase,
  Star,
  BellRing,
  Bot,
  UploadCloud,
  FileText,
  FolderKanban,
  ClipboardList,
  Settings,
  Search as SearchIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Font
// ---------------------------------------------------------------------------
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ---------------------------------------------------------------------------
// Design tokens — matched to the reference screenshot
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { label: "My Profile", icon: User },
  { label: "Applied Jobs", icon: Briefcase, active: true },
  { label: "Favorite Jobs", icon: Star },
  { label: "Job Alert", icon: BellRing },
  { label: "AI interview", icon: Bot },
  { label: "Submit CV", icon: UploadCloud },
  { label: "Resumes", icon: FileText },
  { label: "Project Submissions", icon: ClipboardList },
  { label: "My Applications", icon: LayoutGrid },
  { label: "My Portfolio", icon: FolderKanban },
  { label: "Settings", icon: Settings },
  { label: "Find Job", icon: SearchIcon },
];

type Job = {
  id: string;
  title: string;
  role: string;
  location: string;
  experience: string;
  bookmarked: boolean;
  highlighted?: boolean;
};

const JOBS: Job[] = [
  { id: "1", title: "Marketing", role: "Marketing Officer", location: "Siem Reap", experience: "1 Years experience", bookmarked: false },
  { id: "2", title: "Designer", role: "Interaction Designer", location: "Phnom Penh", experience: "2 Years experience", bookmarked: true },
  { id: "3", title: "Graphic Designer", role: "Junior Graphic Designer", location: "Banteay Meanchey", experience: "1 Years experience", bookmarked: true },
  { id: "4", title: "Full-stack", role: "Senior Full-stack", location: "Phnom Penh", experience: "3 Years experience", bookmarked: false, highlighted: true },
  { id: "5", title: "Front End", role: "Front End Developer", location: "Kampong Cham", experience: "3 Years experience", bookmarked: false },
  { id: "6", title: "Data Science", role: "Data Scientist", location: "Phnom Penh", experience: "3 Years experience", bookmarked: true },
  { id: "7", title: "UI/UX Designer", role: "UI/UX Designer", location: "Kampot", experience: "3 Years experience", bookmarked: false },
  { id: "8", title: "Data Analysis", role: "Data Analyst", location: "Siem Reap", experience: "3 Years experience", bookmarked: false },
  { id: "9", title: "Project Manager", role: "Project Manager", location: "Phnom Penh", experience: "3 Years experience", bookmarked: false },
  { id: "10", title: "Software Enginer", role: "Software Engineer", location: "Phnom Penh", experience: "3 Years experience", bookmarked: false },
  { id: "11", title: "Marketing Manager", role: "Marketing Manager", location: "Banteay Meanchey", experience: "3 Years experience", bookmarked: true },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const navListVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar() {
  const [active, setActive] = useState("Applied Jobs");

  return (
    <aside className="flex h-full w-[200px] shrink-0 flex-col bg-[#DCE7FB] px-4 py-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-8 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F5B32C] px-3.5 py-1.5 text-xs font-semibold text-[#1A2E44]"
      >
        <ChevronLeft size={14} />
        BACK
      </motion.button>

      <p className="mb-3 px-2 text-[11px] font-semibold tracking-wide text-[#1A2E44]/50">
        MAIN MENU
      </p>

      <motion.nav
        variants={navListVariants}
        initial="hidden"
        animate="show"
        className="flex flex-1 flex-col gap-1"
      >
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = active === label;
          return (
            <motion.button
              key={label}
              variants={navItemVariants}
              onClick={() => setActive(label)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-[#1A2E44]/70 transition-colors hover:text-[#1A2E44]"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon
                size={15}
                className={`relative z-10 ${isActive ? "text-[#16A34A]" : ""}`}
              />
              <span
                className={`relative z-10 ${isActive ? "font-medium text-[#1A2E44]" : ""}`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Search / filter top bar
// ---------------------------------------------------------------------------
function SearchBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-6 flex items-center gap-3 rounded-xl border border-[#E4E7EE] bg-white p-3"
    >
      <div className="flex flex-1 items-center gap-2 border-r border-[#E4E7EE] px-2">
        <Search size={16} className="text-[#9CA3AF]" />
        <input
          placeholder="Job title, Keyword..."
          className="w-full bg-transparent text-sm text-[#1A2E44] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 border-r border-[#E4E7EE] px-2">
        <MapPin size={16} className="text-[#22C55E]" />
        <input
          placeholder="Location"
          className="w-full bg-transparent text-sm text-[#1A2E44] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 px-2">
        <LayoutGrid size={16} className="text-[#9CA3AF]" />
        <span className="flex-1 text-sm text-[#9CA3AF]">Select Category</span>
        <ChevronDown size={14} className="text-[#9CA3AF]" />
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#128A3E]"
      >
        <Sparkles size={15} />
        AI Interview
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Filters sidebar (Location Radius, Candidate Level, Experiences, Education, Gender)
// ---------------------------------------------------------------------------
function RadioRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-[#4B5563]">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
          checked ? "border-[#3B82F6]" : "border-[#D1D5DB]"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="h-2 w-2 rounded-full bg-[#3B82F6]"
            />
          )}
        </AnimatePresence>
      </span>
      {label}
    </label>
  );
}

function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-[#4B5563]">
      <motion.span
        animate={{
          backgroundColor: checked ? "#F5C518" : "#FFFFFF",
          borderColor: checked ? "#F5C518" : "#D1D5DB",
        }}
        transition={{ duration: 0.15 }}
        className="flex h-4 w-4 items-center justify-center rounded border-2"
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5"
            >
              <motion.path
                d="M2 6l2.5 2.5L10 3"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.span>
      {label}
    </label>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#EEF0F4] py-4 first:pt-0 last:border-b-0">
      <p className="mb-2 text-sm font-semibold text-[#1A2E44]">{title}</p>
      {children}
    </div>
  );
}

function FiltersPanel() {
  const [radius, setRadius] = useState(22);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
      className="w-[190px] shrink-0 rounded-xl border border-[#E4E7EE] bg-white p-4"
    >
      <FilterSection title={`Location Radius: ${radius} miles`}>
        <input
          type="range"
          min={0}
          max={100}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#F0E4C0] accent-[#F5B32C]"
        />
      </FilterSection>

      <FilterSection title="Candidate Level">
        <RadioRow label="Entry Level" checked={false} />
        <RadioRow label="Mid Level" checked={true} />
        <RadioRow label="Expert Level" checked={false} />
      </FilterSection>

      <FilterSection title="Experiences">
        <CheckRow label="Freshers" checked={false} />
        <CheckRow label="1 - 2 Years" checked={false} />
        <CheckRow label="2 - 4 Years" checked={false} />
        <CheckRow label="4 - 6 Years" checked={false} />
        <CheckRow label="6 - 8 Years" checked={false} />
        <CheckRow label="8 - 10 Years" checked={false} />
        <CheckRow label="10 - 15 Years" checked={false} />
        <CheckRow label="15+ Years" checked={false} />
      </FilterSection>

      <FilterSection title="Education">
        <CheckRow label="All" checked={false} />
        <CheckRow label="High School" checked={false} />
        <CheckRow label="Intermediate" checked={false} />
        <CheckRow label="Graduation" checked={true} />
        <CheckRow label="Master Degree" checked={false} />
        <CheckRow label="Bachelor Degree" checked={false} />
      </FilterSection>

      <FilterSection title="Gender">
        <CheckRow label="Male" checked={true} />
        <CheckRow label="Female" checked={false} />
        <CheckRow label="Others" checked={false} />
      </FilterSection>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Job card + list
// ---------------------------------------------------------------------------
function JobCard({ job }: { job: Job }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 20px -8px rgba(26,46,68,0.15)",
      }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        job.highlighted
          ? "border-[#3B82F6] bg-white ring-1 ring-[#3B82F6]/30"
          : "border-transparent bg-white"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="h-11 w-11 shrink-0 rounded-lg bg-[#7C8798]"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#1A2E44]">
          {job.title}
        </p>
        <p className="truncate text-xs text-[#6B7280]">{job.role}</p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
          <MapPin size={11} />
          <span>{job.location}</span>
          <span className="text-[#D1D5DB]">•</span>
          <span>{job.experience}</span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.85 }}
        className={`shrink-0 rounded-md p-1.5 ${
          job.bookmarked ? "text-[#1A2E44]" : "text-[#C4CAD4]"
        }`}
      >
        <Bookmark size={16} fill={job.bookmarked ? "currentColor" : "none"} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={`flex shrink-0 items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-semibold ${
          job.highlighted
            ? "bg-[#16A34A] text-white hover:bg-[#128A3E]"
            : "bg-[#E9F8EE] text-[#16A34A] hover:bg-[#DCF3E4]"
        }`}
      >
        View Detail
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <ArrowRight size={13} />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

function JobList() {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col gap-3 rounded-xl border border-[#E4E7EE] bg-white p-3"
    >
      {JOBS.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
function Pagination() {
  const pages = ["01", "02", "03", "04", "05"];
  const [current, setCurrent] = useState("04");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="mt-4 flex items-center justify-center gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F5F7FB]"
      >
        <ChevronLeft size={14} />
      </motion.button>
      {pages.map((p) => {
        const isCurrent = p === current;
        return (
          <motion.button
            key={p}
            onClick={() => setCurrent(p)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
              isCurrent ? "text-white" : "text-[#9CA3AF] hover:bg-[#F5F7FB]"
            }`}
          >
            {isCurrent && (
              <motion.span
                layoutId="pagination-active-pill"
                className="absolute inset-0 rounded-full bg-[#16A34A]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{p}</span>
          </motion.button>
        );
      })}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A] text-white hover:bg-[#128A3E]"
      >
        <ChevronRight size={14} />
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AppliedJobsPage() {
  return (
    <div className={`flex min-h-screen w-full bg-[#EAF0FC] ${inter.className}`}>
      <Sidebar />

      <main className="flex-1 p-6">
        <SearchBar />

        <div className="flex gap-4">
          <FiltersPanel />

          <div className="flex-1">
            <JobList />
            <Pagination />
          </div>
        </div>
      </main>
    </div>
  );
}