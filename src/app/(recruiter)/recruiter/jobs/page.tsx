"use client";

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin, Plus, Radio, TimerReset } from "lucide-react";
import type { JobPostStatus } from "@/contracts";
import { PageIntro, PrimaryLink } from "@/components/shared/ApiCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { JobStatusActions } from "@/components/recruiter/JobStatusActions";
import { useGetRecruiterJobsQuery } from "@/services/recruiterApi";

export default function RecruiterJobsPage() {
  const jobsQuery = useGetRecruiterJobsQuery();

  if (jobsQuery.isLoading) return <LoadingState rows={5} />;
  if (jobsQuery.isError) {
    return <ErrorState message="Unable to load company jobs." />;
  }

  const recruiterJobs = jobsQuery.data ?? [];
  const published = recruiterJobs.filter((job) => job.status === "PUBLISHED").length;
  const drafts = recruiterJobs.filter((job) => job.status === "DRAFT").length;
  const paused = recruiterJobs.filter((job) => job.status === "PAUSED").length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageIntro
        title="Company jobs"
        description="Draft, publish, pause, and close the roles your company is hiring for."
        action={
          <Link href="/recruiter/jobs/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-brand-hover">
            <Plus className="size-4" /> Create job
          </Link>
        }
      />
      {recruiterJobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Create a draft to start hiring."
          action={
            <PrimaryLink href="/recruiter/jobs/new">Create job</PrimaryLink>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-ws-line bg-ws-panel shadow-[0_18px_60px_-42px_rgba(15,23,42,.45)]">
          <div className="grid border-b border-ws-line sm:grid-cols-2 lg:grid-cols-4">
            <JobMetric icon={BriefcaseBusiness} label="All jobs" value={recruiterJobs.length} />
            <JobMetric icon={Radio} label="Published" value={published} accent />
            <JobMetric icon={TimerReset} label="Drafts" value={drafts} />
            <JobMetric icon={CalendarDays} label="Paused" value={paused} />
          </div>

          <div className="flex flex-col gap-2 border-b border-ws-line bg-linear-to-r from-primary/7 via-transparent to-transparent px-5 py-5 sm:px-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hiring pipeline</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ws-fg">Openings and drafts</h2>
            </div>
            <p className="text-sm text-ws-muted">Manage the lifecycle of every company role</p>
          </div>

          <div className="grid gap-4 p-5 sm:p-7">
            {recruiterJobs.map((job) => (
              <article key={job.id} className="group relative overflow-hidden rounded-[22px] border border-ws-line bg-ws-panel p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_45px_-30px_rgba(15,23,42,.45)] sm:p-6">
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${statusAccent(job.status)}`} />
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <BriefcaseBusiness className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link href={`/recruiter/jobs/${job.id}`} className="truncate text-base font-bold tracking-tight text-ws-fg transition hover:text-primary sm:text-lg">
                          {job.title}
                        </Link>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyle(job.status)}`}>{formatStatus(job.status)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ws-muted">
                        <span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-3.5" />{job.categoryName || "Uncategorized"}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{job.location || "Location not set"}</span>
                        {job.workMode ? <span className="rounded-md bg-ws-card px-2 py-1 text-xs font-semibold">{formatStatus(job.workMode)}</span> : null}
                        {job.jobType ? <span className="rounded-md bg-ws-card px-2 py-1 text-xs font-semibold">{formatStatus(job.jobType)}</span> : null}
                      </div>
                      {job.expiredAt ? <p className="mt-3 flex items-center gap-1.5 text-xs text-ws-faint"><CalendarDays className="size-3.5" /> Closes {formatDate(job.expiredAt)}</p> : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line pt-4 lg:border-0 lg:pt-0">
                    <JobStatusActions job={job} />
                    <Link href={`/recruiter/jobs/${job.id}`} aria-label={`View ${job.title}`} title="View job" className="flex size-11 items-center justify-center rounded-xl bg-ws-card text-ws-muted transition hover:bg-primary/10 hover:text-primary">
                      <ArrowUpRight className="size-4.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function JobMetric({ icon: Icon, label, value, accent = false }: { icon: typeof BriefcaseBusiness; label: string; value: number; accent?: boolean }) {
  return <div className="flex items-center gap-3 border-b border-ws-line px-5 py-5 last:border-b-0 sm:border-r sm:nth-last-2:border-b-0 lg:border-b-0 lg:last:border-r-0 sm:px-6"><span className={`flex size-10 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-ws-card text-ws-muted"}`}><Icon className="size-4.5" /></span><div><p className="text-2xl font-bold tracking-tight text-ws-fg">{value}</p><p className="text-xs font-medium text-ws-muted">{label}</p></div></div>;
}

function formatStatus(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Not set" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
function statusAccent(status: JobPostStatus) { if (status === "PUBLISHED") return "bg-primary"; if (status === "PAUSED") return "bg-amber-400"; if (status === "CLOSED" || status === "REJECTED" || status === "EXPIRED") return "bg-slate-400"; return "bg-blue-400"; }
function statusStyle(status: JobPostStatus) { if (status === "PUBLISHED") return "bg-primary/10 text-primary"; if (status === "PAUSED") return "bg-amber-400/15 text-amber-700 dark:text-amber-300"; if (status === "CLOSED" || status === "REJECTED" || status === "EXPIRED") return "bg-ws-card text-ws-muted"; return "bg-blue-500/10 text-blue-700 dark:text-blue-300"; }
