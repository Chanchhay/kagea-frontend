"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  ReceiptText,
} from "lucide-react";
import { InvoiceStatusChip } from "@/components/finance/InvoiceStatusChip";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatMoney } from "@/lib/money";
import { useGetMyInvoiceQuery } from "@/services/financeApi";

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const query = useGetMyInvoiceQuery(Number(invoiceId));

  if (query.isLoading) return <LoadingState rows={6} />;
  if (query.isError || !query.data) {
    return <ErrorState message="Unable to load this invoice." />;
  }

  const invoice = query.data;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/recruiter/invoices"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ws-muted transition-colors hover:text-ws-fg"
      >
        <ArrowLeft className="size-4" /> All invoices
      </Link>

      <section className="relative mb-5 overflow-hidden rounded-[24px] bg-ws-card p-6 sm:p-8">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-brand" />
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ws-muted">
              <FileText className="size-4 text-brand" /> Invoice detail
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ws-fg sm:text-3xl">
              {invoice.invoiceNo}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-ws-muted">
              Placement commissions billed to your company.
            </p>
          </div>
          <div className="flex items-center gap-3 sm:text-right">
            <InvoiceStatusChip status={invoice.status} />
            <div>
              <p className="text-xs text-ws-muted">Invoice total</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-ws-fg">
                {formatMoney(invoice.totalAmount, invoice.currency)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-3 border-t border-ws-line pt-5 sm:grid-cols-2">
          <Meta
            icon={<CalendarDays className="size-4" />}
            label="Issued"
            value={formatDate(invoice.issuedAt)}
          />
          <Meta
            icon={<CalendarDays className="size-4" />}
            label="Due date"
            value={formatDate(invoice.dueAt)}
          />
        </div>
      </section>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Summary
          label="Subtotal"
          value={formatMoney(invoice.subtotalAmount, invoice.currency)}
        />
        <Summary
          label="Paid to date"
          value={formatMoney(invoice.paidAmount, invoice.currency)}
          icon={<CheckCircle2 className="size-4" />}
        />
        <Summary
          label="Outstanding"
          value={formatMoney(invoice.outstandingAmount, invoice.currency)}
          accent
          icon={<CircleDollarSign className="size-4" />}
        />
      </div>

      <section className="mb-5 rounded-[24px] bg-ws-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ws-fg">
              Invoice lines
            </h2>
            <p className="mt-1 text-xs text-ws-muted">
              {invoice.items.length} placement
              {invoice.items.length === 1 ? "" : "s"} included
            </p>
          </div>
          <ReceiptText className="size-5 text-ws-faint" />
        </div>
        <ul className="divide-y divide-ws-line">
          {invoice.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-ws-fg">
                {item.description}
              </span>
              <span className="text-sm font-semibold text-ws-fg">
                {formatMoney(item.totalAmount, invoice.currency)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-ws-line pt-5 text-sm">
          <Row
            label="Subtotal"
            value={formatMoney(invoice.subtotalAmount, invoice.currency)}
          />
          <Row
            label="Tax"
            value={formatMoney(invoice.taxAmount, invoice.currency)}
          />
          <Row
            label="Total"
            value={formatMoney(invoice.totalAmount, invoice.currency)}
            strong
          />
        </dl>
      </section>

      {/*
       * Payments are recorded by the platform's finance team, not captured
       * here — nothing in this product takes money. The list is a receipt.
       */}
      {invoice.payments && invoice.payments.length > 0 ? (
        <section className="rounded-[24px] bg-ws-card p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-ws-fg">
                Payment history
              </h2>
              <p className="mt-1 text-xs text-ws-muted">
                Recorded payments for this invoice
              </p>
            </div>
            <CheckCircle2 className="size-5 text-brand" />
          </div>
          <ul className="divide-y divide-ws-line">
            {invoice.payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-4 py-4 text-sm first:pt-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-ws-fg">
                    {formatDate(payment.paidAt)}
                  </span>
                  <span className="mt-1 block truncate text-xs text-ws-muted">
                    {payment.paymentMethod ?? "Payment recorded"}
                    {payment.transactionReference
                      ? ` · ${payment.transactionReference}`
                      : ""}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-ws-fg">
                  {formatMoney(payment.amount, payment.currency)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-ws-panel text-ws-muted">
        {icon}
      </span>
      <div>
        <p className="text-xs text-ws-muted">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-ws-fg">{value}</p>
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[20px] bg-ws-card p-4 ${accent ? "ring-1 ring-brand/30" : ""}`}
    >
      <div className="flex items-center gap-2 text-xs text-ws-muted">
        {icon}
        {label}
      </div>
      <p
        className={`mt-2 text-lg font-semibold ${accent ? "text-brand" : "text-ws-fg"}`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-ws-muted">{label}</dt>
      <dd className={strong ? "font-semibold text-ws-fg" : "text-ws-fg"}>
        {value}
      </dd>
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
