"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ListChecks,
  Loader2,
  PlayCircle,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import type { AiInterviewSessionResponse, InterviewStatus } from "@/contracts";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetAiInterviewsQuery } from "@/services/jobSeekerApi";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

const continueLabels: Record<InterviewStatus, string> = {
  PREPARING: "Preparing questions…",
  READY: "Ready to start",
  PENDING: "Ready to start",
  IN_PROGRESS: "Continue interview",
  COMPLETED: "View result",
  FAILED: "Interview failed",
  CANCELLED: "Interview cancelled",
};

export default function InterviewsPage() {
  const tx = useWorkspaceTranslation();
  const interviewsQuery = useGetAiInterviewsQuery();

  if (interviewsQuery.isLoading) return <LoadingState rows={5} />;
  if (interviewsQuery.isError)
    return (
      <ErrorState
        message={tx("Unable to load AI interviews.")}
        onRetry={() => void interviewsQuery.refetch()}
      />
    );

  const aiInterviews = interviewsQuery.data ?? [];
  const completed = aiInterviews.filter((interview) => interview.status === "COMPLETED");
  const passed = completed.filter((interview) => interview.result === "PASSED").length;
  const inProgress = aiInterviews.filter((interview) =>
    ["IN_PROGRESS", "READY", "PENDING", "PREPARING"].includes(interview.status),
  ).length;
  const avgScore = completed.length
    ? Math.round(completed.reduce((sum, interview) => sum + (interview.totalScore || 0), 0) / completed.length)
    : null;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-8">
        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-primary sm:flex"><Sparkles aria-hidden="true" className="size-6" /></span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("AI interviews")}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{tx("Practice interviews generated from the jobs you are interested in.")}</p>
            </div>
          </div>
          <Link href="/job-seeker/jobs" className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-hover ${focusRing}`}>
            {tx("Browse jobs")}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
      </header>

      {aiInterviews.length ? (
        <>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <Metric icon={ListChecks} label={tx("Total interviews")} value={aiInterviews.length} />
            <Metric icon={PlayCircle} label={tx("In progress")} value={inProgress} accent />
            <Metric icon={CheckCircle2} label={tx("Completed")} value={completed.length} />
            <Metric icon={Trophy} label={tx("Passed")} value={completed.length ? `${passed}/${completed.length}` : "—"} />
          </div>

          <section aria-label={tx("AI interviews")} className="min-w-0 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-ws-fg">{tx("Your practice sessions")}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ws-muted">
                {avgScore !== null
                  ? tx("Average score across completed interviews: {0}", { 0: avgScore })
                  : tx("Finish a practice interview to see your scores here.")}
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {aiInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-ws-line bg-ws-card/40 px-6 py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-ws-muted"><Sparkles aria-hidden="true" className="size-8" /></span>
          <h2 className="mt-5 text-lg font-semibold text-ws-fg">{tx("No AI interviews yet")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx("Open a job posting and start a practice interview to see it here.")}</p>
          <Link href="/job-seeker/jobs" className={`mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-hover ${focusRing}`}>
            {tx("Browse jobs")}</Link>
        </div>
      )}
    </div>
  );
}

function InterviewCard({ interview }: { interview: AiInterviewSessionResponse }) {
  const tx = useWorkspaceTranslation();
  const status = statusInfo(interview.status);
  const Icon = status.icon;
  const href =
    interview.status === "COMPLETED"
      ? `/job-seeker/interviews/${interview.id}/result`
      : `/job-seeker/interviews/${interview.id}`;
  const questionCount = interview.questionCount ?? 0;
  const answeredCount = interview.answeredCount ?? 0;
  const progress = questionCount > 0 ? Math.min(100, Math.round((answeredCount / questionCount) * 100)) : 0;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ws-line bg-ws-panel shadow-xs transition duration-200 hover:border-ws-muted/40 hover:shadow-md">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-ws-line bg-ws-card/50 px-4 py-3 sm:px-5">
        <span className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}>
          <Icon aria-hidden="true" className={`size-3.5 shrink-0 ${interview.status === "PREPARING" ? "animate-spin" : ""}`} />
          <span className="min-w-0 [overflow-wrap:anywhere]">{tx(status.label)}</span>
        </span>
        {interview.status === "COMPLETED" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            <Trophy aria-hidden="true" className="size-3.5 shrink-0" />{interview.totalScore}
          </span>
        ) : null}
      </div>

      <div className="flex-1 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-ws-fg"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span>
          <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight text-ws-fg [overflow-wrap:anywhere]">
            <Link href={href} className={`rounded-sm transition hover:text-primary ${focusRing}`}>{interview.jobTitle}</Link>
          </h3>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ws-muted">
            <span>{tx("Questions answered")}</span>
            <span className="font-medium text-ws-fg tabular-nums">{answeredCount} / {questionCount}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ws-card">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="border-t border-ws-line bg-ws-panel p-4">
        <Link href={href} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ws-line bg-ws-card px-3 py-2 text-center text-sm font-semibold text-ws-fg shadow-xs transition hover:bg-ws-card-hover hover:border-ws-muted/30 ${focusRing}`}>
          {tx(continueLabels[interview.status] ?? interview.status)}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      </div>
    </article>
  );
}

function Metric({ icon: Icon, label, value, accent = false }: { icon: typeof ListChecks; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-ws-line bg-ws-panel p-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "border border-ws-line bg-ws-card text-ws-fg"}`}><Icon aria-hidden="true" className="size-4.5" /></span>
      <div className="min-w-0"><p className="text-xl font-bold tabular-nums text-ws-fg">{value}</p><p className="mt-0.5 text-xs leading-relaxed text-ws-muted">{label}</p></div>
    </div>
  );
}

function statusInfo(status: InterviewStatus): { label: string; className: string; icon: typeof PlayCircle } {
  switch (status) {
    case "COMPLETED":
      return { label: "Completed", className: "bg-primary/10 text-primary", icon: CheckCircle2 };
    case "IN_PROGRESS":
      return { label: "In progress", className: "bg-chip-quiet text-chip-quiet-fg", icon: PlayCircle };
    case "READY":
    case "PENDING":
      return { label: "Ready to start", className: "bg-chip-quiet text-chip-quiet-fg", icon: PlayCircle };
    case "PREPARING":
      return { label: "Preparing questions…", className: "bg-chip-quiet text-chip-quiet-fg", icon: Loader2 };
    case "FAILED":
      return { label: "Interview failed", className: "bg-chip-alert text-chip-alert-fg", icon: XCircle };
    case "CANCELLED":
    default:
      return { label: "Interview cancelled", className: "bg-ws-card text-ws-muted", icon: XCircle };
  }
}
