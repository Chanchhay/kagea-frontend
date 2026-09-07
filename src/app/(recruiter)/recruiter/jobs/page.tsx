"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Plus,
  Radio,
  Search,
  TimerReset,
  XCircle,
} from "lucide-react";
import type { JobPostResponse, JobPostStatus } from "@/contracts";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { JobStatusActions } from "@/components/recruiter/JobStatusActions";
import { useGetRecruiterJobsQuery } from "@/services/recruiterApi";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

type Filter = "ALL" | "PUBLISHED" | "DRAFT" | "REVIEW" | "PAUSED" | "CLOSED";

const filterStatuses: Record<Exclude<Filter, "ALL">, JobPostStatus[]> = {
  PUBLISHED: ["PUBLISHED"],
  DRAFT: ["DRAFT"],
  REVIEW: ["PENDING", "APPROVED", "REJECTED"],
  PAUSED: ["PAUSED"],
  CLOSED: ["CLOSED", "EXPIRED"],
};

const filterLabels: Record<Filter, string> = {
  ALL: "All",
  PUBLISHED: "Published",
  DRAFT: "Drafts",
  REVIEW: "In review",
  PAUSED: "Paused",
  CLOSED: "Closed",
};

export default function RecruiterJobsPage() {
  const tx = useWorkspaceTranslation();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const jobsQuery = useGetRecruiterJobsQuery();

  const recruiterJobs = useMemo(() => jobsQuery.data ?? [], [jobsQuery.data]);
  const filtered = useMemo(() => recruiterJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.trim().toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "ALL") return true;
    return filterStatuses[filter].includes(job.status);
  }), [recruiterJobs, filter, search]);

  if (jobsQuery.isLoading) return <LoadingState rows={5} />;
  if (jobsQuery.isError) {
    return <ErrorState message={tx("Unable to load company jobs.")} onRetry={() => void jobsQuery.refetch()} />;
  }

  const published = recruiterJobs.filter((job) => job.status === "PUBLISHED").length;
  const drafts = recruiterJobs.filter((job) => job.status === "DRAFT").length;
  const paused = recruiterJobs.filter((job) => job.status === "PAUSED").length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-ws-panel p-5 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-80 rounded-full bg-primary/5" />
        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex"><BriefcaseBusiness aria-hidden="true" className="size-6" /></span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Company jobs")}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{tx("Draft, publish, pause, and close the roles your company is hiring for.")}</p>
            </div>
          </div>
          <Link href="/recruiter/jobs/new" className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-hover ${focusRing}`}>
            <Plus aria-hidden="true" className="size-4 shrink-0" />{tx("Create job")}
          </Link>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <JobMetric icon={BriefcaseBusiness} label={tx("All jobs")} value={recruiterJobs.length} />
        <JobMetric icon={Radio} label={tx("Published")} value={published} accent />
        <JobMetric icon={TimerReset} label={tx("Drafts")} value={drafts} />
        <JobMetric icon={CalendarDays} label={tx("Paused")} value={paused} />
      </div>

      <section aria-label={tx("Hiring pipeline")} className="min-w-0 space-y-5">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ws-fg">{tx("Openings and drafts")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ws-muted">{tx("Manage the lifecycle of every company role.")}</p>
          </div>
          <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-ws-line bg-ws-panel px-3.5 text-ws-muted transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <Search aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">{tx("Search jobs")}</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tx("Search by job title")} className="min-w-0 w-full bg-transparent py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint lg:w-64" />
          </label>
        </div>

        <div role="group" aria-label={tx("Filter by status")} className="grid min-w-0 grid-cols-3 gap-1 rounded-2xl border border-ws-line bg-ws-panel p-1.5 sm:flex sm:w-fit sm:max-w-full sm:flex-wrap">
          {(Object.keys(filterLabels) as Filter[]).map((item) => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${focusRing} ${filter === item ? "bg-primary text-primary-foreground shadow-sm" : "text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg"}`}>
              <span className="min-w-0 [overflow-wrap:anywhere]">{tx(filterLabels[item])}</span>
              <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs tabular-nums ${filter === item ? "bg-primary-foreground/20" : "bg-ws-card"}`}>{filterCount(item, recruiterJobs)}</span>
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="grid gap-4">
            {filtered.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-5 py-16 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><XCircle aria-hidden="true" className="size-8" /></span>
            <h2 className="mt-5 text-lg font-semibold text-ws-fg">{tx(recruiterJobs.length ? "No jobs found" : "No jobs yet")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx(recruiterJobs.length ? "Try another filter or search term." : "Create a draft to start hiring.")}</p>
            {search || filter !== "ALL" ? (
              <button type="button" onClick={() => { setSearch(""); setFilter("ALL"); }} className={`mt-5 rounded-xl border border-primary/20 bg-ws-panel px-5 py-3 text-sm font-semibold text-primary ${focusRing}`}>{tx("Clear filters")}</button>
            ) : (
              <Link href="/recruiter/jobs/new" className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-hover ${focusRing}`}>
                <Plus aria-hidden="true" className="size-4 shrink-0" />{tx("Create job")}
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function JobRow({ job }: { job: JobPostResponse }) {
  const tx = useWorkspaceTranslation();
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-6">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${statusAccent(job.status)}`} />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-primary group-hover:text-primary-foreground">
            <BriefcaseBusiness className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link href={`/recruiter/jobs/${job.id}`} className={`truncate rounded-sm text-base font-bold tracking-tight text-ws-fg transition hover:text-primary sm:text-lg ${focusRing}`}>
                {job.title}
              </Link>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyle(job.status)}`}>{tx(formatStatus(job.status))}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ws-muted">
              <span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-3.5" />{job.categoryName || tx("Uncategorized")}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{job.location || tx("Location not set")}</span>
              {job.workMode ? <span className="rounded-md bg-ws-card px-2 py-1 text-xs font-semibold">{tx(formatStatus(job.workMode))}</span> : null}
              {job.jobType ? <span className="rounded-md bg-ws-card px-2 py-1 text-xs font-semibold">{tx(formatStatus(job.jobType))}</span> : null}
            </div>
            {job.expiredAt ? <p className="mt-3 flex items-center gap-1.5 text-xs text-ws-faint"><CalendarDays className="size-3.5" />{tx("Closes")} {formatDate(job.expiredAt)}</p> : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line pt-4 lg:border-0 lg:pt-0">
          <JobStatusActions job={job} />
          <Link href={`/recruiter/jobs/${job.id}`} aria-label={tx("View {0}", { 0: job.title })} title={tx("View job")} className={`flex size-11 items-center justify-center rounded-xl bg-ws-card text-ws-muted transition hover:bg-primary/10 hover:text-primary ${focusRing}`}>
            <ArrowUpRight className="size-4.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function JobMetric({ icon: Icon, label, value, accent = false }: { icon: typeof BriefcaseBusiness; label: string; value: number; accent?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-2xl border p-4 ${accent ? "border-primary/25 bg-primary/5" : "border-ws-line bg-ws-panel"}`}>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><Icon aria-hidden="true" className="size-4.5" /></span>
      <div className="min-w-0"><p className="text-xl font-bold tabular-nums text-ws-fg">{value}</p><p className="mt-0.5 text-xs leading-relaxed text-ws-muted">{label}</p></div>
    </div>
  );
}

function filterCount(filter: Filter, jobs: JobPostResponse[]) {
  if (filter === "ALL") return jobs.length;
  return jobs.filter((job) => filterStatuses[filter].includes(job.status)).length;
}

function formatStatus(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Not set" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }

function statusAccent(status: JobPostStatus) {
  switch (status) {
    case "PUBLISHED": return "bg-primary";
    case "PAUSED": return "bg-amber-400";
    case "PENDING": return "bg-blue-400";
    case "APPROVED": return "bg-teal-400";
    case "REJECTED": return "bg-destructive";
    default: return "bg-slate-400";
  }
}

function statusStyle(status: JobPostStatus) {
  switch (status) {
    case "PUBLISHED": return "bg-primary/10 text-primary";
    case "PAUSED": return "bg-amber-400/15 text-amber-700 dark:text-amber-300";
    case "PENDING": return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "APPROVED": return "bg-teal-500/10 text-teal-700 dark:text-teal-300";
    case "REJECTED": return "bg-chip-alert text-chip-alert-fg";
    default: return "bg-ws-card text-ws-muted";
  }
}
