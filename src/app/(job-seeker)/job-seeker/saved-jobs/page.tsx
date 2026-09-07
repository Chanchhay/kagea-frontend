"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  BookmarkX,
  BriefcaseBusiness,
  CalendarDays,
  ArrowUpRight,
  Banknote,
  MapPin,
  Radio,
  Trash2,
} from "lucide-react";
import type { FavoriteJobResponse } from "@/contracts";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetFavoriteJobsQuery,
  useRemoveFavoriteJobMutation,
} from "@/services/jobSeekerApi";

const PAGE_SIZE = 20;
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

export default function SavedJobsPage() {
  const tx = useWorkspaceTranslation();
  const [page, setPage] = useState(0);
  const query = useGetFavoriteJobsQuery({ page, size: PAGE_SIZE });

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message={tx("Unable to load saved jobs.")} onRetry={() => void query.refetch()} />;

  const saved = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 1;
  const openCount = saved.filter((job) => job.available).length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-8">
        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-primary sm:flex"><Bookmark aria-hidden="true" className="size-6" /></span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Saved jobs")}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{tx("Roles you bookmarked while browsing. Closed and expired posts stay here until you remove them.")}</p>
            </div>
          </div>
          <Link href="/job-seeker/jobs" className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-hover ${focusRing}`}>
            {tx("Browse jobs")}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
      </header>

      {saved.length ? (
        <section className="min-w-0 space-y-5">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-primary">{tx("Your shortlist")}</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ws-fg">{tx("Opportunities worth revisiting")}</h2>
              <p className="mt-1 text-sm text-ws-muted">{tx("Keep track of roles you may want to apply for.")}</p>
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <SummaryValue value={saved.length} label={tx("Saved")} icon={Bookmark} />
              <SummaryValue value={openCount} label={tx("Open")} icon={Radio} accent />
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((job) => (
              <SavedJobRow key={job.id} job={job} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 max-md:flex-wrap border-t border-ws-line px-5 py-4">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                {tx("Previous")}</button>
              <span className="text-xs text-ws-muted">
                {tx("Page ")}{page + 1} {tx(" of ")}{totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={page >= totalPages - 1}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                {tx("Next")}</button>
            </div>
          ) : null}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-ws-line bg-ws-card/40 px-6 py-16 text-center">
          <BookmarkX className="mx-auto size-10 text-ws-faint" />
          <h2 className="mt-4 font-semibold text-ws-fg">{tx("No saved jobs yet")}</h2>
          <p className="mt-2 text-sm text-ws-muted">
            {tx("Tap the bookmark on any job to keep it here for later.")}</p>
          <Link
            href="/job-seeker/jobs"
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {tx("Browse jobs")}</Link>
        </div>
      )}
    </div>
  );
}

function SavedJobRow({ job }: { job: FavoriteJobResponse }) {
  const tx = useWorkspaceTranslation();
  const [removeJob, { isLoading }] = useRemoveFavoriteJobMutation();

  async function handleRemove() {
    try {
      await removeJob(job.jobId).unwrap();
    } catch {
      toast.error(tx("Could not remove saved job. Please try again."));
    }
  }

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ws-line bg-ws-panel shadow-xs transition duration-200 hover:border-ws-muted/40 hover:shadow-md">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-ws-line bg-ws-card/50 px-4 py-3 sm:px-5">
        <span className={`inline-flex items-center gap-2 text-xs font-semibold ${job.available ? "text-primary" : "text-ws-muted"}`}>
          <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${job.available ? "bg-primary" : "bg-ws-faint"}`} />
          {tx(job.available ? "Accepting applications" : "Closed")}
        </span>
        <button type="button" onClick={() => void handleRemove()} disabled={isLoading} aria-label={tx("Remove {0} from saved jobs", { 0: job.title })} title={tx("Remove saved job")} className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-panel text-ws-muted transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 ${focusRing}`}><Trash2 aria-hidden="true" className="size-4" /></button>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-ws-fg"><BriefcaseBusiness className="size-6" /></span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-snug tracking-tight text-ws-fg [overflow-wrap:anywhere]">
              {job.available ? <Link href={`/jobs/${job.jobId}`} className={`rounded-sm transition hover:text-primary ${focusRing}`}>{job.title}</Link> : job.title}
            </h2>
            <p className="mt-1.5 text-sm text-ws-muted [overflow-wrap:anywhere]">{job.companyName}</p>
          </div>
        </div>
        <div className="mt-5 flex min-w-0 flex-col gap-2.5 text-sm text-ws-muted">
          {job.location ? <p className="flex min-w-0 items-start gap-2"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /><span className="min-w-0 [overflow-wrap:anywhere]">{job.location}</span></p> : null}
          <p className="flex items-start gap-2"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><span>{tx("Saved")} <time dateTime={job.savedAt}>{formatDate(job.savedAt)}</time></span></p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.workMode ? <JobChip>{tx(formatEnum(job.workMode))}</JobChip> : null}
          {job.jobType ? <JobChip>{tx(formatEnum(job.jobType))}</JobChip> : null}
          {job.experienceLevel ? <JobChip>{tx(formatEnum(job.experienceLevel))}</JobChip> : null}
        </div>
        {!job.available ? <p className="mt-4 text-xs leading-relaxed text-ws-muted">{tx("No longer accepting applications")}</p> : null}
      </div>

      <div className="flex min-w-0 flex-col gap-4 border-t border-ws-line bg-ws-panel p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs text-ws-muted"><Banknote aria-hidden="true" className="size-4 shrink-0" />{tx("Salary")}</p>
          <p className="mt-1 text-base font-bold text-ws-fg [overflow-wrap:anywhere]">{tx(formatSalary(job.salaryMin, job.salaryMax))}</p>
        </div>
        {job.available ? <Link href={`/jobs/${job.jobId}`} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ws-line bg-ws-card px-4 py-2 text-sm font-semibold text-ws-fg shadow-xs transition hover:bg-ws-card-hover hover:border-ws-muted/30 ${focusRing}`}>{tx("View job")}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></Link> : null}
      </div>
    </article>
  );
}

function SummaryValue({ value, label, icon: Icon, accent = false }: { value: number; label: string; icon: typeof Bookmark; accent?: boolean }) {
  const tx = useWorkspaceTranslation(); return <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-ws-line bg-ws-panel px-4 py-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "border border-ws-line bg-ws-card text-ws-fg"}`}><Icon className="size-4" /></span><div><p className="font-bold leading-none text-ws-fg">{value}</p><p className="mt-1 text-[11px] text-ws-muted">{tx(label)}</p></div></div>; }
function JobChip({ children }: { children: React.ReactNode }) { return <span className="max-w-full rounded-lg border border-ws-line bg-ws-card px-2.5 py-1.5 text-xs font-medium text-ws-muted [overflow-wrap:anywhere]">{children}</span>; }
function formatEnum(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatSalary(min: number | null, max: number | null) { const number = new Intl.NumberFormat("en", { maximumFractionDigits: 0 }); if (min && max) return `$${number.format(min)} – $${number.format(max)}`; if (min) return `From $${number.format(min)}`; if (max) return `Up to $${number.format(max)}`; return "Negotiable"; }

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "recently"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}
