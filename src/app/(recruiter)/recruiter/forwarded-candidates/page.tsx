"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  MapPin,
  Search,
  Sparkles,
  User,
  UserCheck,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetForwardedApplicationsQuery } from "@/services/recruiterApi";
import type {
  ForwardedApplicationResponse,
  InterviewResult,
  JobApplicationStatus,
} from "@/contracts";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "AI_INTERVIEW_PASSED", label: "AI interview passed" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "HUMAN_INTERVIEW_SCHEDULED", label: "Human interview scheduled" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ForwardedCandidatesPage() {
  const tx = useWorkspaceTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const applicationsQuery = useGetForwardedApplicationsQuery();
  const forwardedApplications = useMemo(() => applicationsQuery.data ?? [], [applicationsQuery.data]);

  const filteredCandidates = useMemo(() => forwardedApplications.filter((item) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.candidate.headline?.toLowerCase().includes(query) ||
      item.candidate.currentPosition?.toLowerCase().includes(query) ||
      item.application.jobTitle?.toLowerCase().includes(query) ||
      item.candidate.preferredLocation?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || item.application.status === statusFilter;

    return matchesSearch && matchesStatus;
  }), [forwardedApplications, search, statusFilter]);

  if (applicationsQuery.isLoading) return <LoadingState rows={6} />;
  if (applicationsQuery.isError) {
    return <ErrorState message={tx("Unable to load forwarded candidates. Please try again.")} onRetry={() => void applicationsQuery.refetch()} />;
  }

  const hasFilters = Boolean(search || statusFilter !== "ALL");
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  const hired = forwardedApplications.filter((item) => item.application.status === "HIRED").length;
  const scheduled = forwardedApplications.filter((item) => item.application.status === "HUMAN_INTERVIEW_SCHEDULED").length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-ws-panel p-5 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-80 rounded-full bg-primary/5" />
        <div className="relative flex min-w-0 items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex"><UsersRound aria-hidden="true" className="size-6" /></span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Forwarded candidates")}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{tx("Qualified candidates reviewed and forwarded by moderators after AI evaluation.")}</p>
          </div>
        </div>
      </header>

      {forwardedApplications.length ? (
        <div className="grid min-w-0 grid-cols-3 gap-3 sm:gap-4">
          <ForwardedMetric icon={Users} label={tx("Total forwarded")} value={forwardedApplications.length} />
          <ForwardedMetric icon={Calendar} label={tx("Interviews scheduled")} value={scheduled} accent />
          <ForwardedMetric icon={UserCheck} label={tx("Hired")} value={hired} />
        </div>
      ) : null}

      <div className="min-w-0 space-y-4 rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-ws-line bg-ws-card px-3.5 text-ws-muted transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <Search aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">{tx("Search candidates")}</span>
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tx("Search candidates, job title, position, location…")} className="min-w-0 w-full bg-transparent py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint" />
          </label>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "ALL")}>
            <SelectTrigger className="h-11 w-full min-w-0 shrink-0 rounded-xl border-ws-line bg-ws-card text-sm text-ws-fg sm:w-64">
              <SelectValue placeholder={tx("Application status")} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{tx(option.label)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ws-line pt-4">
          <span className="text-xs text-ws-muted">
            {tx("Showing {0} of {1} candidate(s)", { 0: filteredCandidates.length, 1: forwardedApplications.length })}
          </span>
          {hasFilters ? (
            <button type="button" onClick={clearFilters} className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-medium text-ws-muted transition hover:bg-ws-card-hover hover:text-ws-fg ${focusRing}`}>
              <X aria-hidden="true" className="size-3.5 shrink-0" />{tx("Reset filters")}
            </button>
          ) : null}
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-5 py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UsersRound aria-hidden="true" className="size-8" /></span>
          <h2 className="mt-5 text-lg font-semibold text-ws-fg">{tx("No forwarded candidates found")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ws-muted">
            {tx(forwardedApplications.length === 0
              ? "Candidates who pass AI screening and moderator review will appear here."
              : "No candidates match your search filters.")}
          </p>
          {hasFilters ? (
            <button type="button" onClick={clearFilters} className={`mt-5 rounded-xl border border-primary/20 bg-ws-panel px-5 py-3 text-sm font-semibold text-primary ${focusRing}`}>{tx("Clear filters")}</button>
          ) : null}
        </div>
      ) : (
        <div className="grid min-w-0 gap-4">
          {filteredCandidates.map((item) => (
            <CandidateRow key={item.application.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateRow({ item }: { item: ForwardedApplicationResponse }) {
  const tx = useWorkspaceTranslation();
  const status = applicationStatusInfo(item.application.status);
  const availability = availabilityInfo(item.candidate.availabilityStatus);
  const aiScore = item.aiResult?.feedback?.overallScore;
  const aiResult = item.aiResult?.feedback?.result;
  const resultInfo = aiResult ? interviewResultInfo(aiResult) : null;

  return (
    <article className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-start sm:justify-between sm:p-6">
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 text-lg font-semibold tracking-tight text-ws-fg [overflow-wrap:anywhere] group-hover:text-primary">
            {item.candidate.headline || tx("Candidate profile")}
          </h3>
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
            <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${status.accent}`} />
            {tx(formatStatus(item.application.status))}
          </span>
          {item.candidate.availabilityStatus ? (
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${availability.className}`}>
              {tx(item.candidate.availabilityStatus)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ws-fg">
          {item.candidate.currentPosition ? (
            <span className="flex items-center gap-1.5 font-medium">
              <User aria-hidden="true" className="size-4 shrink-0 text-ws-muted" />
              {item.candidate.currentPosition}
            </span>
          ) : null}
          <span className="flex items-center gap-1.5 font-medium text-primary">
            <Briefcase aria-hidden="true" className="size-4 shrink-0" />
            {tx("Applied:")} {item.application.jobTitle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-ws-muted">
          {item.candidate.preferredLocation ? (
            <span className="flex items-center gap-1"><MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />{item.candidate.preferredLocation}</span>
          ) : null}
          {item.submittedResume?.title ? (
            <span className="flex items-center gap-1"><FileText aria-hidden="true" className="size-3.5 shrink-0 text-primary" />{tx("Resume:")} {item.submittedResume.title}</span>
          ) : null}
          {aiScore !== undefined ? (
            <span className={`flex items-center gap-1 font-semibold ${resultInfo?.textClassName ?? "text-primary"}`}>
              <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />
              {tx("AI score:")} {aiScore}/100 {aiResult ? `(${tx(aiResult)})` : ""}
            </span>
          ) : null}
          {item.forwardedAt ? (
            <span className="flex items-center gap-1"><Calendar aria-hidden="true" className="size-3.5 shrink-0" />{tx("Forwarded:")} {formatDate(item.forwardedAt)}</span>
          ) : null}
        </div>
      </div>

      <Link href={`/recruiter/forwarded-candidates/${item.application.id}`} className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-white px-5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/50 hover:bg-primary/5 dark:bg-ws-panel ${focusRing}`}>
        {tx("View full details")}<ChevronRight aria-hidden="true" className="size-4 shrink-0" />
      </Link>
    </article>
  );
}

function ForwardedMetric({ icon: Icon, label, value, accent = false }: { icon: typeof Users; label: string; value: number; accent?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-2xl border p-4 ${accent ? "border-primary/25 bg-primary/5" : "border-ws-line bg-ws-panel"}`}>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><Icon aria-hidden="true" className="size-4.5" /></span>
      <div className="min-w-0"><p className="text-xl font-bold tabular-nums text-ws-fg">{value}</p><p className="mt-0.5 text-xs leading-relaxed text-ws-muted">{label}</p></div>
    </div>
  );
}

function formatStatus(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }

function applicationStatusInfo(status: JobApplicationStatus): { className: string; accent: string } {
  if (["HIRED", "SHORTLISTED", "AI_INTERVIEW_PASSED"].includes(status)) return { className: "bg-primary/10 text-primary", accent: "bg-primary" };
  if (["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status)) return { className: "bg-chip-alert text-chip-alert-fg", accent: "bg-destructive" };
  return { className: "bg-chip-quiet text-chip-quiet-fg", accent: "bg-blue-400" };
}

function availabilityInfo(status: string): { className: string } {
  switch (status) {
    case "Actively Looking": return { className: "bg-primary/10 text-primary" };
    case "Open to Offers": return { className: "bg-blue-500/10 text-blue-700 dark:text-blue-300" };
    case "Notice Period Required": return { className: "bg-amber-400/15 text-amber-700 dark:text-amber-300" };
    default: return { className: "bg-ws-card text-ws-muted" };
  }
}

function interviewResultInfo(result: InterviewResult): { textClassName: string } {
  if (result === "PASSED") return { textClassName: "text-primary" };
  if (result === "FAILED") return { textClassName: "text-destructive" };
  return { textClassName: "text-amber-700 dark:text-amber-300" };
}
