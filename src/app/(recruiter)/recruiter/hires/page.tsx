"use client";

import { useState } from "react";
import { BadgeCheck, Clock3, HandCoins, XCircle } from "lucide-react";
import type { HiringRecordResponse, HiringRecordStatus } from "@/contracts";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatMoney } from "@/lib/money";
import { useGetMyHiringRecordsQuery } from "@/services/financeApi";

export default function HiresPage() {
  const [page, setPage] = useState(0);
  const query = useGetMyHiringRecordsQuery({ page });

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message="Unable to load hires." />;

  const hires = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Hires"
        description="Candidates you reported as hired, and where each one stands."
      />

      {hires.length === 0 ? (
        <div className="rounded-[24px] bg-ws-card px-6 py-16 text-center">
          <HandCoins className="mx-auto size-10 text-ws-faint" />
          <h2 className="mt-4 font-semibold text-ws-fg">No hires reported</h2>
          <p className="mt-2 text-sm text-ws-muted">
            Report a hire from a forwarded candidate once you make an offer.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {hires.map((hire) => (
              <HireRow key={hire.id} hire={hire} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-ws-muted">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={page >= totalPages - 1}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function HireRow({ hire }: { hire: HiringRecordResponse }) {
  const status = statusInfo(hire.status);

  return (
    <div className="grid gap-4 rounded-[20px] bg-ws-card p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-ws-panel text-primary shadow-sm">
        <status.icon className="size-5" />
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate font-semibold text-ws-fg">{hire.jobTitle}</h2>
          <span
            className={`rounded-full px-2.5 py-1 text-[18px] font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ws-muted">
          <span>{hire.candidateLabel || "Candidate"}</span>
          <span>
            Offered {formatMoney(hire.offeredSalary, hire.salaryCurrency)}
          </span>
          {hire.reviewNote ? <span>{hire.reviewNote}</span> : null}
        </div>
      </div>

      {/*
        * The commission only exists once a moderator confirms, so an unconfirmed
        * hire deliberately shows no figure rather than an estimate the recruiter
        * might treat as owed.
        */}
      <div className="text-right">
        {hire.commission ? (
          <>
            <p className="text-sm font-semibold text-ws-fg">
              {formatMoney(
                hire.commission.commissionAmount,
                hire.commission.currency,
              )}
            </p>
            <p className="text-[18px] text-ws-faint">
              {hire.commission.commissionRate}% commission
            </p>
          </>
        ) : (
          <p className="text-[18px] text-ws-faint">Awaiting review</p>
        )}
      </div>
    </div>
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
