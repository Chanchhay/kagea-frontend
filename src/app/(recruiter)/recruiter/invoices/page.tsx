"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import Link from "next/link";
import { useState, useMemo, type ReactNode } from "react";
import { ArrowUpRight, CheckCircle2, DollarSign, ReceiptText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { InvoiceStatusChip } from "@/components/finance/InvoiceStatusChip";
import { formatMoney } from "@/lib/money";
import { useGetMyInvoicesQuery } from "@/services/financeApi";

const COLUMNS = [
  { key: "invoiceNo", label: "Invoice #", className: "w-[22%]" },
  { key: "placements", label: "Placements", className: "w-[18%]" },
  { key: "dueAt", label: "Due Date", className: "w-[18%]" },
  { key: "total", label: "Total Amount", className: "w-[18%]" },
  { key: "outstanding", label: "Outstanding", className: "w-[14%]" },
  { key: "status", label: "Status", className: "w-[10%]" },
  { key: "actions", label: "", className: "w-[8%] text-right" },
];

export default function InvoicesPage() {
  const tx = useWorkspaceTranslation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const query = useGetMyInvoicesQuery({ page, size });

  const invoices = useMemo(() => query.data?.content ?? [], [query.data?.content]);
  const totalElements = query.data?.totalElements ?? invoices.length;

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return invoices;
    return invoices.filter((inv) =>
      inv.invoiceNo.toLowerCase().includes(term),
    );
  }, [invoices, search]);

  if (query.isLoading) return <LoadingState rows={6} />;
  if (query.isError) return <ErrorState message={tx("Unable to load invoices.")} />;

  const totalOutstanding = invoices.reduce(
    (sum, inv) => sum + (inv.outstandingAmount || 0),
    0,
  );
  const paidCount = invoices.filter((inv) => inv.status === "PAID").length;
  const reset = <T,>(setter: (val: T) => void) => (val: T) => {
    setter(val);
    setPage(0);
  };

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] flex-col gap-4">
      {/* Metric Tiles */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<ReceiptText aria-hidden="true" className="size-4.5" />}
          label={tx("Total invoices")}
          value={totalElements}
        />
        <MetricCard
          icon={<DollarSign aria-hidden="true" className="size-4.5" />}
          label={tx("Total outstanding")}
          value={formatMoney(totalOutstanding, invoices[0]?.currency ?? "USD")}
          accent
        />
        <MetricCard
          icon={<CheckCircle2 aria-hidden="true" className="size-4.5" />}
          label={tx("Paid invoices")}
          value={paidCount}
        />
      </div>

      {/* Main Console Table Panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-ws-fg">{tx("Invoices")}</h2>
            <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
              {totalElements}
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
              placeholder={tx("Search invoice #…")}
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-sm text-ws-faint"
                  >
                    {invoices.length === 0
                      ? tx("No invoices yet. Invoices appear here once a hire has been confirmed and billed.")
                      : tx("No invoices match your search.")}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const href = `/recruiter/invoices/${invoice.id}`;
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={href}
                          className="font-semibold text-ws-fg hover:underline"
                        >
                          {invoice.invoiceNo}
                        </Link>
                      </td>

                      <td className="px-4 py-3 text-sm text-ws-muted">
                        {invoice.items.length}{" "}
                        {invoice.items.length === 1
                          ? tx("placement")
                          : tx("placements")}
                      </td>

                      <td className="px-4 py-3 text-sm text-ws-muted">
                        {formatDate(invoice.dueAt)}
                      </td>

                      <td className="px-4 py-3 text-sm font-semibold tabular-nums text-ws-fg">
                        {formatMoney(invoice.totalAmount, invoice.currency)}
                      </td>

                      <td className="px-4 py-3 text-sm tabular-nums">
                        {invoice.outstandingAmount > 0 ? (
                          <span className="font-semibold text-destructive">
                            {formatMoney(
                              invoice.outstandingAmount,
                              invoice.currency,
                            )}
                          </span>
                        ) : (
                          <span className="text-ws-faint">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <InvoiceStatusChip status={invoice.status} />
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

        {query.data ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
            <PageSizeSelect
              value={size}
              onChange={reset(setSize)}
              id="invoices-page-size"
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
  icon: ReactNode;
  label: string;
  value: ReactNode;
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
        <p className="truncate text-xl font-bold tabular-nums text-ws-fg">
          {value}
        </p>
        <p className="truncate text-xs font-medium text-ws-muted">{label}</p>
      </div>
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
