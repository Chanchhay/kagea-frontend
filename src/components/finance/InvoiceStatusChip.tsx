import type { InvoiceStatus } from "@/contracts";

/** One place deciding how an invoice status reads across the recruiter screens. */
export function InvoiceStatusChip({ status }: { status: InvoiceStatus }) {
  const tone =
    status === "PAID"
      ? "bg-chip-soft text-chip-soft-fg"
      : status === "CANCELLED" || status === "OVERDUE"
        ? "bg-chip-alert text-chip-alert-fg"
        : "bg-chip-quiet text-chip-quiet-fg";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${tone}`}
    >
      {status.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
