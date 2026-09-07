"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { Bookmark, BookmarkCheck } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import {
  useRemoveFavoriteJobMutation,
  useSaveFavoriteJobMutation,
} from "@/services/jobSeekerApi";
import { cn } from "@/lib/utils";

type SaveJobButtonProps = {
  jobId: string;
  /**
   * The job's `isFavorite`, straight from the public job response: `null` when
   * the visitor is not a signed-in job seeker.
   */
  isFavorite: PublicJobResponse["isFavorite"];
  variant?: "icon" | "full";
  className?: string;
};

/**
 * Bookmark toggle for a public job.
 *
 * <p>Renders nothing when `isFavorite` is `null`. That is the server telling us
 * the caller has no favorites to speak of — anonymous, or signed in as a
 * recruiter — so the component needs no session lookup of its own to decide
 * whether the control belongs on the page.
 */
export function SaveJobButton({
  jobId,
  isFavorite,
  variant = "icon",
  className,
}: SaveJobButtonProps) {
  const tx = useWorkspaceTranslation();
  const [saveJob, saveState] = useSaveFavoriteJobMutation();
  const [removeJob, removeState] = useRemoveFavoriteJobMutation();

  if (isFavorite === null || isFavorite === undefined) return null;

  const pending = saveState.isLoading || removeState.isLoading;
  const Icon = isFavorite ? BookmarkCheck : Bookmark;

  async function toggle() {
    try {
      if (isFavorite) {
        await removeJob(jobId).unwrap();
      } else {
        await saveJob(jobId).unwrap();
      }
    } catch {
      /*
       * The list re-reads from the server on the next invalidation, so a failed
       * toggle simply leaves the bookmark as it was. Nothing local to roll back.
       */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={isFavorite}
      aria-label={tx(isFavorite ? "Remove from saved jobs" : "Save this job")}
      title={tx(isFavorite ? "Remove from saved jobs" : "Save this job")}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border transition disabled:opacity-50",
        variant === "icon" ? "size-9" : "h-10 px-4 text-sm font-semibold",
        isFavorite
          ? "border-brand bg-brand-tint text-brand"
          : "border-border text-muted-fg hover:border-brand/40 hover:text-brand",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {variant === "full" ? (isFavorite ? "Saved" : "Save job") : null}
    </button>
  );
}
