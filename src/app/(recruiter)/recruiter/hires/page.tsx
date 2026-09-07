"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useState } from "react";
import { BadgeCheck, Clock3, HandCoins, XCircle } from "lucide-react";
import type { HiringRecordResponse, HiringRecordStatus } from "@/contracts";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatMoney } from "@/lib/money";
import { useGetMyHiringRecordsQuery } from "@/services/financeApi";

export default function HiresPage() {
  const tx = useWorkspaceTranslation();
  const [page, setPage] = useState(0);
  const query = useGetMyHiringRecordsQuery({ page });

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message={tx("Unable to load hires.")} />;

  const hires = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 1;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
      <PageIntro
        title={tx("Hires")}
        description={tx("Candidates you reported as hired, and where each one stands.")}
      />

      {hires.length === 0 ? (
        <div className="rounded-2xl border border-ws-line bg-ws-card px-6 py-16 text-center">
          <HandCoins aria-hidden="true" className="mx-auto size-10 text-ws-faint" />
          <h2 className="mt-4 font-semibold text-ws-fg">{tx("No hires reported")}</h2>
          <p className="mt-2 text-sm text-ws-muted">
            {tx("Report a hire from a forwarded candidate once you make an offer.")}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ws-fg">{tx("Hiring records")}</h2>
              <p className="mt-1 text-sm leading-6 text-ws-muted">{tx("Review candidate details, offered salaries, and commission status.")}</p>
            </div>
            <span className="rounded-full border border-ws-line bg-ws-card px-3 py-1.5 text-xs font-medium text-ws-muted">
              {tx("Page ")}{page + 1} {tx(" of ")}{totalPages}
            </span>
          </div>
          <div className="space-y-4" aria-busy={query.isFetching}>
            {hires.map((hire) => (
              <HireRow key={hire.id} hire={hire} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-ws-line pt-5 sm:justify-end">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0 || query.isFetching}
                className="h-11 rounded-xl border border-ws-line bg-ws-card px-4 text-sm font-semibold text-ws-fg transition-colors hover:bg-ws-card-hover focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40"
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
                disabled={page >= totalPages - 1 || query.isFetching}
                className="h-11 rounded-xl border border-ws-line bg-ws-card px-4 text-sm font-semibold text-ws-fg transition-colors hover:bg-ws-card-hover focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40"
              >
                {tx("Next")}</button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function HireRow({ hire }: { hire: HiringRecordResponse }) {
  const tx = useWorkspaceTranslation();
  const status = statusInfo(hire.status);

  return (
    <article className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-5 rounded-2xl border border-ws-line bg-ws-card p-4 [overflow-wrap:anywhere] sm:gap-x-4 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_200px] lg:items-center">
      <span className={`flex size-11 items-center justify-center rounded-xl sm:size-12 ${status.className}`}>
        <status.icon aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <h3 className="text-base font-semibold leading-6 text-ws-fg sm:text-lg">{hire.jobTitle}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
          >
            {tx(status.label)}
          </span>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 sm:gap-5">
          <div>
            <dt className="text-xs text-ws-muted">{tx("Candidate")}</dt>
            <dd className="mt-1 font-medium leading-6 text-ws-fg">{hire.candidateLabel || tx("Candidate")}</dd>
          </div>
          <div>
            <dt className="text-xs text-ws-muted">{tx("Offered salary")}</dt>
            <dd className="mt-1 font-medium leading-6 text-ws-fg">{formatMoney(hire.offeredSalary, hire.salaryCurrency)}</dd>
          </div>
        </dl>
        {hire.reviewNote ? (
          <div className="mt-4 rounded-xl bg-ws-panel p-3 text-sm leading-6 text-ws-muted">
            <p className="text-xs font-semibold text-ws-fg">{tx("Review note")}</p>
            <p className="mt-1 whitespace-pre-line">{hire.reviewNote}</p>
          </div>
        ) : null}
      </div>

      {/*
        * The commission only exists once a moderator confirms, so an unconfirmed
        * hire deliberately shows no figure rather than an estimate the recruiter
        * might treat as owed.
        */}
      <div className="col-span-2 min-w-0 border-t border-ws-line pt-4 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <p className="mb-2 text-xs font-medium text-ws-muted">{tx("Commission")}</p>
        {hire.commission ? (
          <>
            <p className="text-xl font-semibold tabular-nums text-ws-fg">
              {formatMoney(
                hire.commission.commissionAmount,
                hire.commission.currency,
              )}
            </p>
            <p className="mt-1 text-xs leading-5 text-ws-muted">
              {hire.commission.commissionRate}{tx("% commission")}</p>
          </>
        ) : (
          <p className="text-sm text-ws-muted">{hire.status === "REPORTED" ? tx("Awaiting review") : tx("Not available")}</p>
        )}
      </div>
    </article>
  );
}

function statusInfo(status: HiringRecordStatus) {
  if (status === "CONFIRMED") {
    return {
      label: "Confirmed",
      className: "bg-chip-soft text-chip-soft-fg",
      icon: BadgeCheck,
    };
  }
  if (status === "REJECTED") {
    return {
      label: "Rejected",
      className: "bg-chip-alert text-chip-alert-fg",
      icon: XCircle,
    };
  }
  return {
    label: "Awaiting review",
    className: "bg-chip-quiet text-chip-quiet-fg",
    icon: Clock3,
  };
}
