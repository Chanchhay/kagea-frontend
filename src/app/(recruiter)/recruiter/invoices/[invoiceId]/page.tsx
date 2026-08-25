"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InvoiceStatusChip } from "@/components/finance/InvoiceStatusChip";
import { PageIntro } from "@/components/shared/ApiCards";
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
    <div className="mx-auto max-w-4xl">
      <Link
        href="/recruiter/invoices"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ws-muted transition-colors hover:text-ws-fg"
      >
        <ArrowLeft className="size-4" /> All invoices
      </Link>

      <PageIntro
        title={invoice.invoiceNo}
        description="Placement commissions billed to your company."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[20px] bg-ws-card p-5">
        <InvoiceStatusChip status={invoice.status} />
        <span className="text-sm text-ws-muted">
          Issued {formatDate(invoice.issuedAt)} · due {formatDate(invoice.dueAt)}
        </span>
        <span className="ml-auto text-lg font-semibold text-ws-fg">
          {formatMoney(invoice.totalAmount, invoice.currency)}
        </span>
      </div>

      <section className="mb-4 rounded-[20px] bg-ws-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-ws-fg">Lines</h2>
        <ul className="space-y-2">
          {invoice.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-ws-panel px-4 py-3"
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

        <dl className="mt-4 space-y-1.5 text-sm">
          <Row label="Subtotal" value={formatMoney(invoice.subtotalAmount, invoice.currency)} />
          <Row label="Tax" value={formatMoney(invoice.taxAmount, invoice.currency)} />
          <Row label="Total" value={formatMoney(invoice.totalAmount, invoice.currency)} strong />
          <Row label="Paid" value={formatMoney(invoice.paidAmount, invoice.currency)} />
          <Row
            label="Outstanding"
            value={formatMoney(invoice.outstandingAmount, invoice.currency)}
            strong
          />
        </dl>
      </section>

      {/*
        * Payments are recorded by the platform's finance team, not captured
        * here — nothing in this product takes money. The list is a receipt.
        */}
      {invoice.payments && invoice.payments.length > 0 ? (
        <section className="rounded-[20px] bg-ws-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-ws-fg">Payments</h2>
          <ul className="space-y-2">
            {invoice.payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-ws-panel px-4 py-3 text-sm"
              >
                <span className="text-ws-muted">
                  {formatDate(payment.paidAt)}
                  {payment.paymentMethod ? ` · ${payment.paymentMethod}` : ""}
                  {payment.transactionReference
                    ? ` · ${payment.transactionReference}`
                    : ""}
                </span>
                <span className="font-semibold text-ws-fg">
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
