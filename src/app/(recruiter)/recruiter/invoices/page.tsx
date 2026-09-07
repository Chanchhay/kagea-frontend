"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { useState } from "react";
import { ChevronRight, ReceiptText } from "lucide-react";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { InvoiceStatusChip } from "@/components/finance/InvoiceStatusChip";
import { formatMoney } from "@/lib/money";
import { useGetMyInvoicesQuery } from "@/services/financeApi";

export default function InvoicesPage() {
  const tx = useWorkspaceTranslation();
  const [page, setPage] = useState(0);
  const query = useGetMyInvoicesQuery({ page });

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message={tx("Unable to load invoices.")} />;

  const invoices = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title={tx("Invoices")}
        description={tx("Placement commissions billed to your company.")}
      />

      {invoices.length === 0 ? (
        <div className="rounded-[24px] bg-ws-card px-6 py-16 text-center">
          <ReceiptText className="mx-auto size-10 text-ws-faint" />
          <h2 className="mt-4 font-semibold text-ws-fg">{tx("No invoices")}</h2>
          <p className="mt-2 text-sm text-ws-muted">
            {tx("Invoices appear here once a hire has been confirmed and billed.")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/recruiter/invoices/${invoice.id}`}
                className="grid gap-4 rounded-[20px] bg-ws-card p-5 transition hover:bg-ws-card-hover sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ws-fg">
                      {invoice.invoiceNo}
                    </span>
                    <InvoiceStatusChip status={invoice.status} />
                  </div>
                  <p className="mt-1 text-xs text-ws-muted">
                    {invoice.items.length}{" "}
                    {invoice.items.length === 1 ? tx("placement") : tx("placements")} {tx(" · due ")}{formatDate(invoice.dueAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-ws-fg">
                    {formatMoney(invoice.totalAmount, invoice.currency)}
                  </p>
                  {invoice.outstandingAmount > 0 ? (
                    <p className="text-[18px] text-ws-faint">
                      {formatMoney(invoice.outstandingAmount, invoice.currency)}{" "}
                      {tx("outstanding")}</p>
                  ) : null}
                </div>

                <ChevronRight className="hidden size-5 text-ws-faint sm:block" />
              </Link>
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
                {tx("Previous")}</button>
              <span className="text-xs text-ws-muted">
                {tx("Page ")}{page + 1} {tx(" of ")}{totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={page >= totalPages - 1}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                {tx("Next")}</button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}
