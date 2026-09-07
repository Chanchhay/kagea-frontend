"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, PillTabs, type Tone } from "@/components/workspace/primitives";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetForwardedApplicationsQuery } from "@/services/recruiterApi";
import { resolveFileUrl } from "@/lib/file-url";

const STATUS_TABS = [
  "ALL",
  "AI_INTERVIEW_PASSED",
  "SHORTLISTED",
  "HUMAN_INTERVIEW_SCHEDULED",
  "HIRED",
  "REJECTED",
] as const;

type StatusTab = (typeof STATUS_TABS)[number];

const COLUMNS = [
  { key: "candidate", label: "Candidate", className: "w-[30%]" },
  { key: "job", label: "Applied Role", className: "w-[22%]" },
  { key: "score", label: "AI Evaluation", className: "w-[15%]" },
  { key: "date", label: "Forwarded", className: "w-[13%]" },
  { key: "status", label: "Status", className: "w-[12%]" },
  { key: "actions", label: "", className: "w-[8%] text-right" },
];

const statusTone: Record<string, Tone> = {
  AI_INTERVIEW_PASSED: "solid",
  SHORTLISTED: "solid",
  HUMAN_INTERVIEW_SCHEDULED: "soft",
  UNDER_REVIEW: "soft",
  HIRED: "solid",
  REJECTED: "alert",
  AI_INTERVIEW_FAILED: "alert",
  WITHDRAWN: "quiet",
};

export default function ForwardedCandidatesPage() {
  const tx = useWorkspaceTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusTab>("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const applicationsQuery = useGetForwardedApplicationsQuery();
  const forwardedApplications = useMemo(
    () => applicationsQuery.data ?? [],
    [applicationsQuery.data],
  );

  const filtered = useMemo(() => {
    return forwardedApplications.filter((item) => {
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
    });
  }, [forwardedApplications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const pagedRows = useMemo(() => {
    const start = page * size;
    return filtered.slice(start, start + size);
  }, [filtered, page, size]);

  if (applicationsQuery.isLoading) return <LoadingState rows={6} />;
  if (applicationsQuery.isError) {
    return (
      <ErrorState
        message={tx("Unable to load forwarded candidates. Please try again.")}
        onRetry={() => void applicationsQuery.refetch()}
      />
    );
  }

  const hired = forwardedApplications.filter(
    (item) => item.application.status === "HIRED",
  ).length;
  const scheduled = forwardedApplications.filter(
    (item) => item.application.status === "HUMAN_INTERVIEW_SCHEDULED",
  ).length;

  const reset = <T,>(setter: (val: T) => void) => (val: T) => {
    setter(val);
    setPage(0);
  };

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] flex-col gap-4">
      {/* Metric Tiles */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<Users aria-hidden="true" className="size-4.5" />}
          label={tx("Total forwarded")}
          value={forwardedApplications.length}
        />
        <MetricCard
          icon={<Calendar aria-hidden="true" className="size-4.5" />}
          label={tx("Interviews scheduled")}
          value={scheduled}
          accent
        />
        <MetricCard
          icon={<UserCheck aria-hidden="true" className="size-4.5" />}
          label={tx("Hired")}
          value={hired}
        />
      </div>

      {/* Main Console Table Panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-ws-fg">{tx("Forwarded candidates")}</h2>
            <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
              {filtered.length}
            </span>
          </div>

          <div className="relative ml-auto w-48 sm:w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ws-faint"
            />
            <Input
              value={search}
              onChange={(e) => reset(setSearch)(e.target.value)}
              placeholder={tx("Search candidates…")}
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <PillTabs
            tabs={STATUS_TABS}
            value={statusFilter}
            onChange={reset(setStatusFilter)}
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
                    {search || statusFilter !== "ALL"
                      ? tx("No candidates match your search or filter.")
                      : tx("Candidates who pass AI screening and moderator review will appear here.")}
                  </td>
                </tr>
              ) : (
                pagedRows.map((item) => {
                  const href = `/recruiter/forwarded-candidates/${item.application.id}`;
                  const aiScore = item.aiResult?.feedback?.overallScore;
                  const aiResult = item.aiResult?.feedback?.result;
                  const resumeUrl = item.submittedResume?.resumeFileUrl
                    ? resolveFileUrl(item.submittedResume.resumeFileUrl)
                    : null;

                  return (
                    <tr
                      key={item.application.id}
                      className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip-solid text-sm font-semibold text-chip-solid-fg">
                            {item.candidate.headline?.trim().charAt(0).toUpperCase() || "C"}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={href}
                              className="block truncate font-semibold text-ws-fg hover:underline"
                            >
                              {item.candidate.headline || tx("Candidate")}
                            </Link>
                            <span className="block truncate text-xs text-ws-faint">
                              {[
                                item.candidate.currentPosition,
                                item.candidate.preferredLocation,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="block truncate text-sm font-medium text-ws-fg">
                          {item.application.jobTitle}
                        </span>
                        {resumeUrl ? (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <FileText aria-hidden="true" className="size-3.5" />
                            {item.submittedResume?.title || tx("Resume")}
                          </a>
                        ) : null}
                      </td>

                      <td className="px-4 py-3">
                        {aiScore !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold tabular-nums text-ws-fg">
                              {aiScore}
                            </span>
                            <Chip
                              tone={
                                aiResult === "PASSED"
                                  ? "solid"
                                  : aiResult === "FAILED"
                                    ? "alert"
                                    : "soft"
                              }
                            >
                              {aiResult ? tx(aiResult) : tx("Score")}
                            </Chip>
                          </div>
                        ) : (
                          <span className="text-xs text-ws-faint">
                            {tx("Pending")}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-ws-muted">
                        {item.forwardedAt ? formatDate(item.forwardedAt) : "—"}
                      </td>

                      <td className="px-4 py-3">
                        <Chip tone={statusTone[item.application.status] || "quiet"}>
                          {tx(formatStatus(item.application.status))}
                        </Chip>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={href} />}
                          className="h-9 rounded-lg px-3 text-sm"
                        >
                          {tx("Open")}
                          <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
          <PageSizeSelect
            value={size}
            onChange={reset(setSize)}
            id="forwarded-page-size"
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
