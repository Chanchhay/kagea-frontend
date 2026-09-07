"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, FileSearch, Search, Send, XCircle } from "lucide-react";
import type { JobApplicationStatus } from "@/contracts";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetApplicationsQuery } from "@/services/jobSeekerApi";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

type Filter = "ALL" | "ACTIVE" | "SUCCESS" | "CLOSED";

export default function ApplicationsPage() {
  const tx = useWorkspaceTranslation();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const query = useGetApplicationsQuery();
  const applications = useMemo(() => query.data ?? [], [query.data]);
  const filtered = useMemo(() => applications.filter((application) => {
    const matchesSearch = application.jobTitle.toLowerCase().includes(search.trim().toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "SUCCESS") return ["SHORTLISTED", "HUMAN_INTERVIEW_SCHEDULED", "HIRED"].includes(application.status);
    if (filter === "CLOSED") return ["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(application.status);
    if (filter === "ACTIVE") return !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(application.status);
    return true;
  }), [applications, filter, search]);

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message={tx("Unable to load applications.")} onRetry={() => void query.refetch()} />;
  const active = applications.filter((item) => !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length;
  const interviews = applications.filter((item) => item.status.includes("INTERVIEW")).length;
  const offers = applications.filter((item) => item.status === "HIRED").length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-8">
        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-primary sm:flex"><Send aria-hidden="true" className="size-6" /></span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("My applications")}</h1>
              <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx("Follow every opportunity from submission to final decision.")}</p>
            </div>
          </div>
          <Link href="/job-seeker/jobs" className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-hover ${focusRing}`}>{tx("Browse jobs")}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></Link>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Metric icon={Send} label={tx("Total applications")} value={applications.length} />
        <Metric icon={Clock3} label={tx("In progress")} value={active} accent />
        <Metric icon={interviews ? CalendarDays : CheckCircle2} label={tx("Interviews / hired")} value={`${interviews} / ${offers}`} />
      </div>

      <section aria-label={tx("Application tracker")} className="min-w-0 space-y-5">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ws-fg">{tx("Your hiring journey")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ws-muted">{tx("Review progress and prepare for your next step.")}</p>
          </div>
          <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-ws-line bg-ws-panel px-3.5 text-ws-muted transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <Search aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">{tx("Search applications")}</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tx("Search by job title")} className="min-w-0 w-full bg-transparent py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint lg:w-64" />
          </label>
        </div>
        <div role="group" aria-label={tx("Application tracker")} className="grid min-w-0 grid-cols-2 gap-1 rounded-2xl border border-ws-line bg-ws-panel p-1.5 sm:flex sm:w-fit sm:max-w-full sm:flex-wrap">
          {(["ALL", "ACTIVE", "SUCCESS", "CLOSED"] as Filter[]).map((item) => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${focusRing} ${filter === item ? "bg-primary text-primary-foreground shadow-sm" : "text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg"}`}>
              <span className="min-w-0 [overflow-wrap:anywhere]">{tx(item.charAt(0) + item.slice(1).toLowerCase())}</span>
              <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs tabular-nums ${filter === item ? "bg-primary-foreground/20" : "bg-ws-card"}`}>{filterCount(item, applications)}</span>
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((application) => {
              const status = statusInfo(application.status);
              const appliedAt = application.appliedAt || application.createdAt;
              return (
                <article key={application.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ws-line bg-ws-panel shadow-xs transition duration-200 hover:border-ws-muted/40 hover:shadow-md">
                  <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-ws-line bg-ws-card/50 px-4 py-3 sm:px-5">
                    <span className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}><span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${status.accent}`} /><span className="min-w-0 [overflow-wrap:anywhere]">{tx(status.label)}</span></span>
                  </div>
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-ws-fg"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span>
                      <h3 className="min-w-0 text-lg font-semibold leading-snug tracking-tight text-ws-fg [overflow-wrap:anywhere]"><Link href={`/job-seeker/applications/${application.id}`} className={`rounded-sm transition hover:text-primary ${focusRing}`}>{application.jobTitle}</Link></h3>
                    </div>
                    <div className="mt-5 space-y-3 text-xs text-ws-muted">
                      <p className="flex items-start gap-2"><CalendarDays aria-hidden="true" className="size-4 shrink-0" /><span>{tx("Applied")} <time dateTime={appliedAt}>{formatDate(appliedAt)}</time></span></p>
                      <p className="flex min-w-0 items-start gap-2"><FileSearch aria-hidden="true" className="size-4 shrink-0" /><span className="min-w-0 [overflow-wrap:anywhere]">{application.resumeTitle || tx("Resume attached")}</span></p>
                    </div>
                  </div>
                  <div className="border-t border-ws-line bg-ws-panel p-4">
                    <Link href={`/job-seeker/applications/${application.id}`} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ws-line bg-ws-card px-3 py-2 text-center text-sm font-semibold text-ws-fg shadow-xs transition hover:bg-ws-card-hover hover:border-ws-muted/30 ${focusRing}`}>
                      {tx("View application")}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ws-line bg-ws-card/40 px-5 py-16 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-ws-muted"><XCircle aria-hidden="true" className="size-8" /></span>
            <h2 className="mt-5 text-lg font-semibold text-ws-fg">{tx("No applications found")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx("Try another filter or explore new opportunities.")}</p>
            {search || filter !== "ALL" ? <button type="button" onClick={() => { setSearch(""); setFilter("ALL"); }} className={`mt-5 rounded-xl border border-ws-line bg-ws-card px-5 py-3 text-sm font-semibold text-ws-fg hover:bg-ws-card-hover ${focusRing}`}>{tx("Clear filters")}</button> : <Link href="/job-seeker/jobs" className={`mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-hover ${focusRing}`}>{tx("Browse jobs")}</Link>}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, accent = false }: { icon: typeof Send; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-ws-line bg-ws-panel p-4 sm:p-5">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "border border-ws-line bg-ws-card text-ws-fg"}`}><Icon aria-hidden="true" className="size-5" /></span>
      <div className="min-w-0"><p className="text-2xl font-bold tabular-nums text-ws-fg">{value}</p><p className="mt-1 text-xs leading-relaxed text-ws-muted">{label}</p></div>
    </div>
  );
}
function statusInfo(status: JobApplicationStatus) { if (["HIRED", "SHORTLISTED", "AI_INTERVIEW_PASSED"].includes(status)) return { label: status === "HIRED" ? "Hired" : status === "SHORTLISTED" ? "Shortlisted" : "Interview passed", className: "bg-primary/10 text-primary", accent: "bg-primary" }; if (["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status)) return { label: status.replaceAll("_", " ").toLowerCase(), className: "bg-chip-alert text-chip-alert-fg capitalize", accent: "bg-destructive" }; return { label: status.replaceAll("_", " ").toLowerCase(), className: "bg-chip-quiet text-chip-quiet-fg capitalize", accent: "bg-blue-400" }; }
function filterCount(filter: Filter, applications: { status: JobApplicationStatus }[]) { if (filter === "SUCCESS") return applications.filter((item) => ["SHORTLISTED", "HUMAN_INTERVIEW_SCHEDULED", "HIRED"].includes(item.status)).length; if (filter === "CLOSED") return applications.filter((item) => ["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length; if (filter === "ACTIVE") return applications.filter((item) => !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length; return applications.length; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
