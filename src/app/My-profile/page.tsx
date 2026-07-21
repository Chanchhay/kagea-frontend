"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Search,
  Bell,
  ChevronDown,
  Pencil,
  Camera,
  BadgeCheck,
  User,
  Briefcase,
  Star,
  BellRing,
  Bot,
  UploadCloud,
  FileText,
  FolderKanban,
  ClipboardList,
  LayoutGrid,
  Settings,
  Search as SearchIcon,
  LogOut,
  Eye,
  ShieldCheck,
  History,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens (Find Job & AI Interview design system)
// ---------------------------------------------------------------------------
const COLORS = {
  navy: "#1A2E44",
  teal: "#2DB5A3",
  bgApp: "#EAF0FC",
  bgPanel: "#F5F7FB",
  border: "#E4E7EE",
  textMuted: "#6B7280",
};

type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "My Profile", icon: User, active: true },
  { label: "Applied Jobs", icon: Briefcase },
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

// ---------------------------------------------------------------------------
// Small primitives
// ---------------------------------------------------------------------------
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-[#1A2E44]/70">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div className="flex items-center rounded-lg border border-[#E4E7EE] bg-white px-3 py-2.5 focus-within:border-[#2DB5A3] focus-within:ring-2 focus-within:ring-[#2DB5A3]/20">
      {prefix && (
        <span className="mr-1 text-sm text-[#6B7280]">{prefix}</span>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-[#1A2E44] outline-none placeholder:text-[#9CA3AF]"
      />
    </div>
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none rounded-lg border border-[#E4E7EE] bg-white px-3 py-2.5 text-sm text-[#1A2E44] outline-none focus:border-[#2DB5A3] focus:ring-2 focus:ring-[#2DB5A3]/20"
    />
  );
}

function SelectInput({
  value,
  options,
}: {
  value: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className="w-full appearance-none rounded-lg border border-[#E4E7EE] bg-white px-3 py-2.5 pr-9 text-sm text-[#1A2E44] outline-none focus:border-[#2DB5A3] focus:ring-2 focus:ring-[#2DB5A3]/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
      />
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E4E7EE] bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[#2DB5A3]" />}
        <h3 className="text-sm font-semibold text-[#1A2E44]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar() {
  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-[#DCE7FB] px-4 py-6">
      <button className="mb-8 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F5B32C] px-3.5 py-1.5 text-xs font-semibold text-[#1A2E44]">
        <ChevronLeft size={14} />
        BACK
      </button>

      <p className="mb-3 px-2 text-[11px] font-semibold tracking-wide text-[#1A2E44]/50">
        MAIN MENU
      </p>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active
                ? "bg-white font-medium text-[#1A2E44] shadow-sm"
                : "text-[#1A2E44]/70 hover:bg-white/60"
            }`}
          >
            <Icon size={16} className={active ? "text-[#2DB5A3]" : ""} />
            {label}
          </button>
        ))}
      </nav>

      <button className="mt-6 flex items-center gap-2.5 px-3 py-2 text-sm text-[#1A2E44]/70 hover:text-[#1A2E44]">
        <LogOut size={16} />
        Log-out
      </button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Top bar
// ---------------------------------------------------------------------------
function TopBar() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-[#1A2E44]">My Profile</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-[#E4E7EE] bg-white px-3 py-2">
          <Search size={15} className="text-[#9CA3AF]" />
          <input
            placeholder="Search resources..."
            className="w-40 bg-transparent text-sm text-[#1A2E44] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
        <button className="relative rounded-full p-2 text-[#1A2E44]/70 hover:bg-[#F5F7FB]">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
        </button>
        <div className="flex items-center gap-1.5 rounded-full bg-[#F5F7FB] py-1 pl-1 pr-2">
          <div className="h-7 w-7 overflow-hidden rounded-full bg-[#1A2E44]">
            <Image
              src="/lina.jpg"
              alt="Lina Lut "
              width={28}
              height={28}
              className="h-full w-full object-cover"
            />
          </div>
          <ChevronDown size={14} className="text-[#1A2E44]/60" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile header card
// ---------------------------------------------------------------------------
function ProfileHeader() {
  return (
    <div className="mb-6 rounded-xl border border-[#E4E7EE] bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-[#FCEBD9]">
              {/* Replace src with the user's real avatar */}
              <Image
                src="/lina.jpg"
                alt="Lina Lut"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#2DB5A3] text-white ring-2 ring-white">
              <Camera size={12} />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1A2E44]">
                Alex Rivera
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F7F4] px-2 py-0.5 text-[11px] font-medium text-[#2DB5A3]">
                <BadgeCheck size={12} />
                Verified Professional
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-[#2DB5A3]">
              Senior Frontend Engineer
            </p>
            <p className="mt-2 max-w-xl text-sm text-[#6B7280]">
              Building scalable design systems and high-performance React
              applications. Passionate about UI/UX and web accessibility.
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <LinkIcon size={12} className="text-[#2DB5A3]" />
                talentportal.io/u/arivera
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                San Francisco, CA (Remote)
              </span>
            </div>
          </div>
        </div>

        <button className="flex h-fit items-center gap-1.5 rounded-lg border border-[#2DB5A3] px-3.5 py-2 text-sm font-medium text-[#2DB5A3] hover:bg-[#2DB5A3]/5">
          <Pencil size={14} />
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personal Information card
// ---------------------------------------------------------------------------
function PersonalInformationCard() {
  const [userId] = useState("USR-1092");
  const [profileSlug, setProfileSlug] = useState("arivera");
  const [headline, setHeadline] = useState(
    "Senior Frontend Engineer specializing in Design Systems"
  );
  const [bio, setBio] = useState(
    "Over 8 years of experience in the tech industry. I focus on creating seamless user experiences using React, TypeScript, and Tailwind CSS. I've led teams in migrating legacy systems to modern architectures."
  );
  const [currentPosition, setCurrentPosition] = useState(
    "Senior Engineer at TechCorp"
  );
  const [preferredLocation, setPreferredLocation] = useState(
    "Remote / San Francisco"
  );

  return (
    <Card title="Personal Information" icon={User}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>User ID</FieldLabel>
          <div className="flex items-center gap-2 rounded-lg border border-[#E4E7EE] bg-[#F5F7FB] px-3 py-2.5 text-sm text-[#6B7280]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#2DB5A3]" />
            {userId}
          </div>
        </div>
        <div>
          <FieldLabel>Profile Slug</FieldLabel>
          <TextInput value={profileSlug} onChange={setProfileSlug} />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel>Headline</FieldLabel>
        <TextInput value={headline} onChange={setHeadline} />
      </div>

      <div className="mt-4">
        <FieldLabel>Bio</FieldLabel>
        <TextArea value={bio} onChange={setBio} rows={3} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Current Position</FieldLabel>
          <TextInput
            value={currentPosition}
            onChange={setCurrentPosition}
          />
        </div>
        <div>
          <FieldLabel>Preferred Location</FieldLabel>
          <TextInput
            value={preferredLocation}
            onChange={setPreferredLocation}
          />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel>Availability</FieldLabel>
        <SelectInput
          value="Open to opportunities"
          options={[
            "Open to opportunities",
            "Actively looking",
            "Not looking",
          ]}
        />
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Salary Expectations card
// ---------------------------------------------------------------------------
function SalaryExpectationsCard() {
  const [minSalary, setMinSalary] = useState("145000");
  const [maxSalary, setMaxSalary] = useState("185000");

  return (
    <Card title="Salary Expectations">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <FieldLabel>Min Salary (Annual)</FieldLabel>
          <TextInput value={minSalary} onChange={setMinSalary} prefix="$" />
        </div>
        <div>
          <FieldLabel>Max Salary (Annual)</FieldLabel>
          <TextInput value={maxSalary} onChange={setMaxSalary} prefix="$" />
        </div>
        <div>
          <FieldLabel>Visibility</FieldLabel>
          <SelectInput
            value="Recruiters Only"
            options={["Recruiters Only", "Everyone", "Hidden"]}
          />
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Status & Visibility card
// ---------------------------------------------------------------------------
function StatusVisibilityCard() {
  const [isPublic, setIsPublic] = useState(true);

  return (
    <Card title="Status & Visibility" icon={Eye}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#1A2E44]">
            Public Profile
          </p>
          <p className="text-xs text-[#6B7280]">Visible to everyone</p>
        </div>
        <button
          onClick={() => setIsPublic((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            isPublic ? "bg-[#2DB5A3]" : "bg-[#E4E7EE]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              isPublic ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="my-4 border-t border-[#E4E7EE]" />

      <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#1A2E44]/50">
        VERIFICATION STATUS
      </p>
      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-[#E6F7F4] px-3 py-2 text-sm font-medium text-[#2DB5A3]">
        <ShieldCheck size={15} />
        Verified
      </div>

      <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#1A2E44]/50">
        PROFILE STATUS
      </p>
      <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F7FB] px-3 py-2 text-sm font-medium text-[#1A2E44]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
        Active
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Audit Log card
// ---------------------------------------------------------------------------
function AuditLogCard() {
  const entries = [
    { label: "Created At", value: "Oct 12, 2023 • 09:42 AM" },
    { label: "Last Updated", value: "Just now" },
    { label: "Created By", value: "System / Auto-Join" },
    { label: "Updated By", value: "Alex Rivera (Self)" },
  ];

  return (
    <Card title="Audit Log" icon={History}>
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F5F7FB] text-[#6B7280]">
              <History size={12} />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">{entry.label}</p>
              <p className="text-sm font-medium text-[#1A2E44]">
                {entry.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MyProfilePage() {
  return (
    <div
      className="flex min-h-screen w-full bg-[#EAF0FC] font-sans"
      style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
    >
      <Sidebar />

      <main className="flex-1 p-8">
        <TopBar />
        <ProfileHeader />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <PersonalInformationCard />
            <SalaryExpectationsCard />
          </div>

          <div className="flex flex-col gap-6">
            <StatusVisibilityCard />
            <AuditLogCard />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-[#E4E7EE] bg-white px-5 py-2.5 text-sm font-medium text-[#1A2E44] hover:bg-[#F5F7FB]">
            Cancel
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-[#1A2E44] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#15263A]">
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}