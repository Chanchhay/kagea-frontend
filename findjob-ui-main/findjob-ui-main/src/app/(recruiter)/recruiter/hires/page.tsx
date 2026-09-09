"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Search,
  Users,
} from "lucide-react";
import type { HiringRecordStatus } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, type Tone } from "@/components/workspace/primitives";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatMoney } from "@/lib/money";
import { useGetMyHiringRecordsQuery } from "@/services/financeApi";

const COLUMNS = [
  { key: "candidate", label: "Candidate & Role", className: "w-[28%]" },
  { key: "salary", label: "Offered Salary", className: "w-[18%]" },
  { key: "commission", label: "Commission", className: "w-[18%]" },
  { key: "status", label: "Status", className: "w-[16%]" },
  { key: "note", label: "Review Note", className: "w-[12%]" },
  { key: "actions", label: "", className: "w-[8%] text-right" },
];

const statusTone: Record<HiringRecordStatus, Tone> = {
  CONFIRMED: "solid",
  REPORTED: "soft",
  REJECTED: "alert",
};

export default function HiresPage() {
  const tx = useWorkspaceTranslation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const query = useGetMyHiringRecordsQuery({ page, size });

  if (query.isLoading) return <LoadingState rows={6} />;
  if (query.isError) {
    return (
      <ErrorState
        message={tx("Unable to load hires.")}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const hires = query.data?.content ?? [];
  const totalHires = query.data?.totalElements ?? hires.length;

  const filteredHires = hires.filter((hire) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (hire.candidateLabel && hire.candidateLabel.toLowerCase().includes(term)) ||
      (hire.jobTitle && hire.jobTitle.toLowerCase().includes(term))
    );
  });

  const confirmedCount = hires.filter((h) => h.status === "CONFIRMED").length;
  const reportedCount = hires.filter((h) => h.status === "REPORTED").length;
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
          label={tx("Total hires reported")}
          value={totalHires}
        />
        <MetricCard
          icon={<BadgeCheck aria-hidden="true" className="size-4.5" />}
          label={tx("Confirmed hires")}
          value={confirmedCount}
          accent
        />
        <MetricCard
          icon={<Clock3 aria-hidden="true" className="size-4.5" />}
          label={tx("Awaiting review")}
          value={reportedCount}
        />
      </div>

      {/* Main Console Table Panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-ws-fg">{tx("Hiring records")}</h2>
            <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
              {totalHires}
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
              placeholder={tx("Search candidate or role…")}
              className="h-9 pl-9 text-sm"
            />
          </div>
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
                    {tx(col.label)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHires.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-sm text-ws-faint"
                  >
                    {hires.length === 0
                      ? tx("No hires reported yet. Report a hire from a forwarded candidate once you make an offer.")
                      : tx("No hiring records match your search.")}
                  </td>
                </tr>
              ) : (
                filteredHires.map((hire) => (
                  <tr
                    key={hire.id}
                    className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60"
                  >
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <span className="block truncate font-semibold text-ws-fg">
                          {hire.candidateLabel || tx("Candidate")}
                        </span>
                        <span className="block truncate text-xs text-ws-faint">
                          {hire.jobTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm font-medium tabular-nums text-ws-fg">
                      {formatMoney(hire.offeredSalary, hire.salaryCurrency)}
                    </td>

                    <td className="px-4 py-3">
                      {hire.commission ? (
                        <div>
                          <span className="block text-sm font-semibold tabular-nums text-ws-fg">
                            {formatMoney(
                              hire.commission.commissionAmount,
                              hire.commission.currency,
                            )}
                          </span>
                          <span className="block text-xs text-ws-faint">
                            {hire.commission.commissionRate}{tx("% rate")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-ws-faint">
                          {hire.status === "REPORTED" ? tx("Pending review") : "—"}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <Chip tone={statusTone[hire.status]}>
                        {tx(formatStatus(hire.status))}
                      </Chip>
                    </td>

                    <td className="px-4 py-3 text-xs text-ws-muted">
                      <span className="line-clamp-2" title={hire.reviewNote || ""}>
                        {hire.reviewNote || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href={`/recruiter/forwarded-candidates/${hire.applicationId}`} />}
                        className="h-9 rounded-lg px-3 text-sm"
                      >
                        {tx("Open")}
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {query.data ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
            <PageSizeSelect
              value={size}
              onChange={reset(setSize)}
              id="hires-page-size"
            />
            <div className="ml-auto">
              <Pager page={query.data} onPageChange={setPage} />
            </div>
          </div>
        ) : null}
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

function formatStatus(status: HiringRecordStatus) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "REPORTED":
      return "Awaiting review";
    case "REJECTED":
      return "Rejected";
    default:
      return status;
  }
}
