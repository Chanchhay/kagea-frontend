"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  Gem,
  User,
  Briefcase,
  Bookmark,
  Bell,
  Settings as SettingsIcon,
  Layers,
  FileText,
  ClipboardList,
  Grid3x3,
  UserCircle2,
  SlidersHorizontal,
  Search,
  UploadCloud,
  Link2,
  Globe2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
}

interface TabItem {
  key: string;
  label: string;
  icon: React.ElementType;
}

interface ResumeFile {
  id: string;
  name: string;
  size: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const mainMenu: NavItem[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "applied", label: "Applied Jobs", icon: Briefcase },
  { key: "favorite", label: "Favorite Jobs", icon: Bookmark },
  { key: "alert", label: "Job Alert", icon: Bell },
  { key: "interview", label: "AI interview", icon: SettingsIcon },
  { key: "submit", label: "Submit CV", icon: Layers },
  { key: "resumes", label: "Resumes", icon: FileText },
  { key: "projects", label: "Project Submissions", icon: ClipboardList },
  { key: "applications", label: "My Applications", icon: Grid3x3 },
  { key: "portfolio", label: "My Portfolio", icon: UserCircle2 },
  { key: "settings", label: "Settings", icon: SlidersHorizontal },
  { key: "find", label: "Find Job", icon: Search },
];

const tabs: TabItem[] = [
  { key: "personal", label: "Personal", icon: User },
  { key: "profile", label: "Profile", icon: UserCircle2 },
  { key: "social", label: "Social Links", icon: Globe2 },
  { key: "account", label: "Account Setting", icon: SettingsIcon },
];

const initialResumes: ResumeFile[] = [
  { id: "1", name: "Professional Resume", size: "3.5 MB" },
  { id: "2", name: "Product Designer", size: "4.7 MB" },
  { id: "3", name: "Visual Designer", size: "1.3 MB" },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fieldContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const fieldItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const cardContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const navContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const navItemVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

// ---------------------------------------------------------------------------
// Sidebar
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
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex items-center gap-1.5 px-1 text-[13px] font-semibold text-[#6D5BD0]"
      >
        <Gem className="h-4 w-4" strokeWidth={2} />
        Group 159...
      </motion.div>

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
          const bold = key === "resumes"; // matches reference: bold label, no pill

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
              style={{ color: active || bold ? "#1A2E44" : undefined }}
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
                  style={{ color: active || bold ? "#1A2E44" : undefined }}
                />
                <span className={active || bold ? "font-semibold" : "font-normal"}>
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

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function SettingTabs({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-7 border-b border-slate-100 px-1">
      {tabs.map(({ key, label, icon: Icon }) => {
        const active = key === activeTab;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative flex items-center gap-1.5 pb-3 text-[13.5px] font-medium transition-colors ${
              active ? "text-[#22C55E]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            {label}
            {active && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#22C55E]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form pieces
// ---------------------------------------------------------------------------

function TextField({
  label,
  placeholder,
  icon: Icon,
}: {
  label: string;
  placeholder: string;
  icon?: React.ElementType;
}) {
  return (
    <motion.div variants={fieldItem}>
      <label className="mb-1.5 block text-[13px] font-medium text-[#1A2E44]">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 transition-colors focus-within:border-[#22C55E]">
        {Icon && <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.8} />}
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </motion.div>
  );
}

function SelectField({ label }: { label: string }) {
  return (
    <motion.div variants={fieldItem}>
      <label className="mb-1.5 block text-[13px] font-medium text-[#1A2E44]">
        {label}
      </label>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-left text-[13px] text-slate-400 transition-colors hover:border-slate-300"
      >
        Select...
        <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </motion.div>
  );
}

function ProfilePictureUploader() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <motion.div variants={fieldItem}>
      <label className="mb-1.5 block text-[13px] font-medium text-[#1A2E44]">
        Profile Picture
      </label>
      <motion.div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={() => setDragActive(false)}
        animate={{
          borderColor: dragActive ? "#22C55E" : "#CBD5E1",
          scale: dragActive ? 1.02 : 1,
        }}
        className="flex h-[168px] w-[168px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-slate-50/50 text-center"
      >
        <motion.div
          animate={{ y: dragActive ? [0, -4, 0] : 0 }}
          transition={{ repeat: dragActive ? Infinity : 0, duration: 0.8 }}
        >
          <UploadCloud className="h-6 w-6 text-slate-400" strokeWidth={1.6} />
        </motion.div>
        <p className="px-4 text-[12.5px] text-slate-500">
          <span className="font-semibold text-[#1A2E44]">Browse photo</span> or
          drop here
        </p>
        <p className="px-4 text-[10.5px] leading-tight text-slate-400">
          A photo larger than 400 pixels work best. Max photo size 5 MB.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Resume cards
// ---------------------------------------------------------------------------

function ResumeCard({
  resume,
  menuOpen,
  onToggleMenu,
  onDelete,
}: {
  resume: ResumeFile;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      variants={cardItem}
      layout
      whileHover={{ y: -2 }}
      className="relative flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DCFCE7]">
          <FileText className="h-4 w-4 text-[#22C55E]" strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#1A2E44]">
            {resume.name}
          </p>
          <p className="text-[11.5px] text-slate-400">{resume.size}</p>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={onToggleMenu}
        aria-label="Resume options"
        className="rounded-md p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-600"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={1.8} />
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-3 top-[calc(100%+4px)] z-20 w-40 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-lg"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] text-[#22C55E] hover:bg-[#DCFCE7]/60"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
              Edit Resume
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddResumeCard() {
  return (
    <motion.button
      type="button"
      variants={cardItem}
      whileHover={{ y: -2, borderColor: "#22C55E" }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3.5 text-left transition-colors"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DCFCE7]">
        <Plus className="h-4 w-4 text-[#22C55E]" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-[#1A2E44]">
          Add Cv/Resume
        </p>
        <p className="text-[11.5px] text-slate-400">
          Browse file or drop here, only pdf
        </p>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [activeNav, setActiveNav] = useState("alert");
  const [activeTab, setActiveTab] = useState("personal");
  const [resumes, setResumes] = useState<ResumeFile[]>(initialResumes);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setOpenMenuId(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div
      className="min-h-screen bg-[#E8ECF7] p-6"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* click-outside layer for resume menus */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative mx-auto flex max-w-6xl overflow-hidden rounded-3xl border-2 border-[#8B7BD8]/30 bg-[#DDE3F7]"
      >
        <Sidebar activeKey={activeNav} onSelect={setActiveNav} />

        <main className="flex-1 bg-white p-6">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-[19px] font-semibold text-[#1A2E44]"
          >
            Setting
          </motion.h1>

          <SettingTabs activeTab={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "personal" && (
                <div className="pt-6">
                  <h2 className="mb-4 text-[14px] font-semibold text-[#1A2E44]">
                    Basic Information
                  </h2>

                  <motion.div
                    variants={fieldContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-[168px_1fr_1fr] gap-x-6 gap-y-5"
                  >
                    <div className="row-span-2">
                      <ProfilePictureUploader />
                    </div>
                    <TextField label="Full name" placeholder="" />
                    <TextField label="Tittle/headline" placeholder="" />

                    <SelectField label="Experience" />
                    <SelectField label="Educations" />

                    <div className="col-start-2">
                      <TextField
                        label="Personal Website"
                        placeholder="Website url..."
                        icon={Link2}
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    type="button"
                    onClick={handleSave}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative mt-6 overflow-hidden rounded-lg bg-[#22C55E] px-6 py-2.5 text-[13px] font-semibold text-white"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={saved ? "saved" : "save"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="block"
                      >
                        {saved ? "Changes Saved ✓" : "Save Changes"}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>

                  <h2 className="mb-4 mt-8 text-[14px] font-semibold text-[#1A2E44]">
                    Your Cv/Resume
                  </h2>

                  <motion.div
                    variants={cardContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-3 gap-4"
                  >
                    {resumes.map((resume) => (
                      <ResumeCard
                        key={resume.id}
                        resume={resume}
                        menuOpen={openMenuId === resume.id}
                        onToggleMenu={() =>
                          setOpenMenuId((prev) =>
                            prev === resume.id ? null : resume.id
                          )
                        }
                        onDelete={() => deleteResume(resume.id)}
                      />
                    ))}
                    <AddResumeCard />
                  </motion.div>
                </div>
              )}

              {activeTab !== "personal" && (
                <div className="flex h-64 items-center justify-center text-[13px] text-slate-400">
                  {tabs.find((t) => t.key === activeTab)?.label} content goes
                  here
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}