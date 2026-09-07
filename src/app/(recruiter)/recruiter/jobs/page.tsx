"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Plus,
  Search,
  TimerReset,
} from "lucide-react";
import type { JobPostStatus } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, PillTabs, type Tone } from "@/components/workspace/primitives";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetRecruiterJobsQuery } from "@/services/recruiterApi";

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

const TABS = Object.keys(filterLabels) as Filter[];

const statusTone: Record<JobPostStatus, Tone> = {
  PUBLISHED: "solid",
  PAUSED: "soft",
  DRAFT: "quiet",
  PENDING: "soft",
  APPROVED: "soft",
  REJECTED: "alert",
  CLOSED: "quiet",
  EXPIRED: "quiet",
};

const COLUMNS = [
  { key: "job", label: "Job title", className: "w-[35%]" },
  { key: "status", label: "Status", className: "w-[15%]" },
  { key: "type", label: "Mode & Type", className: "w-[20%]" },
  { key: "dates", label: "Date", className: "w-[15%]" },
  { key: "actions", label: "", className: "w-[15%] text-right" },
];

export default function RecruiterJobsPage() {
  const tx = useWorkspaceTranslation();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const jobsQuery = useGetRecruiterJobsQuery();
  const recruiterJobs = useMemo(() => jobsQuery.data ?? [], [jobsQuery.data]);

  const filtered = useMemo(() => {
    return recruiterJobs.filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      if (!matchesSearch) return false;
      if (filter === "ALL") return true;
      return filterStatuses[filter].includes(job.status);
    });
  }, [recruiterJobs, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const pagedRows = useMemo(() => {
    const start = page * size;
    return filtered.slice(start, start + size);
  }, [filtered, page, size]);

  if (jobsQuery.isLoading) return <LoadingState rows={6} />;
  if (jobsQuery.isError) {
    return (
      <ErrorState
        message={tx("Unable to load company jobs.")}
        onRetry={() => void jobsQuery.refetch()}
      />
    );
  }

  const published = recruiterJobs.filter((job) => job.status === "PUBLISHED").length;
  const drafts = recruiterJobs.filter((job) => job.status === "DRAFT").length;
  const paused = recruiterJobs.filter((job) => job.status === "PAUSED").length;

  const reset = <T,>(setter: (val: T) => void) => (val: T) => {
    setter(val);
    setPage(0);
  };

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] flex-col gap-4">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          icon={<BriefcaseBusiness className="size-4.5" />}
          label={tx("All jobs")}
          value={recruiterJobs.length}
        />
        <MetricCard
          icon={<CheckCircle2 className="size-4.5" />}
          label={tx("Published")}
          value={published}
          accent
        />
        <MetricCard
          icon={<TimerReset className="size-4.5" />}
          label={tx("Drafts")}
          value={drafts}
        />
        <MetricCard
          icon={<CalendarDays className="size-4.5" />}
          label={tx("Paused")}
          value={paused}
        />
      </div>

      {/* Main Console Table Panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-ws-fg">{tx("Company jobs")}</h2>
            <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
              {filtered.length}
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ws-faint"
              />
              <Input
                value={search}
                onChange={(e) => reset(setSearch)(e.target.value)}
                placeholder={tx("Search jobs…")}
                className="h-9 pl-9 text-sm"
              />
            </div>
            <Button size="sm" render={<Link href="/recruiter/jobs/new" />}>
              <Plus aria-hidden="true" className="size-4" />
              {tx("Create job")}
            </Button>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <PillTabs
            tabs={TABS}
            value={filter}
            onChange={reset(setFilter)}
            className="rounded-lg bg-ws-card p-1"
          />
        </div>

        <div className="ws-scroll min-h-0 flex-1 overflow-auto border-t border-ws-line">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`${col.className} bg-ws-card px-4 py-2.5 text-xs font-semibold text-ws-muted shadow-[inset_0_-1px_0_var(--ws-line)]`}
                  >
                    {col.label ? tx(col.label) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-sm text-ws-faint"
                  >
                    {search || filter !== "ALL"
                      ? tx("No jobs match that filter or search.")
                      : tx("No jobs posted yet.")}
                  </td>
                </tr>
              ) : (
                pagedRows.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-ws-line bg-ws-card text-xs font-semibold text-primary">
                          <BriefcaseBusiness aria-hidden="true" className="size-4.5" />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/recruiter/jobs/${job.id}`}
                            className="block truncate font-semibold text-ws-fg hover:underline"
                          >
                            {job.title}
                          </Link>
                          <span className="block truncate text-xs text-ws-faint">
                            {[job.categoryName, job.location].filter(Boolean).join(" · ") ||
                              tx("Uncategorized")}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Chip tone={statusTone[job.status]}>
                        {tx(formatStatus(job.status))}
                      </Chip>
                    </td>

                    <td className="px-4 py-3 text-xs text-ws-muted">
                      <div className="flex flex-wrap gap-1">
                        {job.workMode ? (
                          <span className="rounded bg-ws-card px-1.5 py-0.5 font-medium text-ws-fg">
                            {tx(formatStatus(job.workMode))}
                          </span>
                        ) : null}
                        {job.jobType ? (
                          <span className="rounded bg-ws-card px-1.5 py-0.5 font-medium text-ws-muted">
                            {tx(formatStatus(job.jobType))}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-ws-muted">
                      {job.expiredAt ? (
                        <span>{tx("Closes ")}{formatDate(job.expiredAt)}</span>
                      ) : job.publishedAt ? (
                        <span>{tx("Published ")}{formatDate(job.publishedAt)}</span>
                      ) : (
                        <span className="text-ws-faint">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={`/recruiter/jobs/${job.id}`} />}
                          className="h-9 rounded-lg px-3 text-sm"
                        >
                          {tx("Open")}
                          <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
          <PageSizeSelect
            value={size}
            onChange={reset(setSize)}
            id="recruiter-jobs-page-size"
          />
          {filtered.length > 0 ? (
            <div className="ml-auto">
              <Pager
                page={{
                  number: page,
                  totalPages,
                  totalElements: filtered.length,
                }}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ws-line bg-ws-panel p-3.5">
      <span
        className={`relative flex size-9 shrink-0 items-center justify-center rounded-lg border ${
          accent
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-ws-line bg-ws-card text-ws-muted"
        }`}
      >
        {accent ? (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 size-1.5 rounded-full bg-primary"
          />
        ) : null}
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold tabular-nums text-ws-fg">{value}</p>
        <p className="truncate text-xs font-medium text-ws-muted">{label}</p>
      </div>
    </div>
  );
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}
