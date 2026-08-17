"use client";

import Link from "next/link";
import { AlertTriangle, EyeOff, Globe2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import type { PublicationVisibility, ResumeResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { useGetJobSeekerProfileQuery, useUpdateResumePublicationMutation } from "@/services/jobSeekerApi";

const OPTIONS: { value: PublicationVisibility; label: string; icon: typeof Globe2; description: string }[] = [
  { value: "PUBLIC", label: "Public", icon: Globe2, description: "Recruiters browsing talent can open this resume." },
  { value: "PRIVATE", label: "Private", icon: Lock, description: "Only shared with companies you apply to." },
  { value: "HIDDEN", label: "Hidden", icon: EyeOff, description: "Kept out of every recruiter view." },
];

/**
 * Publishing a resume only reaches recruiters through the seeker's public
 * profile, so this also surfaces when that profile is still unpublished —
 * otherwise a resume can read as "Public" while nobody can actually reach it.
 */
export function ResumePublishCard({ resume }: { resume: ResumeResponse }) {
  const [updatePublication, { isLoading }] = useUpdateResumePublicationMutation();
  const profileQuery = useGetJobSeekerProfileQuery();
  const visibility = resume.visibility ?? "PRIVATE";
  const isPublic = visibility === "PUBLIC";
  const profileIsPublic = profileQuery.data?.profileVisibility === "PUBLIC";

  async function setVisibility(next: PublicationVisibility) {
    if (next === visibility) return;
    try {
      await updatePublication({ resumeId: resume.id, body: { visibility: next } }).unwrap();
      toast.success(
        next === "PUBLIC" ? "Resume published to your profile" : next === "PRIVATE" ? "Resume set to private" : "Resume hidden",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update this resume's visibility."));
    }
  }

  return (
    <section className="rounded-[22px] bg-ws-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ws-fg">Publishing</h2>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${isPublic ? "bg-chip-soft text-chip-soft-fg" : "bg-chip-quiet text-chip-quiet-fg"}`}>
          {visibility.toLowerCase()}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {OPTIONS.map((option) => {
          const active = option.value === visibility;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setVisibility(option.value)}
              disabled={isLoading}
              aria-pressed={active}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition disabled:opacity-60 ${
                active ? "border-primary bg-chip-soft" : "border-ws-line bg-ws-panel hover:bg-ws-card-hover"
              }`}
            >
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-ws-card text-ws-muted"}`}>
                {isLoading && active ? <Loader2 className="size-4 animate-spin" /> : <option.icon className="size-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ws-fg">{option.label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-ws-muted">{option.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {isPublic && profileQuery.isSuccess && !profileIsPublic ? (
        <div className="mt-4 flex gap-3 rounded-xl border border-warning/30 bg-chip-alert p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-chip-alert-fg" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-chip-alert-fg">Your profile is still private</p>
            <p className="mt-1 text-xs leading-5 text-ws-muted">
              Recruiters reach your resumes through your public profile, so publish that too.
            </p>
            <Link href="/job-seeker/profile" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
              Go to profile settings →
            </Link>
          </div>
        </div>
      ) : null}

      {isPublic && !resume.resumeFileUrl ? (
        <p className="mt-4 text-xs leading-5 text-ws-muted">
          This resume has no PDF, so recruiters read it as a page rather than downloading a file.
        </p>
      ) : null}

      {!isPublic ? (
        <Button onClick={() => setVisibility("PUBLIC")} disabled={isLoading} className="mt-4 w-full rounded-xl">
          {isLoading ? <Loader2 className="animate-spin" /> : <Globe2 />} Publish resume
        </Button>
      ) : null}
    </section>
  );
}
