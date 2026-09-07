"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useRef, useState, type DragEvent } from "react";
import { FileText, Loader2, Sparkles, UploadCloud } from "lucide-react";
import type { JobDocumentParseResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-file";
import { cn } from "@/lib/utils";
import { useParseJobDocumentMutation } from "@/services/recruiterApi";

type JobDocumentImportProps = {
  /** Receives the extracted fields; the form decides what to fill in. */
  onParsed: (result: JobDocumentParseResponse) => void;
  disabled?: boolean;
};

/** Checked before the request so the user hears about it without a round trip. */
function validatePdf(file: File): string | null {
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be 5 MB or smaller.";
  if (file.type !== "application/pdf") return "Only PDF files can be parsed.";
  return null;
}

/**
 * Starts a job post from an existing PDF job description.
 *
 * Unlike {@link FileDropzone}, which stages a file until its form is saved,
 * picking here uploads immediately — reading the document *is* the point. The
 * PDF is stored privately as a side effect, so a recruiter who abandons the
 * form afterwards leaves one unreferenced object in the bucket.
 */
export function JobDocumentImport({
  onParsed,
  disabled,
}: JobDocumentImportProps) {
  const tx = useWorkspaceTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseJobDocument, parsing] = useParseJobDocumentMutation();

  const isBusy = parsing.isLoading || Boolean(disabled);

  const parse = async (file: File) => {
    // Clearing the input lets the same file be picked again after a failure.
    if (inputRef.current) inputRef.current.value = "";

    const problem = validatePdf(file);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setParsed(false);
    setFileName(file.name);

    try {
      onParsed(await parseJobDocument(file).unwrap());
      setParsed(true);
    } catch (cause) {
      setFileName(null);
      setError(
        getApiErrorMessage(cause, tx("That job description could not be read.")),
      );
    }
  };

  return (
    <section className="rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-xs">
      <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-stretch">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Sparkles aria-hidden="true" className="size-4" />
        </span>
          <div>
            <h2 className="font-semibold text-ws-fg">{tx("Start from a PDF")}</h2>
            <p className="mt-1 text-sm leading-6 text-ws-muted">
              {tx("Upload the job description you already have and we'll fill in the form below. Check every field before you publish.")}
            </p>
          </div>
        </div>

        <div
          role="button"
          tabIndex={isBusy ? -1 : 0}
          aria-label={tx("Choose a PDF job description")}
          aria-busy={parsing.isLoading}
          onClick={() => {
            if (!isBusy) inputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (isBusy) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isBusy) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);
            if (isBusy) return;
            const dropped = event.dataTransfer.files?.[0];
            if (dropped) void parse(dropped);
          }}
          className={cn(
            "flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-colors",
            isBusy
              ? "cursor-not-allowed border-ws-line opacity-70"
              : "cursor-pointer",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-ws-line bg-ws-card hover:border-primary/40",
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {parsing.isLoading ? (
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
            ) : fileName ? (
              <FileText aria-hidden="true" className="size-5" />
            ) : (
              <UploadCloud aria-hidden="true" className="size-5" />
            )}
          </span>
          <p className="mt-3 text-sm font-medium text-ws-fg">
            {parsing.isLoading
              ? tx("Reading your job description…")
              : (fileName ?? tx("Drag and drop a PDF, or click to browse"))}
          </p>
          <p className="mt-1 text-xs text-ws-muted">
            {tx("PDF up to 5 MB. Scanned or image-only documents can't be read.")}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={isBusy}
            onChange={(event) => {
              const picked = event.target.files?.[0];
              if (picked) void parse(picked);
            }}
          />
        </div>
      </div>

      {parsed ? (
        <p className="mt-3 text-xs font-medium text-heading">
          {tx("Filled in the fields we could read. Review them before publishing.")}</p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
