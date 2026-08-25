"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, FileSearch, Search, Send, XCircle } from "lucide-react";
import type { JobApplicationStatus } from "@/contracts";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetApplicationsQuery } from "@/services/jobSeekerApi";

type Filter = "ALL" | "ACTIVE" | "SUCCESS" | "CLOSED";

export default function ApplicationsPage() {
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
  if (query.isError) return <ErrorState message="Unable to load applications." />;
  const active = applications.filter((item) => !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length;
  const interviews = applications.filter((item) => item.status.includes("INTERVIEW")).length;
  const offers = applications.filter((item) => item.status === "HIRED").length;

  return <div className="mx-auto w-full max-w-7xl">
    <PageIntro title="My applications" description="Follow every opportunity from submission to final decision." />
    <section className="overflow-hidden rounded-[28px] border border-ws-line bg-ws-panel shadow-[0_18px_60px_-42px_rgba(15,23,42,.45)]">
      <div className="grid border-b border-ws-line sm:grid-cols-3">
        <Metric icon={Send} label="Total applications" value={applications.length} />
        <Metric icon={Clock3} label="In progress" value={active} accent />
        <Metric icon={interviews ? CalendarDays : CheckCircle2} label="Interviews / hired" value={`${interviews} / ${offers}`} />
      </div>

      <div className="flex flex-col gap-5 border-b border-ws-line bg-linear-to-r from-primary/8 via-transparent to-transparent px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Application tracker</p><h2 className="mt-1 text-xl font-bold tracking-tight text-ws-fg">Your hiring journey</h2><p className="mt-1 text-sm text-ws-muted">Review progress and prepare for your next step.</p></div>
        <label className="flex h-11 items-center gap-2 rounded-xl border border-ws-line bg-ws-panel px-3.5 text-ws-muted transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"><Search className="size-4" /><span className="sr-only">Search applications</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by job title" className="w-full bg-transparent text-sm text-ws-fg outline-none placeholder:text-ws-faint sm:w-64" /></label>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-ws-line px-5 py-3 sm:px-7">{(["ALL", "ACTIVE", "SUCCESS", "CLOSED"] as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold capitalize transition ${filter === item ? "bg-primary text-primary-foreground" : "text-ws-muted hover:bg-ws-card hover:text-ws-fg"}`}>{item.toLowerCase()} <span className="ml-1 opacity-70">{filterCount(item, applications)}</span></button>)}</div>

      <div className="p-5 sm:p-7">
        {filtered.length ? <div className="grid gap-4 lg:grid-cols-2">{filtered.map((application) => { const status = statusInfo(application.status); const progress = statusProgress(application.status); return <Link key={application.id} href={`/job-seeker/applications/${application.id}`} className="group relative overflow-hidden rounded-[22px] border border-ws-line bg-ws-panel p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_45px_-30px_rgba(15,23,42,.45)]"><span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${status.accent}`} /><div className="flex items-start justify-between gap-3"><span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><BriefcaseBusiness className="size-5" /></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.className}`}>{status.label}</span></div><h3 className="mt-5 truncate text-lg font-bold tracking-tight text-ws-fg transition group-hover:text-primary">{application.jobTitle}</h3><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ws-muted"><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Applied {formatDate(application.appliedAt || application.createdAt)}</span><span className="flex items-center gap-1.5"><FileSearch className="size-3.5" /> {application.resumeTitle || "Resume attached"}</span></div><div className="mt-5 border-t border-ws-line pt-4"><div className="flex items-center justify-between text-[11px]"><span className="font-semibold text-ws-muted">Application progress</span><span className="font-bold text-primary">{progress}%</span></div><div className="mt-2 grid grid-cols-4 gap-1.5">{[25, 50, 75, 100].map((step) => <span key={step} className={`h-1.5 rounded-full ${progress >= step ? "bg-primary" : "bg-ws-card"}`} />)}</div></div><span className="mt-5 flex items-center justify-end gap-1.5 text-xs font-semibold text-ws-muted transition group-hover:text-primary">View application <ArrowUpRight className="size-4" /></span></Link>; })}</div> : <div className="rounded-[22px] border border-dashed border-ws-line bg-ws-card px-6 py-16 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><XCircle className="size-7" /></span><h2 className="mt-4 font-semibold text-ws-fg">No applications found</h2><p className="mt-2 text-sm text-ws-muted">Try another filter or explore new opportunities.</p><Link href="/job-seeker/jobs" className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Browse jobs</Link></div>}
      </div>
    </section>
  </div>;
}

function Metric({ icon: Icon, label, value, accent = false }: { icon: typeof Send; label: string; value: string | number; accent?: boolean }) { return <div className="flex items-center gap-4 border-b border-ws-line p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6"><span className={`flex size-11 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><Icon className="size-5" /></span><div><p className="text-2xl font-bold text-ws-fg">{value}</p><p className="mt-0.5 text-xs text-ws-muted">{label}</p></div></div>; }
function statusInfo(status: JobApplicationStatus) { if (["HIRED", "SHORTLISTED", "AI_INTERVIEW_PASSED"].includes(status)) return { label: status === "HIRED" ? "Hired" : status === "SHORTLISTED" ? "Shortlisted" : "Interview passed", className: "bg-chip-soft text-chip-soft-fg", accent: "bg-primary" }; if (["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status)) return { label: status.replaceAll("_", " ").toLowerCase(), className: "bg-chip-alert text-chip-alert-fg capitalize", accent: "bg-destructive" }; return { label: status.replaceAll("_", " ").toLowerCase(), className: "bg-chip-quiet text-chip-quiet-fg capitalize", accent: "bg-blue-400" }; }
function statusProgress(status: JobApplicationStatus) { if (["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status)) return 100; if (status === "HIRED") return 100; if (["SHORTLISTED", "HUMAN_INTERVIEW_SCHEDULED"].includes(status)) return 75; if (["AI_INTERVIEW_PASSED", "MODERATOR_REVIEW_PENDING", "AI_INTERVIEW_IN_PROGRESS"].includes(status)) return 50; return 25; }
function filterCount(filter: Filter, applications: { status: JobApplicationStatus }[]) { if (filter === "SUCCESS") return applications.filter((item) => ["SHORTLISTED", "HUMAN_INTERVIEW_SCHEDULED", "HIRED"].includes(item.status)).length; if (filter === "CLOSED") return applications.filter((item) => ["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length; if (filter === "ACTIVE") return applications.filter((item) => !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length; return applications.length; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
