"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Downloads a published resume.
 *
 * <p>The endpoint streams the file rather than returning a link, so the
 * candidate's publication setting is checked on this request rather than once
 * when a URL was minted. That means fetching the bytes here and handing the
 * browser a blob, instead of opening a URL in a new tab.
 */
export function ResumeDownloadButton({
  slug,
  resumeId,
  title,
}: {
  slug: string;
  resumeId: number;
  title: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    setDownloading(true);

    try {
      const response = await fetch(
        `/api/v1/recruiter/talent/${encodeURIComponent(slug)}/resumes/${resumeId}/download`,
      );

      if (!response.ok) throw new Error(String(response.status));

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to download this resume.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 rounded-lg px-4"
      aria-label={`Download ${title}`}
      disabled={downloading}
      onClick={onDownload}
    >
      <Download aria-hidden="true" className="size-4" />
      {downloading ? "Preparing…" : "Download"}
    </Button>
  );
}
