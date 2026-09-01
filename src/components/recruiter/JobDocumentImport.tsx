"use client";

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
        getApiErrorMessage(cause, "That job description could not be read."),
      );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface-muted/40 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-brand shadow-sm">
          <Sparkles aria-hidden="true" className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-heading">
            Start from a PDF
          </h2>
          <p className="mt-1 text-xs text-body">
            Upload the job description you already have and we&apos;ll fill in
            the form below. Check every field before you publish.
          </p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={isBusy ? -1 : 0}
        aria-label="Choose a PDF job description"
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
          "mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
          isBusy
            ? "cursor-not-allowed border-border opacity-70"
            : "cursor-pointer",
          isDragging
            ? "border-brand bg-brand-tint"
            : "border-border bg-surface hover:border-brand/40",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-brand">
          {parsing.isLoading ? (
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          ) : fileName ? (
            <FileText aria-hidden="true" className="size-5" />
          ) : (
            <UploadCloud aria-hidden="true" className="size-5" />
          )}
        </span>
        <p className="mt-3 text-sm font-medium text-heading">
          {parsing.isLoading
            ? "Reading your job description…"
            : (fileName ?? "Drag and drop a PDF, or click to browse")}
        </p>
        <p className="mt-1 text-xs text-body">
          PDF up to 5 MB. Scanned or image-only documents can&apos;t be read.
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

      {parsed ? (
        <p className="mt-3 text-xs font-medium text-heading">
          Filled in the fields we could read. Review them before publishing.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
