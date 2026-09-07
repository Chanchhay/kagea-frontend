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
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetFavoriteJobsQuery,
  useRemoveFavoriteJobMutation,
} from "@/services/jobSeekerApi";

const PAGE_SIZE = 20;

export default function SavedJobsPage() {
  const tx = useWorkspaceTranslation();
  const [page, setPage] = useState(0);
  const query = useGetFavoriteJobsQuery({ page, size: PAGE_SIZE });

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message={tx("Unable to load saved jobs.")} />;

  const saved = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 1;
  const openCount = saved.filter((job) => job.available).length;

  return (
    <div className="mx-auto w-full max-w-7xl max-md:min-w-0">
      <PageIntro
        title={tx("Saved jobs")}
        description={tx("Roles you bookmarked while browsing. Closed and expired posts stay here until you remove them.")}
      />

      {saved.length ? (
        <section className="overflow-hidden rounded-[28px] border border-ws-line bg-ws-panel shadow-[0_18px_60px_-42px_rgba(15,23,42,.45)]">
          <div className="flex flex-col gap-5 border-b border-ws-line bg-linear-to-r from-primary/8 via-transparent to-transparent px-5 py-6 sm:px-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{tx("Your shortlist")}</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ws-fg">{tx("Opportunities worth revisiting")}</h2>
              <p className="mt-1 text-sm text-ws-muted">{tx("Keep track of roles you may want to apply for.")}</p>
            </div>
            <div className="flex gap-3 max-md:flex-wrap">
              <SummaryValue value={saved.length} label={tx("Saved")} icon={Bookmark} />
              <SummaryValue value={openCount} label={tx("Open")} icon={Radio} accent />
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2 max-md:grid-cols-1 max-md:p-3">
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
        <div className="rounded-[24px] bg-ws-card px-6 py-16 text-center">
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

  return (
    <article
      className={`group relative flex min-h-64 flex-col overflow-hidden rounded-[22px] border border-ws-line bg-ws-panel p-5 max-md:min-w-0 max-md:p-4 max-md:[container-type:inline-size] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_45px_-30px_rgba(15,23,42,.45)] ${
        job.available ? "" : "opacity-60"
      }`}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${job.available ? "bg-primary" : "bg-ws-faint"}`} />

      <div className="flex items-start justify-between gap-3 max-md:flex-col">
        <span className="flex size-12 max-md:shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-primary group-hover:text-primary-foreground"><Bookmark className="size-5 fill-current" /></span>
        <div className="flex items-center gap-2 max-md:w-full max-md:justify-between">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${job.available ? "bg-primary/10 text-primary" : "bg-chip-alert text-chip-alert-fg"}`}>{job.available ? tx("Accepting applications") : tx("Closed")}</span>
          <button type="button" onClick={() => removeJob(job.jobId)} disabled={isLoading} aria-label={tx("Remove {0} from saved jobs", { 0: job.title })} title={tx("Remove saved job")} className="inline-flex size-9 max-md:shrink-0 items-center justify-center rounded-xl bg-ws-card text-ws-muted transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"><Trash2 className="size-4" /></button>
        </div>
      </div>

      <div className="mt-5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {/*
           * Only an open job links out: the public detail page returns 404 for
           * a closed or expired post, so a link there would be a dead end.
           */}
          {job.available ? (
            <Link
              href={`/jobs/${job.jobId}`}
              className="truncate text-lg font-bold tracking-tight text-ws-fg hover:text-primary max-md:whitespace-normal"
            >
              {job.title}
            </Link>
          ) : (
            <h2 className="truncate font-semibold text-ws-fg max-md:whitespace-normal">{job.title}</h2>
          )}
          {job.available ? null : (
            <span className="rounded-full bg-chip-alert px-2.5 py-1 text-[18px] font-semibold text-chip-alert-fg max-md:whitespace-nowrap max-md:text-[clamp(0.625rem,5cqi,1.125rem)]">
              {tx("No longer accepting applications")}</span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ws-muted">
          <span className="flex items-center gap-1.5">
            <BriefcaseBusiness className="size-3.5 max-md:shrink-0" /> {job.companyName}
          </span>
          {job.location ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 max-md:shrink-0" /> {job.location}
            </span>
          ) : null}
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 max-md:shrink-0" /> {tx(" Saved ")}{formatDate(job.savedAt)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.workMode ? <JobChip>{tx(formatEnum(job.workMode))}</JobChip> : null}
          {job.jobType ? <JobChip>{tx(formatEnum(job.jobType))}</JobChip> : null}
          {job.experienceLevel ? <JobChip>{tx(formatEnum(job.experienceLevel))}</JobChip> : null}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-ws-line pt-4 max-md:flex-col max-md:items-start">
        <div><p className="flex items-center gap-1.5 text-xs text-ws-muted"><Banknote className="size-3.5 max-md:shrink-0" /> {tx(" Salary")}</p><p className="mt-1 text-sm font-bold text-ws-fg">{formatSalary(job.salaryMin, job.salaryMax)}</p></div>
        {job.available ? <Link href={`/jobs/${job.jobId}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary max-md:w-full max-md:shrink-0 max-md:justify-center max-md:whitespace-nowrap px-4 text-sm font-semibold text-primary-foreground transition hover:bg-brand-hover">{tx("View job ")}<ArrowUpRight className="size-4" /></Link> : null}
      </div>
    </article>
  );
}

function SummaryValue({ value, label, icon: Icon, accent = false }: { value: number; label: string; icon: typeof Bookmark; accent?: boolean }) {
  const tx = useWorkspaceTranslation(); return <div className="flex min-w-24 items-center gap-3 rounded-2xl border border-ws-line bg-ws-panel px-4 py-3"><span className={`flex size-9 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-ws-card text-ws-muted"}`}><Icon className="size-4" /></span><div><p className="font-bold leading-none text-ws-fg">{value}</p><p className="mt-1 text-[11px] text-ws-muted">{tx(label)}</p></div></div>; }
function JobChip({ children }: { children: React.ReactNode }) { return <span className="rounded-lg bg-ws-card px-2.5 py-1.5 text-xs font-semibold text-ws-muted">{children}</span>; }
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
