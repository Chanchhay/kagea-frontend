"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api-error";
import { useApplyToJobMutation, useGetResumesQuery } from "@/services/jobSeekerApi";

type ApplyJobDialogProps = {
  jobId: string;
  jobTitle: string;
};

export function ApplyJobDialog({ jobId, jobTitle }: ApplyJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeId, setResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [apply, application] = useApplyToJobMutation();
  const { data: resumes } = useGetResumesQuery(undefined, { skip: !open });
  const defaultResume = resumes?.find((r) => r.isDefault) ?? resumes?.[0];
  const selectedResumeId = resumeId || (defaultResume ? String(defaultResume.id) : "");
  const selectedResume = resumes?.find((r) => String(r.id) === selectedResumeId);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await apply({
        jobId,
        body: {
          resumeId: selectedResumeId || undefined,
          coverLetter: coverLetter || undefined,
        },
      }).unwrap();
      toast.success("Application submitted.");
      setOpen(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to submit the application. Sign in as a job seeker and try again.",
        ),
      );
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Apply
      </Button>

      {open ? (
        <div
          aria-modal="true"
          role="dialog"
          aria-labelledby="apply-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-dropdown)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="apply-dialog-title" className="text-lg font-semibold text-heading">
                  Apply for this position
                </h2>
                <p className="mt-1 text-sm text-body">{jobTitle}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close application dialog"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={submit}>
              {resumes && resumes.length > 0 ? (
                <label className="block text-sm font-medium text-heading">
                  Resume
                  <Select value={selectedResumeId || null} onValueChange={(val) => setResumeId(val ?? "")}>
                    <SelectTrigger className="mt-1 w-full bg-surface border-border">
                      <SelectValue placeholder="Select a resume">
                        {selectedResume ? selectedResume.title : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.title || "Resume"}{r.isDefault ? " (default)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              ) : null}
              <label className="block text-sm font-medium text-heading">
                Cover letter
                <Textarea
                  className="mt-1"
                  maxLength={5000}
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder="Optional cover letter"
                />
              </label>
              <Button type="submit" className="w-full" disabled={application.isLoading}>
                {application.isLoading ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
