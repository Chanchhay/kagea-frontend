"use client";

import { useState, type FormEvent } from "react";
import { FileText, Loader2, Save } from "lucide-react";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { uploadFile } from "@/lib/upload-file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResumeFormProps = {
  initialTitle?: string;
  initialFileUrl?: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: { title: string; resumeFileUrl: string }) => Promise<void>;
  onCancel?: () => void;
};

/**
 * The upload path: name a resume and attach the PDF the user already has.
 * Resumes written from scratch go through `ResumeBuilder` instead.
 */
export function ResumeForm({ initialTitle = "", initialFileUrl = "", submitLabel, isSubmitting, onSubmit, onCancel }: ResumeFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [resumeFileUrl, setResumeFileUrl] = useState(initialFileUrl);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Give your resume a name so you can find it later.");
      return;
    }
    if (!resumeFile && !resumeFileUrl) {
      setError("Choose a PDF resume before continuing.");
      return;
    }
    setError(null);

    // The staged file travels now, on save — not when it was picked.
    let fileUrl = resumeFileUrl;
    if (resumeFile) {
      try {
        setIsUploading(true);
        fileUrl = await uploadFile(resumeFile, "private");
        setResumeFileUrl(fileUrl);
        setResumeFile(null);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    await onSubmit({ title: cleanTitle, resumeFileUrl: fileUrl });
  }

  const busy = Boolean(isSubmitting) || isUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <section className="rounded-2xl border border-ws-line bg-ws-panel p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg">
            <FileText className="size-4.5" />
          </span>
          <div>
            <h3 className="font-semibold text-ws-fg">Resume document</h3>
            <p className="mt-0.5 text-xs leading-5 text-ws-muted">Name this version and attach the PDF employers will receive.</p>
          </div>
        </div>

        <div>
          <label htmlFor="resume-title" className="mb-2 block text-sm font-semibold text-ws-fg">
            Resume name
          </label>
          <div className="relative">
            <FileText aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ws-faint" />
            <Input
              id="resume-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Product Designer — 2026"
              className="h-12 rounded-xl border-ws-line bg-ws-card pl-10 text-ws-fg"
              autoFocus
            />
          </div>
          <p className="mt-2 text-xs text-ws-muted">Use a clear name tailored to the roles you are applying for.</p>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-ws-fg">Resume file</p>
          <FileDropzone
            value={resumeFileUrl}
            file={resumeFile}
            onFileChange={setResumeFile}
            onClear={() => setResumeFileUrl("")}
            accept=".pdf,application/pdf"
            hint="PDF only, up to 5 MB. Your file stays private until you share it."
          />
        </div>
      </section>

      {error ? <p role="alert" className="text-sm font-medium text-destructive">{error}</p> : null}

      <div className="flex flex-col-reverse gap-3 border-t border-ws-line pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={busy} className="h-11 rounded-xl px-5">
          {busy ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
          {isUploading ? "Uploading…" : isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
