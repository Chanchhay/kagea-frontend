"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useMemo, useState, type FormEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { isClosedApplication } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { SaveJobButton } from "@/components/public/SaveJobButton";
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

type JobsWorkspaceProps = {
  jobs: PublicJobResponse[];
  resumes: ResumeResponse[];
  applications: JobApplicationResponse[];
  /** Seeded from `?q=` so the shell's search box lands here with its query. */
  initialKeyword?: string;
};

const workModeTabs = ["All", "Remote", "Hybrid", "Onsite"] as const;
type WorkModeTab = (typeof workModeTabs)[number];

export function JobsWorkspace({
  jobs,
  resumes,
  applications,
  initialKeyword = "",
}: JobsWorkspaceProps) {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(
    "Find jobs",
    "Discover opportunities that match your skills and goals.",
  );

  const [keyword, setKeyword] = useState(initialKeyword);
  const [workMode, setWorkMode] = useState<WorkModeTab>("All");
  const [selectedId, setSelectedId] = useState<string | null>(
    jobs[0]?.id ?? null,
  );

  const visibleJobs = useMemo(() => {
    const needle = keyword.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesKeyword =
        !needle ||
        job.title.toLowerCase().includes(needle) ||
        job.companyName.toLowerCase().includes(needle) ||
        job.location?.toLowerCase().includes(needle) ||
        job.skills.some((skill) =>
          skill.skillName.toLowerCase().includes(needle),
        );

      const matchesMode =
        workMode === "All" ||
        job.workMode?.toUpperCase().replace(/[\s_-]/g, "") ===
          workMode.toUpperCase();

      return matchesKeyword && matchesMode;
    });
  }, [jobs, keyword, workMode]);

  /* Keep the detail pane on a job that is still in the filtered list. */
  const selected =
    visibleJobs.find((job) => job.id === selectedId) ?? visibleJobs[0] ?? null;

  /*
   * One entry per job, preferring the application still in play.
   *
   * A candidate may now hold several attempts at the same job once earlier ones
   * are closed. Building the map straight from the list kept whichever entry
   * came last — and the API returns newest first, so that was the *oldest*
   * attempt. A re-application would not have shown up at all.
   */
  const applicationByJob = useMemo(() => {
    const byJob = new Map<string, JobApplicationResponse>();

    for (const item of applications) {
      const existing = byJob.get(item.jobId);

      if (!existing) {
        byJob.set(item.jobId, item);
        continue;
      }

      const existingIsClosed = isClosedApplication(existing.status);
      const itemIsClosed = isClosedApplication(item.status);

      // A live attempt always wins; between two closed ones, the newer.
      if (existingIsClosed && (!itemIsClosed || item.id > existing.id)) {
        byJob.set(item.jobId, item);
      }
    }

    return byJob;
  }, [applications]);

  return (
    <div className="grid gap-5 max-md:min-w-0 max-md:grid-cols-1 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4 max-md:min-w-0">
        <label className="flex items-center gap-2 rounded-full bg-ws-card px-4 py-3 text-sm text-ws-muted focus-within:bg-ws-card-hover">
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={tx("Search roles, companies, skills")}
            className="w-full bg-transparent text-ws-fg outline-none placeholder:text-ws-faint max-md:min-w-0"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label={tx("Clear search")}
              className="shrink-0 text-ws-faint hover:text-ws-fg"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
          <span className="sr-only">{tx("Search published jobs")}</span>
        </label>

        <PillTabs tabs={workModeTabs} value={workMode} onChange={setWorkMode} />

        <p className="px-1 text-xs text-ws-faint">
          {visibleJobs.length} {visibleJobs.length === 1 ? tx("role") : tx("roles")}
        </p>

        <ul className="ws-scroll flex max-h-136 flex-col gap-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-19rem)]">
          {visibleJobs.map((job) => (
            <li key={job.id}>
              <JobListRow
                job={job}
                active={job.id === selected?.id}
                applied={(() => {
                  const item = applicationByJob.get(job.id);
                  return (
                    item !== undefined && !isClosedApplication(item.status)
                  );
                })()}
                onSelect={() => setSelectedId(job.id)}
              />
            </li>
          ))}

          {!visibleJobs.length ? (
            <Panel className="text-sm text-ws-faint">
              {tx("No published roles match that search.")}</Panel>
          ) : null}
        </ul>
      </div>

      {selected ? (
        <JobDetail
          key={selected.id}
          job={selected}
          resumes={resumes}
          application={applicationByJob.get(selected.id)}
        />
      ) : (
        <Panel className="flex items-center justify-center text-sm text-ws-faint">
          {tx("Pick a role to see the details.")}</Panel>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- list --- */

function JobListRow({
  job,
  active,
  applied,
  onSelect,
}: {
  job: PublicJobResponse;
  active: boolean;
  applied: boolean;
  onSelect: () => void;
}) {
  const tx = useWorkspaceTranslation();
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group relative w-full cursor-pointer rounded-2xl p-4 text-left transition-all border",
        active
          ? "border-primary bg-ws-card-hover shadow-sm ring-2 ring-primary/25"
          : "border-ws-line/60 bg-ws-card hover:border-ws-line hover:bg-ws-card-hover/70",
      )}
    >
      {/* Visual active indicator bar */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary"
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-semibold transition-colors",
              active ? "text-primary" : "text-ws-fg",
            )}
          >
            {job.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-ws-muted">{job.companyName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {active ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              {tx("Viewing")}
            </span>
          ) : null}
          {applied ? <Chip tone="solid">{tx("Applied")}</Chip> : null}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-ws-muted">
        {job.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            {job.location}
          </span>
        ) : null}
        {job.workMode ? <span>· {tx(humanize(job.workMode))}</span> : null}
        {job.jobType ? <span>· {tx(humanize(job.jobType))}</span> : null}
      </div>
    </button>
  );
}

/* --------------------------------------------------------------- detail --- */

function JobDetail({
  job,
  resumes,
  application,
}: {
  job: PublicJobResponse;
  resumes: ResumeResponse[];
  application?: JobApplicationResponse;
}) {
  const tx = useWorkspaceTranslation();
  return (
    <div className="flex flex-col gap-5 max-md:min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <GhostChip>
              <Building2 aria-hidden="true" className="size-3.5" />
              {job.companyName}
            </GhostChip>
            {job.categoryName ? (
              <GhostChip>{job.categoryName}</GhostChip>
            ) : null}
            {application ? (
              <Chip tone="solid">{tx(humanize(application.status))}</Chip>
            ) : null}
            <SaveJobButton jobId={job.id} isFavorite={job.isFavorite} />
          </div>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ws-fg lg:text-4xl">
            {job.title}
          </h2>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3 max-md:w-full max-md:items-start">
          {job.salaryMin ? (
            <p className="text-right max-md:text-left">
              <span className="block text-xs text-ws-faint">{tx("Salary")}</span>
              <span className="text-2xl font-semibold tabular-nums text-ws-fg">
                {money(job.salaryMin)}
                {job.salaryMax ? ` – ${money(job.salaryMax)}` : "+"}
              </span>
            </p>
          ) : null}

          <ApplyPanel job={job} resumes={resumes} application={application} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[job.workMode, job.jobType, job.experienceLevel, job.location]
          .filter(Boolean)
          .map((value) => (
            <GhostChip key={value} className="px-3 py-2">
              {tx(humanize(value))}
            </GhostChip>
          ))}
      </div>

      <AiInterviewPanel job={job} application={application} />

      {job.skills.length ? (
        <Panel>
          <h3 className="mb-3 text-lg font-bold tracking-tight text-ws-fg">{tx("Skills")}</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Chip key={skill.id} tone="quiet">
                {skill.skillName}
                {skill.requiredLevel ? (
                  <span className="opacity-60">
                    {tx(humanize(skill.requiredLevel))}
                  </span>
                ) : null}
              </Chip>
            ))}
          </div>
        </Panel>
      ) : null}

      {job.description ? (
        <Panel>
          <h3 className="mb-3 text-lg font-bold tracking-tight text-ws-fg">{tx("About the role")}</h3>
          <Markdown content={job.description} />
        </Panel>
      ) : null}

      {job.sections.map((section) => (
        <Panel key={section.id}>
          <h3 className="mb-3 text-lg font-bold tracking-tight text-ws-fg">{section.title}</h3>
          <Markdown content={section.contentMarkdown || section.contentText} />
        </Panel>
      ))}
    </div>
  );
}

/* -------------------------------------------------------- ai interviews --- */

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
  const tx = useWorkspaceTranslation();
  const router = useRouter();
  const [createForJob, jobCreation] = useCreateAiInterviewForJobMutation();
  const [createForApplication, applicationCreation] =
    useCreateAiInterviewForApplicationMutation();

  const pending = jobCreation.isLoading || applicationCreation.isLoading;

  /*
   * A closed application is not something to interview against — the API
   * refuses it — but the job can still be practised. Treating it as absent
   * gives the practice route, which is the only one that makes sense here.
   */
  const liveApplication =
    application && !isClosedApplication(application.status)
      ? application
      : undefined;

  const start = async () => {
    try {
      const session = liveApplication
        ? await createForApplication(liveApplication.id).unwrap()
        : await createForJob(job.id).unwrap();

      router.push(`/job-seeker/interviews/${session.id}`);
    } catch {
      toast.error(tx("Unable to start an AI interview for this role."));
    }
  };

  return (
    <Panel tone="soft" className="flex flex-wrap items-center gap-4 max-md:grid max-md:grid-cols-[2.75rem_minmax(0,1fr)] max-md:items-start">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-chip-solid text-chip-solid-fg">
        <Sparkles aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold">
          {liveApplication ? tx("Interview for this application") : tx("Practise this interview")}
        </h3>
        <p className="text-sm opacity-70">
          {liveApplication ? tx("Answer the generated questions and the recruiter sees your score.") : tx("A scored mock round, generated from this job post. It does not apply you.")}
        </p>
      </div>

      <button
        type="button"
        onClick={start}
        disabled={pending}
        className="flex items-center gap-2 rounded-full bg-ws-fg px-5 py-3 text-sm font-semibold text-ws-panel transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50 max-md:col-span-2 max-md:w-full max-md:justify-center"
      >
        {pending ? tx("Preparing…") : tx("Start AI interview")}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </Panel>
  );
}

/* ---------------------------------------------------------------- apply --- */

function ApplyPanel({
  job,
  resumes,
  application,
}: {
  job: PublicJobResponse;
  resumes: ResumeResponse[];
  application?: JobApplicationResponse;
}) {
  const tx = useWorkspaceTranslation();
  const defaultResume =
    resumes.find((resume) => resume.isDefault) ?? resumes[0];
  const [resumeId, setResumeId] = useState(
    defaultResume ? String(defaultResume.id) : "",
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apply, submission] = useApplyToJobMutation();

  const closedAttempt = application && isClosedApplication(application.status);

  // Only a live application replaces the form. A closed one is shown above it
  // as the previous attempt, so the candidate can see what happened and still
  // apply again.
  if (application && !closedAttempt) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-3 max-md:grid max-md:grid-cols-[2.25rem_minmax(0,1fr)]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip-solid text-chip-solid-fg">
          <Check aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {tx("Applied ")}{formatDate(application.appliedAt)}
          </p>
          <p className="text-xs text-ws-faint">
            {application.resumeTitle || tx("No resume attached")}
          </p>
        </div>
        <Chip tone="quiet" className="max-md:col-span-2 max-md:max-w-full max-md:justify-self-start">{tx(humanize(application.status))}</Chip>
      </div>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await apply({
        jobId: job.id,
        body: {
          resumeId: resumeId || undefined,
          coverLetter: coverLetter.trim() || undefined,
        },
      }).unwrap();
      toast.success(tx("Application submitted."));
      setCoverLetter("");
      setDialogOpen(false);
    } catch (error) {
      // The API's reason is specific — an open application, or a cooldown that
      // has not elapsed — and worth showing verbatim.
      toast.error(
        getApiErrorMessage(error, tx("Unable to submit the application.")),
      );
    }
  };

  const selectedResume = resumes.find((r) => String(r.id) === String(resumeId));
  const resumeDisplayName = (r: ResumeResponse) => {
    if (!r.title || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.title)) {
      return tx("Resume");
    }
    return r.title;
  };

  return (
    <>
      {closedAttempt && application ? (
        <div className="flex max-w-sm flex-wrap items-center justify-end gap-3 rounded-2xl bg-ws-card-hover px-4 py-3 text-right max-md:flex-col max-md:items-start max-md:text-left">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {tx("Previous attempt ")}{formatDate(application.appliedAt)}
            </p>
            <p className="text-xs text-ws-faint">
              {tx("You can apply to this role again.")}</p>
          </div>
          <Chip tone="alert">{tx(humanize(application.status))}</Chip>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
      >
        <Briefcase aria-hidden="true" className="size-4" />
        {closedAttempt ? tx("Apply again") : tx("Apply")}
      </button>

      {dialogOpen ? (
        <div
          aria-modal="true"
          role="dialog"
          aria-labelledby="apply-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div className="w-full max-w-xl rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-[var(--shadow-dropdown)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="apply-dialog-title" className="text-lg font-semibold text-ws-fg">
                  {closedAttempt ? tx("Apply again") : tx("Apply")}
                </h3>
                <p className="mt-1 text-sm text-ws-muted">{job.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                aria-label={tx("Close")}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <form className="mt-5 flex flex-col gap-3" onSubmit={submit}>
              <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
                {tx("Resume")}
                <Select value={resumeId || null} onValueChange={(value) => setResumeId(value ?? "")}>
                  <SelectTrigger className="w-full border-none bg-ws-card-hover text-ws-fg">
                    <SelectValue placeholder={tx("No resume")}>
                      {selectedResume
                        ? `${resumeDisplayName(selectedResume)}${selectedResume.isDefault ? tx(" (default)") : ""}`
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={String(resume.id)}>
                        {resumeDisplayName(resume)}
                        {resume.isDefault ? tx(" (default)") : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
                {tx("Cover letter")}
                <textarea
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  maxLength={5000}
                  rows={4}
                  placeholder={tx("Optional — why you are a fit for this role")}
                  className="resize-y rounded-2xl bg-ws-card-hover px-4 py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>

              <button
                type="submit"
                disabled={submission.isLoading}
                className="mt-1 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
              >
                {submission.isLoading ? tx("Submitting…") : tx("Submit application")}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------- helpers --- */

function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
