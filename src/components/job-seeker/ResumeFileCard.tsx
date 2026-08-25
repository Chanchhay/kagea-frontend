"use client";

import { useState } from "react";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { ResumeResponse } from "@/contracts";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGenerateResumePdfMutation } from "@/services/jobSeekerApi";

/**
 * Generating and downloading the resume's PDF.
 *
 * <p>Generation is a deliberate action rather than a side effect of saving:
 * rendering costs real work, and a candidate mid-edit should not produce a new
 * document on every keystroke. The consequence is that the stored PDF can lag
 * the editor, which is why the card says when it was last generated.
 */
export function ResumeFileCard({ resume }: { resume: ResumeResponse }) {
  const [generate, { isLoading }] = useGenerateResumePdfMutation();
  const [downloading, setDownloading] = useState(false);

  const uploaded = resume.sourceType === "USER_UPLOAD";

  async function runGenerate() {
    try {
      await generate(resume.id).unwrap();
      toast.success("PDF generated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not generate the PDF."));
    }
  }

  /*
   * Fetched rather than linked. The endpoint answers with the bytes and a
   * Content-Disposition header, and going through fetch keeps the gateway's
   * session cookie on the request while letting a failure surface as a toast
   * instead of a blank tab.
   */
  async function runDownload() {
    setDownloading(true);

    try {
      const response = await fetch(`/api/v1/job-seeker/resumes/${resume.id}/download`);
      if (!response.ok) throw new Error(String(response.status));

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.title || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not download the file.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="rounded-[22px] bg-ws-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ws-fg">Document</h2>
        <span className="rounded-full bg-chip-quiet px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-chip-quiet-fg">
          {uploaded ? "uploaded" : "generated"}
        </span>
      </div>

      <p className="mt-3 text-sm text-ws-muted">
        {uploaded
          ? "You uploaded this file. It is stored exactly as supplied and is never edited or parsed."
          : resume.hasFile
            ? `Last generated ${formatWhen(resume.generatedAt)}. Regenerate after editing to refresh the PDF.`
            : "No PDF yet. Generate one so recruiters can download your resume."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {uploaded ? null : (
          <Button variant="outline" disabled={isLoading} onClick={() => void runGenerate()}>
            {isLoading ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : resume.hasFile ? (
              <RefreshCw aria-hidden="true" />
            ) : (
              <FileText aria-hidden="true" />
            )}
            {resume.hasFile ? "Regenerate PDF" : "Generate PDF"}
          </Button>
        )}

        {resume.hasFile ? (
          <Button disabled={downloading} onClick={() => void runDownload()}>
            {downloading ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <Download aria-hidden="true" />
            )}
            Download
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function formatWhen(value: string | null) {
  if (!value) return "recently";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "recently"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
}
