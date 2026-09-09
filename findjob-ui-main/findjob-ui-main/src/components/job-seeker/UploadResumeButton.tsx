"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { useUploadOwnResumeMutation } from "@/services/jobSeekerApi";

const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Brings an existing resume file onto the platform.
 *
 * <p>The file is stored as supplied and never parsed — the title comes from the
 * filename rather than from anything read out of the document, which is exactly
 * the scope limit the backend enforces too.
 */
export function UploadResumeButton() {
  const tx = useWorkspaceTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadResume, { isLoading }] = useUploadOwnResumeMutation();
  const [dragging, setDragging] = useState(false);

  async function send(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error(tx("Upload a PDF or a DOCX file."));
      return;
    }

    // Filename minus its extension, so "Sokha CV.pdf" becomes "Sokha CV".
    const title = file.name.replace(/\.[^.]+$/, "").trim() || "My resume";

    try {
      await uploadResume({ title, file }).unwrap();
      toast.success(tx("Resume uploaded."));
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Could not upload the file.")));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && !isLoading) void send(file);
        }}
        disabled={isLoading}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel disabled:opacity-60 ${
          dragging
            ? "border-chip-soft-fg bg-chip-soft text-chip-soft-fg"
            : "border-ws-line bg-ws-panel text-ws-fg hover:border-primary hover:text-primary"
        }`}
      >
        {isLoading ? (
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <Upload aria-hidden="true" className="size-5" />
        )}
        {tx("Upload existing")}</button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void send(file);
          // Reset so choosing the same file twice still fires a change event.
          event.target.value = "";
        }}
      />
    </>
  );
}
