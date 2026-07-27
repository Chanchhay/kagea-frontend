"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  User,
  Briefcase,
  Heart,
  Bell,
  Video,
  UploadCloud,
  FileText,
  ClipboardList,
  Wallet,
  Settings,
  Search,
  Link2,
  CheckCircle2,
  X,
  ImageIcon,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

/* -------------------------------------------------------------------------- */
/*  Design tokens (HireFlow design system)                                    */
/* -------------------------------------------------------------------------- */
const COLORS = {
  navy: "#1A2E44",
  green: "#22C55E",
  yellow: "#F5B32C",
  page: "#DCE4FA",
  sidebar: "#EEF2FE",
};

/* -------------------------------------------------------------------------- */
/*  Types & data (copied verbatim from the reference design)                  */
/* -------------------------------------------------------------------------- */
type TabKey = "all" | "pending" | "review" | "approved" | "rejected";

type Status = "PENDING" | "UNDER REVIEW" | "APPROVED" | "REJECTED";

interface Submission {
  id: string;
  status: Status;
  submittedAt: string;
  description: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const SUBMISSIONS: Submission[] = [
  {
    id: "PA-2045",
    status: "UNDER REVIEW",
    submittedAt: "Submitted Jan 18, 2024 at 02:15 PM",
    description:
      "Focused on the responsive design patterns for the dashboard components. Ensured WCAG AA accessibility standards... ",
  },
  {
    id: "PA-2041",
    status: "APPROVED",
    submittedAt: "Submitted Jan 15, 2024 at 10:30 AM",
    description:
      "Implemented the full-stack authentication flow using NextAuth and integrated the OpenAI completion API for dynamic feedback... ",
  },
  {
    id: "PA-1988",
    status: "REJECTED",
    submittedAt: "Submitted Dec 20, 2023 at 09:05 AM",
    description:
      "The submission was missing the final testing report required in the brief. I've re-read the documentation and am preparing a resubmission... ",
  },
  {
    id: "PA-2055",
    status: "PENDING",
    submittedAt: "Submitted just now",
    description: "No additional notes provided for this submission.",
  },
];

const STATUS_BADGE: Record<Status, string> = {
  "UNDER REVIEW": "bg-[#E0EAFF] text-[#3556C7]",
  APPROVED: "bg-[#DCFCE7] text-[#15803D]",
  REJECTED: "bg-[#FEE2E2] text-[#B91C1C]",
  PENDING: "bg-[#F1F2F4] text-[#6B7280]",
};

const STATUS_BAR: Record<Status, string> = {
  "UNDER REVIEW": "#3556C7",
  APPROVED: "#22C55E",
  REJECTED: "#EF4444",
  PENDING: "#9CA3AF",
};

const STATUS_TAB_MAP: Record<Exclude<TabKey, "all">, Status> = {
  pending: "PENDING",
  review: "UNDER REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
};

const MENU_ITEMS = [
  { label: "My Profile", icon: User },
  { label: "Applied Jobs", icon: Briefcase },
  { label: "Favorite Jobs", icon: Heart },
  { label: "Job Alert", icon: Bell },
  { label: "AI Interview", icon: Video },
  { label: "Submit CV", icon: UploadCloud },
  { label: "Resumes", icon: FileText },
  { label: "Project Submissions", icon: ClipboardList },
  { label: "My Applications", icon: ClipboardList },
  { label: "My Portfolio", icon: Wallet },
  { label: "Settings", icon: Settings },
  { label: "Find Job", icon: Search },
];

/* -------------------------------------------------------------------------- */
/*  Shared motion variants                                                    */
/* -------------------------------------------------------------------------- */
const menuListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

const cardListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } },
};

/* -------------------------------------------------------------------------- */
/*  Sidebar                                                                   */
/* -------------------------------------------------------------------------- */
function Sidebar() {
  const [active, setActive] = useState("Project Submissions");

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-56 shrink-0 p-4 flex flex-col gap-6"
      style={{ backgroundColor: COLORS.sidebar }}
    >
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold w-fit"
        style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
      >
        <motion.span whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <ArrowLeft size={16} />
        </motion.span>
        BACK
      </motion.button>

      <div>
        <p className="text-[11px] font-semibold tracking-wide text-gray-400 px-2 mb-2">
          MAIN MENU
        </p>
        <motion.nav
          variants={menuListVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1"
        >
          {MENU_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <motion.button
                key={label}
                variants={menuItemVariants}
                whileHover={!isActive ? { x: 3 } : undefined}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(label)}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  isActive ? "font-semibold bg-white" : "text-gray-500 hover:bg-white/60"
                }`}
                style={isActive ? { color: COLORS.navy } : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                    style={{ backgroundColor: COLORS.navy }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <motion.span
                  className="relative z-10 flex items-center gap-3"
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.35 }}
                >
                  <Icon size={16} />
                  {label}
                </motion.span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>
    </motion.aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Submission card                                                           */
/* -------------------------------------------------------------------------- */
function SubmissionCard({ item }: { item: Submission }) {
  return (
    <motion.div
      layout
      variants={cardItemVariants}
      whileHover={{
        y: -3,
        boxShadow: "0 8px 20px -6px rgba(26,46,68,0.10)",
        transition: { duration: 0.2 },
      }}
      className="relative border border-gray-100 rounded-xl pl-5 pr-4 py-4 bg-white overflow-hidden"
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: STATUS_BAR[item.status] }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-sm" style={{ color: COLORS.navy }}>
            Project Assignment #{item.id}
          </h3>
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
            className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full ${STATUS_BADGE[item.status]}`}
          >
            {item.status === "PENDING" ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                {item.status}
              </motion.span>
            ) : (
              item.status
            )}
          </motion.span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{item.submittedAt}</span>
      </div>

      <div className="flex items-center gap-4 mt-1.5 text-xs font-medium">
        <motion.a
          href="#"
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 hover:underline"
          style={{ color: COLORS.green }}
        >
          <ExternalLink size={12} />
          View Submission
        </motion.a>
        <motion.a
          href="#"
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 text-gray-500 hover:underline"
        >
          <FaGithub size={12} />
          GitHub Repo
        </motion.a>
      </div>

      <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
        {item.description}
        {item.description.trim().endsWith("...") && (
          <a href="#" className="font-medium hover:underline ml-1" style={{ color: COLORS.green }}>
            Read more
          </a>
        )}
      </p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Submit New Project modal                                                 */
/* -------------------------------------------------------------------------- */
function SubmitProjectModal({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const maxNotes = 500;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1100);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 relative overflow-hidden"
      >
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                <CheckCircle2 size={48} className="text-[#22C55E]" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-semibold"
                style={{ color: COLORS.navy }}
              >
                Project submitted!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: COLORS.navy }}>
            Submit New Project
          </h2>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-2 bg-[#DCFCE7] rounded-lg p-3 mb-4"
        >
          <CheckCircle2 size={16} className="text-[#15803D] mt-0.5 shrink-0" />
          <p className="text-xs text-[#15803D] leading-relaxed">
            Ensure your GitHub repository is set to public or includes the
            platform reviewer as a collaborator before submitting.
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Project Assignment
            </label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition-shadow">
                <option>Select an open assignment...</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Submission URL/Live Demo
            </label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="https://my-project.vercel.app"
                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition-shadow"
              />
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            <label className="text-xs font-semibold text-gray-500 block mb-1">GitHub URL</label>
            <div className="relative">
              <FaGithub size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition-shadow"
              />
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              maxLength={maxNotes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe your approach, technologies used, or any challenges overcome..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition-shadow"
            />
            <motion.p
              key={notes.length}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-gray-300 text-right mt-1"
            >
              {notes.length}/{maxNotes} characters
            </motion.p>
          </motion.div>

          <motion.label
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            animate={{
              scale: dragActive ? 1.02 : 1,
              backgroundColor: dragActive ? "#F0FDF4" : "#F9FAFB",
              borderColor: dragActive ? "#22C55E" : "#E5E7EB",
            }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 text-gray-400 text-xs font-medium cursor-pointer"
          >
            <motion.span
              animate={dragActive ? { y: [0, -4, 0] } : { y: 0 }}
              transition={{ duration: 0.6, repeat: dragActive ? Infinity : 0 }}
            >
              <ImageIcon size={20} className={dragActive ? "text-[#22C55E]" : "text-gray-300"} />
            </motion.span>
            {dragActive ? "DROP TO UPLOAD" : "DRAG & DROP SCREENSHOTS"}
            <input type="file" className="hidden" multiple />
          </motion.label>
        </motion.div>

        <div className="flex items-center justify-between mt-5">
          <motion.button
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: COLORS.green }}
          >
            Submit Project
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main page                                                                 */
/* -------------------------------------------------------------------------- */
export default function ProjectSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    if (activeTab === "all") return SUBMISSIONS;
    const status = STATUS_TAB_MAP[activeTab];
    return SUBMISSIONS.filter((s) => s.status === status);
  }, [activeTab]);

  return (
    <div
      className="min-h-screen w-full font-sans flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.page, fontFamily: "Inter, sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex overflow-hidden"
      >
        <Sidebar />

        <main className="flex-1 p-6 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-bold"
                style={{ color: COLORS.navy }}
              >
                Project Submissions
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="text-xs text-gray-400 mt-1"
              >
                Track and manage your submitted projects and technical assessments.
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.04, boxShadow: "0 6px 16px -4px rgba(34,197,94,0.45)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white whitespace-nowrap"
              style={{ backgroundColor: COLORS.green }}
            >
              <motion.span
                className="text-sm leading-none"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.span>
              Submit New Project
            </motion.button>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 mb-4">
            <div className="flex items-center gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative px-3 py-2.5 text-xs font-medium"
                    style={{ color: isActive ? COLORS.green : "#9CA3AF" }}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.span
                        layoutId="tabs-underline"
                        className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                        style={{ backgroundColor: COLORS.green }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 pb-2.5"
            >
              SORT BY
              <span className="flex items-center gap-0.5" style={{ color: COLORS.navy }}>
                Newest First
                <motion.span whileHover={{ y: 2 }}>
                  <ChevronDown size={12} />
                </motion.span>
              </span>
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={cardListVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col gap-3"
            >
              {filtered.length > 0 ? (
                filtered.map((item) => <SubmissionCard key={item.id} item={item} />)
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-400 text-center py-10"
                >
                  No submissions in this category yet.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      <AnimatePresence>
        {showModal && <SubmitProjectModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}