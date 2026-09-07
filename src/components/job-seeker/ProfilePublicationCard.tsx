"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Globe, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { JobSeekerProfileResponse, PublicationVisibility } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { useUpdateJobSeekerPublicationMutation } from "@/services/jobSeekerApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfilePublicationCardProps {
  profile: JobSeekerProfileResponse;
}

export function ProfilePublicationCard({ profile }: ProfilePublicationCardProps) {
  const tx = useWorkspaceTranslation();
  const [updatePublication, { isLoading }] = useUpdateJobSeekerPublicationMutation();
  const [copied, setCopied] = useState(false);

  const handleVisibilityChange = async (visibility: PublicationVisibility) => {
    if (visibility === profile.profileVisibility || isLoading) return;
    try {
      await updatePublication({ visibility }).unwrap();
      const labels: Record<PublicationVisibility, string> = {
        PUBLIC: "Profile is now public!",
        PRIVATE: "Profile set to private.",
        HIDDEN: "Profile hidden.",
      };
      toast.success(labels[visibility] || "Visibility updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to update profile publication status.")));
    }
  };

  const isPublic = profile.profileVisibility === "PUBLIC";
  const publicUrl = profile.publicProfileSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${profile.publicProfileSlug}`
    : "";

  const copyPublicLink = () => {
    if (!publicUrl) {
      toast.error(tx("No public profile link available yet."));
      return;
    }
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success(tx("Public profile link copied to clipboard!"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl border border-ws-line bg-ws-panel py-0 shadow-xs ring-0">
      <CardContent className="space-y-4 p-5 sm:p-6">
        {/* Header row: Title & Compact Segmented Toggle (PUBLIC / PRIVATE only) */}
        <div className="flex flex-col gap-3 border-b border-ws-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-ws-fg">
              <Globe className="size-4.5 text-primary" />
              {tx("Profile Visibility")}
            </h2>
            <p className="mt-0.5 text-xs text-ws-muted">
              {isPublic
                ? tx("Your profile is publicly discoverable by recruiters searching for talent.")
                : tx("Your profile is private. Only companies you directly apply to can see it.")}
            </p>
          </div>

          {/* Compact segmented control */}
          <div className="inline-flex shrink-0 items-center rounded-xl border border-ws-line bg-ws-card p-1 self-start sm:self-auto">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleVisibilityChange("PUBLIC")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                isPublic
                  ? "border border-ws-line bg-ws-panel text-primary shadow-xs"
                  : "text-ws-muted hover:text-ws-fg",
              )}
            >
              <Globe className="size-3.5" />
              {tx("Public")}
              {isPublic && <span className="size-1.5 rounded-full bg-primary" />}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleVisibilityChange("PRIVATE")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                !isPublic
                  ? "border border-ws-line bg-ws-panel text-amber-600 shadow-xs dark:text-amber-400"
                  : "text-ws-muted hover:text-ws-fg",
              )}
            >
              <Lock className="size-3.5" />
              {tx("Private")}
              {!isPublic && <span className="size-1.5 rounded-full bg-amber-500" />}
            </button>
          </div>
        </div>

        {/* Primary Useful Section: Live URL + Actions when Public; CTA when Private */}
        {/* {isPublic ? (
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-primary/20 bg-ws-card/60 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <span className="text-sm font-semibold text-ws-fg">
                  {tx("Your profile is live and published!")}
                </span>
              </div>
              {profile.publishedAt && (
                <p className="mt-1 text-xs text-ws-muted">
                  {tx("Published on ")}
                  {new Date(profile.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
              )} */}
              {/* {publicUrl && (
                <p className="mt-1 truncate font-mono text-xs text-primary/90">
                  {publicUrl}
                </p>
              )} */}
            {/* </div> */}

            {/* <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyPublicLink}
                className="h-9 gap-1.5 rounded-lg border-ws-line bg-ws-panel text-xs font-medium text-ws-fg hover:bg-ws-card hover:text-ws-fg"
              >
                {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                {copied ? tx("Copied") : tx("Copy Link")}
              </Button>
              <Button
                render={
                  <Link
                    href={profile.publicProfileSlug ? `/profile/${profile.publicProfileSlug}` : "/job-seeker/profile"}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                size="sm"
                className="h-9 gap-1.5 rounded-lg bg-primary text-xs font-medium text-white shadow-xs hover:bg-primary-hover"
              >
                <ExternalLink className="size-3.5" />
                {tx("View Public Profile")}
              </Button>
            </div>
          </div>
        ) : ( */}
          {/* <div className="flex flex-col justify-between gap-4 rounded-xl border border-ws-line bg-ws-card/50 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-panel text-primary">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ws-fg">
                  {tx("Ready to publish your profile?")}
                </h3>
                <p className="mt-0.5 text-xs text-ws-muted">
                  {tx("Publishing creates your shareable public link and makes your profile visible to recruiters.")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleVisibilityChange("PUBLIC")}
              disabled={isLoading}
              className="h-9 shrink-0 gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-white shadow-xs hover:bg-primary-hover"
            >
              <Globe className="size-3.5" />
              {isLoading ? tx("Publishing…") : tx("Publish Profile Now")}
            </Button>
          </div> */}
      </CardContent>
    </Card>
  );
}
