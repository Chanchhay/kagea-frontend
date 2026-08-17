"use client";

import { useRef, useState, type DragEvent } from "react";
import { FileCheck2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFile } from "@/lib/upload-file";

type FileDropzoneProps = {
  /** URL of the file already saved on the record, if any. */
  value?: string;
  /** The staged file, held by the parent until it saves. */
  file?: File | null;
  /**
   * Called when the user picks a file, or clears the field. Nothing is sent to
   * the server here — the parent uploads on submit via `uploadFile`.
   */
  onFileChange: (file: File | null) => void;
  /** Called when the user clears an already-saved file. */
  onClear?: () => void;
  accept?: string;
  hint?: string;
  className?: string;
};

const DEFAULT_ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.svg";

/**
 * Stages a file for upload. Selection is local: the bytes travel only when the
 * surrounding form is saved, so abandoning an edit leaves no orphaned object in
 * the bucket.
 */
export function FileDropzone({
  value,
  file = null,
  onFileChange,
  onClear,
  accept = DEFAULT_ACCEPT,
  hint = "PDF, PNG, JPG, WebP or SVG up to 5 MB.",
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = (picked: File) => {
    // Checked here so the user is told at pick time, not after pressing save.
    const problem = validateFile(picked);
    setError(problem);
    onFileChange(problem ? null : picked);
    if (problem && inputRef.current) inputRef.current.value = "";
  };

  const clear = () => {
    setError(null);
    onFileChange(null);
    onClear?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasFile = Boolean(file ?? value);
  const label = file
    ? file.name
    : value
      ? "File saved"
      : "Drag and drop, or click to browse";

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose a file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(false);
          const dropped = event.dataTransfer.files?.[0];
          if (dropped) select(dropped);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          isDragging
            ? "border-brand bg-brand-tint"
            : "border-border bg-surface-muted/40 hover:border-brand/40",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-surface text-brand shadow-sm">
          {hasFile ? (
            <FileCheck2 aria-hidden="true" className="size-5" />
          ) : (
            <UploadCloud aria-hidden="true" className="size-5" />
          )}
        </span>
        <p className="mt-3 text-sm font-medium text-heading">{label}</p>
        <p className="mt-1 text-xs text-body">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            const picked = event.target.files?.[0];
            if (picked) select(picked);
          }}
        />
      </div>

      {file ? (
        <p className="mt-2 text-xs text-body">
          Selected. It uploads when you save.
        </p>
      ) : null}

      {hasFile ? (
        <div className="mt-2 flex justify-end text-xs">
          <button
            type="button"
            onClick={clear}
            className="inline-flex shrink-0 items-center gap-1 font-medium text-body hover:text-destructive"
          >
            <X aria-hidden="true" className="size-3.5" />
            Remove
          </button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
