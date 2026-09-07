"use client";

import { useState } from "react";
import { HandCoins, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-error";
import { useReportHireMutation } from "@/services/financeApi";

/**
 * Reports that this forwarded candidate was hired.
 *
 * <p>Reporting is not confirming. A moderator reviews the claim, and only their
 * confirmation creates the commission — so the copy here says what will happen
 * rather than implying the recruiter has just billed themselves.
 */
export function ReportHireDialog({
  applicationId,
  alreadyReported,
}: {
  applicationId: string;
  alreadyReported?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [note, setNote] = useState("");
  const [reportHire, { isLoading }] = useReportHireMutation();

  if (alreadyReported) {
    return (
      <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">
        Hire reported
      </span>
    );
  }

  async function submit() {
    const offeredSalary = Number(salary);

    if (!Number.isFinite(offeredSalary) || offeredSalary <= 0) {
      toast.error("Enter the offered salary.");
      return;
    }

    try {
      await reportHire({
        applicationId,
        body: {
          offeredSalary,
          salaryCurrency: currency.trim().toUpperCase() || undefined,
          note: note.trim() || undefined,
        },
      }).unwrap();

      toast.success("Hire reported. A moderator will confirm it.");
      setOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to report the hire."));
    }
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <HandCoins aria-hidden="true" /> Report hire
      </Button>
    );
  }

  return (
    <Card className="border border-border">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <HandCoins aria-hidden="true" className="size-5 text-brand" />
          <h2 className="text-sm font-semibold text-heading">Report hire</h2>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" /> Cancel
          </Button>
        </div>

        <p className="text-sm text-body">
          A moderator reviews this before anything is billed. The placement
          commission is calculated from the salary you enter.
        </p>

        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-body">
              Offered salary
            </span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-body">Currency</span>
            <input
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              maxLength={10}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-body">
            Note (optional)
          </span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={2000}
            className="resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm text-heading outline-none"
          />
        </label>

        <Button disabled={isLoading} onClick={() => void submit()}>
          {isLoading ? "Reporting…" : "Report hire"}
        </Button>
      </CardContent>
    </Card>
  );
}
