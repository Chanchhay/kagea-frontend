"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Chip,
  GhostChip,
  Panel,
  PillTabs,
} from "@/components/workspace/primitives";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { Markdown } from "@/components/shared/Markdown";
import type { PublicJobResponse } from "@/contracts/api/public";
import type {
  JobApplicationResponse,
  ResumeResponse,
} from "@/contracts/api/job-seeker";
import { cn } from "@/lib/utils";
import {
  useApplyToJobMutation,
  useCreateAiInterviewForApplicationMutation,
  useCreateAiInterviewForJobMutation,
} from "@/services/jobSeekerApi";

// ============================================================================
// Types & Constants
// ============================================================================

type JobsWorkspaceProps = {
  jobs: PublicJobResponse[];
  resumes: ResumeResponse[];
  applications: JobApplicationResponse[];
  /** Seeded from `?q=` so the shell's search box lands here with its query. */
  initialKeyword?: string;
};

const WORK_MODE_TABS = ["All", "Remote", "Hybrid", "Onsite"] as const;
type WorkModeTab = (typeof WORK_MODE_TABS)[number];

// ============================================================================
// Main Component
// ============================================================================

export function JobsWorkspace({
  jobs,
  resumes,
  applications,
  initialKeyword = "",
}: JobsWorkspaceProps) {
  useSetPageHeading("Find jobs");

  // ========================================================================
  // State
  // ========================================================================
  
  const [keyword, setKeyword] = useState(initialKeyword);
  const [workMode, setWorkMode] = useState<WorkModeTab>("All");
  const [selectedId, setSelectedId] = useState<number | null>(
    jobs[0]?.id ?? null
  );

  // ========================================================================
  // Derived State
  // ========================================================================

  /** Filter jobs based on search keyword and work mode */
  const visibleJobs = useMemo(() => {
    const needle = keyword.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesKeyword =
        !needle ||
        job.title.toLowerCase().includes(needle) ||
        job.companyName.toLowerCase().includes(needle) ||
        job.location?.toLowerCase().includes(needle) ||
        job.skills.some((skill) =>
          skill.skillName.toLowerCase().includes(needle)
        );

      const matchesMode =
        workMode === "All" ||
        job.workMode?.toUpperCase().replace(/[\s_-]/g, "") ===
          workMode.toUpperCase();

      return matchesKeyword && matchesMode;
    });
  }, [jobs, keyword, workMode]);

  /** Find the currently selected job, with fallback to first visible */
  const selected =
    visibleJobs.find((job) => job.id === selectedId) ?? visibleJobs[0] ?? null;

  /** Map applications by job ID for quick lookup */
  const applicationByJob = useMemo(
    () => new Map(applications.map((item) => [item.jobId, item])),
    [applications]
  );

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      {/* Left Panel: Search, Filters, Job List */}
      <div className="flex flex-col gap-4">
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          placeholder="Search roles, companies, skills"
        />

        <PillTabs tabs={WORK_MODE_TABS} value={workMode} onChange={setWorkMode} />

        <div className="px-1 text-xs text-ws-faint">
          {visibleJobs.length} {visibleJobs.length === 1 ? "role" : "roles"}
        </div>

        <JobsList
          jobs={visibleJobs}
          selectedId={selected?.id}
          appliedJobIds={new Set(applications.map((a) => a.jobId))}
          onSelectJob={setSelectedId}
        />
      </div>

      {/* Right Panel: Job Detail or Empty State */}
      {selected ? (
        <JobDetailPanel
          key={selected.id}
          job={selected}
          resumes={resumes}
          application={applicationByJob.get(selected.id)}
        />
      ) : (
        <Panel className="flex items-center justify-center text-sm text-ws-faint">
          Pick a role to see the details.
        </Panel>
      )}
    </div>
  );
}

// ============================================================================
// Search Input Component
// ============================================================================

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-full bg-ws-card px-4 py-3 text-sm text-ws-muted transition-colors focus-within:bg-ws-card-hover">
      <Search aria-hidden="true" className="size-4 shrink-0" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-ws-fg outline-none placeholder:text-ws-faint"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="shrink-0 text-ws-faint transition-colors hover:text-ws-fg"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
      <span className="sr-only">Search published jobs</span>
    </label>
  );
}

// ============================================================================
// Jobs List Component
// ============================================================================

function JobsList({
  jobs,
  selectedId,
  appliedJobIds,
  onSelectJob,
}: {
  jobs: PublicJobResponse[];
  selectedId?: number | null;
  appliedJobIds: Set<number>;
  onSelectJob: (jobId: number) => void;
}) {
  if (!jobs.length) {
    return (
      <Panel className="text-sm text-ws-faint">
        No published roles match that search.
      </Panel>
    );
  }

  return (
    <ul className="ws-scroll flex max-h-136 flex-col gap-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-19rem)]">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobListRow
            job={job}
            isActive={job.id === selectedId}
            isApplied={appliedJobIds.has(job.id)}
            onSelect={() => onSelectJob(job.id)}
          />
        </li>
      ))}
    </ul>
  );
}

// ============================================================================
// Job List Row Component
// ============================================================================

function JobListRow({
  job,
  isActive,
  isApplied,
  onSelect,
}: {
  job: PublicJobResponse;
  isActive: boolean;
  isApplied: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "w-full rounded-[20px] p-4 text-left transition-colors",
        isActive
          ? "bg-chip-soft text-chip-soft-fg"
          : "bg-ws-card hover:bg-ws-card-hover"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{job.title}</p>
          <p className="truncate text-xs opacity-70">{job.companyName}</p>
        </div>
        {isApplied && <Chip tone="solid">Applied</Chip>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] opacity-80">
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3" />
            {job.location}
          </span>
        )}
        {job.workMode && <span>· {humanize(job.workMode)}</span>}
        {job.jobType && <span>· {humanize(job.jobType)}</span>}
      </div>
    </button>
  );
}

// ============================================================================
// Job Detail Panel Component
// ============================================================================

function JobDetailPanel({
  job,
  resumes,
  application,
}: {
  job: PublicJobResponse;
  resumes: ResumeResponse[];
  application?: JobApplicationResponse;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <JobDetailHeader job={job} application={application} />

      {/* Job Metadata */}
      <JobMetadata job={job} />

      {/* AI Interview Section */}
      <AiInterviewPanel job={job} application={application} />

      {/* Apply Section */}
      <ApplyPanel job={job} resumes={resumes} application={application} />

      {/* Skills Section */}
      {job.skills.length > 0 && (
        <SkillsSection skills={job.skills} />
      )}

      {/* Description Section */}
      {job.description && (
        <Panel>
          <h3 className="mb-3 text-[15px] font-semibold">About the role</h3>
          <Markdown content={job.description} />
        </Panel>
      )}

      {/* Custom Sections */}
      {job.sections.map((section) => (
        <Panel key={section.id}>
          <h3 className="mb-3 text-[15px] font-semibold">{section.title}</h3>
          <Markdown
            content={section.contentMarkdown || section.contentText}
          />
        </Panel>
      ))}
    </div>
  );
}

// ============================================================================
// Job Detail Header Component
// ============================================================================

function JobDetailHeader({
  job,
  application,
}: {
  job: PublicJobResponse;
  application?: JobApplicationResponse;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <GhostChip>
            <Building2 aria-hidden="true" className="size-3.5" />
            {job.companyName}
          </GhostChip>
          {job.categoryName && <GhostChip>{job.categoryName}</GhostChip>}
          {application && (
            <Chip tone="solid">{humanize(application.status)}</Chip>
          )}
        </div>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ws-fg lg:text-4xl">
          {job.title}
        </h2>
      </div>

      {job.salaryMin && (
        <div className="text-right">
          <span className="block text-xs text-ws-faint">Salary</span>
          <span className="text-2xl font-semibold tabular-nums text-ws-fg">
            {money(job.salaryMin)}
            {job.salaryMax ? ` – ${money(job.salaryMax)}` : "+"}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Job Metadata Component
// ============================================================================

function JobMetadata({ job }: { job: PublicJobResponse }) {
  const metaItems = [
    job.workMode,
    job.jobType,
    job.experienceLevel,
    job.location,
  ].filter(Boolean);

  if (metaItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {metaItems.map((value) => (
        <GhostChip key={value} className="px-3 py-2">
          {humanize(value)}
        </GhostChip>
      ))}
    </div>
  );
}

// ============================================================================
// Skills Section Component
// ============================================================================

function SkillsSection({
  skills,
}: {
  skills: Array<{ id: number; skillName: string; requiredLevel?: string }>;
}) {
  return (
    <Panel>
      <h3 className="mb-3 text-[15px] font-semibold">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Chip key={skill.id} tone="quiet">
            {skill.skillName}
            {skill.requiredLevel && (
              <span className="opacity-60">{humanize(skill.requiredLevel)}</span>
            )}
          </Chip>
        ))}
      </div>
    </Panel>
  );
}

// ============================================================================
// AI Interview Panel Component
// ============================================================================

/**
 * The AI interview entry point. Once an application exists the session is tied
 * to it — that is the one the recruiter sees — so the practice run is only
 * offered before applying.
 */
function AiInterviewPanel({
  job,
  application,
}: {
  job: PublicJobResponse;
  application?: JobApplicationResponse;
}) {
  const router = useRouter();
  const [createForJob, jobCreation] = useCreateAiInterviewForJobMutation();
  const [createForApplication, applicationCreation] =
    useCreateAiInterviewForApplicationMutation();

  const isPending = jobCreation.isLoading || applicationCreation.isLoading;

  const handleStart = async () => {
    try {
      const session = application
        ? await createForApplication(application.id).unwrap()
        : await createForJob(job.id).unwrap();

      router.push(`/job-seeker/interviews/${session.id}`);
    } catch {
      toast.error("Unable to start an AI interview for this role.");
    }
  };

  return (
    <Panel tone="soft" className="flex flex-wrap items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold">
          {application
            ? "Interview for this application"
            : "Practice this interview"}
        </h3>
        <p className="text-sm opacity-70">
          {application
            ? "Answer the generated questions and the recruiter sees your score."
            : "A scored mock round, generated from this job post. It does not apply you."}
        </p>
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={isPending}
        className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? "Preparing…" : "Start AI interview"}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </Panel>
  );
}

// ============================================================================
// Apply Panel Component
// ============================================================================

function ApplyPanel({
  job,
  resumes,
  application,
}: {
  job: PublicJobResponse;
  resumes: ResumeResponse[];
  application?: JobApplicationResponse;
}) {
  const defaultResume = resumes.find((resume) => resume.isDefault) ?? resumes[0];
  const [resumeId, setResumeId] = useState(
    defaultResume ? String(defaultResume.id) : ""
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [apply, submission] = useApplyToJobMutation();

  // If already applied, show the applied state
  if (application) {
    return (
      <Panel className="flex flex-wrap items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            Applied {formatDate(application.appliedAt)}
          </p>
          <p className="text-xs text-ws-faint">
            {application.resumeTitle || "No resume attached"}
          </p>
        </div>
        <Chip tone="quiet">{humanize(application.status)}</Chip>
      </Panel>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await apply({
        jobId: job.id,
        body: {
          resumeId: resumeId ? Number(resumeId) : undefined,
          coverLetter: coverLetter.trim() || undefined,
        },
      }).unwrap();
      toast.success("Application submitted successfully!");
      setCoverLetter("");
    } catch {
      toast.error("Unable to submit the application. Please try again.");
    }
  };

  return (
    <Panel>
      <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold">
        <Briefcase aria-hidden="true" className="size-4" />
        Apply now
      </h3>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Resume Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ws-muted">Resume</label>
          <select
            value={resumeId}
            onChange={(event) => setResumeId(event.target.value)}
            className="rounded-2xl bg-ws-card-hover px-4 py-3 text-sm text-ws-fg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">No resume</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title}
                {resume.isDefault ? " (default)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Letter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ws-muted">
            Cover letter
          </label>
          <textarea
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            maxLength={5000}
            rows={4}
            placeholder="Optional — tell us why you're a great fit for this role"
            className="resize-y rounded-2xl bg-ws-card-hover px-4 py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          />
          <p className="text-xs text-ws-faint">
            {coverLetter.length} / 5000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submission.isLoading}
          className="mt-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
        >
          {submission.isLoading ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </Panel>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert snake_case or CONSTANT_CASE strings to Title Case
 * Example: "full_time" -> "Full time", "REMOTE" -> "Remote"
 */
function humanize(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

/**
 * Format a number as USD currency
 * Example: 50000 -> "$50,000"
 */
function money(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string to a readable format
 * Example: "2024-01-15T10:30:00Z" -> "15 Jan 2024"
 */
function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
