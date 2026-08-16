"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, MapPin, Search, Sparkles, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Input } from "@/components/ui/input";
import { useGetForwardedApplicationsQuery } from "@/services/recruiterApi";

export default function ForwardedCandidatesPage() {
  const query = useGetForwardedApplicationsQuery();
  const [search, setSearch] = useState("");
  const candidates = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return [...(query.data ?? [])]
      .filter((item) => !keyword || [item.candidate.headline, item.candidate.currentPosition, item.candidate.preferredLocation, item.application.jobTitle].some((value) => value?.toLowerCase().includes(keyword)))
      .sort((a, b) => Date.parse(b.forwardedAt) - Date.parse(a.forwardedAt));
  }, [query.data, search]);

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message="Unable to load forwarded candidates." />;

  return <div className="mx-auto max-w-6xl pb-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold text-primary">Candidate pipeline</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">Forwarded candidates</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ws-muted">Review candidates forwarded by moderators, including their resume and AI interview result.</p></div>
      <div className="rounded-2xl border border-ws-line bg-ws-card px-5 py-3 text-center"><p className="text-2xl font-bold text-ws-fg">{query.data?.length ?? 0}</p><p className="text-xs text-ws-muted">Total forwarded</p></div>
    </div>

    <div className="relative mt-7 max-w-xl"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ws-faint" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate, job, or location" className="h-12 rounded-2xl border-ws-line bg-ws-card pl-11" /></div>

    <div className="mt-6 grid gap-4">
      {candidates.length ? candidates.map((item) => {
        const score = item.aiResult?.feedback?.overallScore;
        return <Link key={item.application.id} href={`/recruiter/forwarded-candidates/${item.application.id}`} className="group rounded-2xl border border-ws-line bg-ws-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary"><UserRound className="size-6" /></div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-lg font-semibold text-ws-fg">{item.candidate.headline || item.candidate.currentPosition || "Candidate"}</h3><Status value={item.application.status} /></div><p className="mt-1 flex items-center gap-1.5 text-sm text-ws-muted"><BriefcaseBusiness className="size-4" /> Applied for <span className="font-medium text-ws-fg">{item.application.jobTitle}</span></p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ws-muted">{item.candidate.preferredLocation && <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{item.candidate.preferredLocation}</span>}<span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />Forwarded {formatDate(item.forwardedAt)}</span>{score != null && <span className="flex items-center gap-1.5 font-semibold text-primary"><Sparkles className="size-3.5" />AI score {score}</span>}</div></div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ws-panel text-ws-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><ArrowRight className="size-4" /></span>
          </div>
        </Link>;
      }) : <EmptyState title={search ? "No matching candidates" : "No candidates forwarded yet"} description={search ? "Try another candidate, role, or location." : "Candidates will appear here after a moderator forwards their application."} />}
    </div>
  </div>;
}

function Status({ value }: { value: string }) { return <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{formatLabel(value)}</span>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date); }
