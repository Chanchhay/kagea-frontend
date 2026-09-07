"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { ArrowRight, FileText, FolderGit2 } from "lucide-react";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ProfileForm } from "@/components/job-seeker/ProfileForm";
import { ProfileHeaderCard } from "@/components/job-seeker/ProfileHeaderCard";
import { ProfilePublicationCard } from "@/components/job-seeker/ProfilePublicationCard";
import { Card, CardContent } from "@/components/ui/card";
import { useGetJobSeekerProfileQuery } from "@/services/jobSeekerApi";

export default function JobSeekerProfilePage() {
  const tx = useWorkspaceTranslation();
  const profileQuery = useGetJobSeekerProfileQuery();

  if (profileQuery.isLoading) return <LoadingState rows={6} />;
  if (profileQuery.isError || !profileQuery.data) {
    return <ErrorState message={tx("Unable to load your job seeker profile. Please try refreshing.")} />;
  }

  const profile = profileQuery.data;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <PageIntro
        eyebrow="Job Seeker Workspace"
        title={tx("Profile & Visibility")}
        description={tx("Keep your profile up-to-date and manage how recruiters discover you.")}
      />

      {/* Avatar, identity chips & profile strength */}
      <ProfileHeaderCard profile={profile} />

      {/* Quick shortcuts to Resumes & Portfolios */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[var(--shadow-card)]">
          <CardContent className="p-0">
            <Link href="/job-seeker/resumes" className="group flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                <FileText className="size-5.5" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">{tx("Resumes & CVs")}</h3>
                <p className="mt-1 text-sm text-body">{tx("Create and manage resumes for applications")}</p>
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0 text-muted-fg transition group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[var(--shadow-card)]">
          <CardContent className="p-0">
            <Link href="/job-seeker/portfolios" className="group flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                <FolderGit2 className="size-5.5" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">{tx("Portfolios & Projects")}</h3>
                <p className="mt-1 text-sm text-body">{tx("Showcase your strongest projects and work")}</p>
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0 text-muted-fg transition group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Profile Publication & Visibility Card */}
      <ProfilePublicationCard profile={profile} />

      {/* Profile Edit Form */}
      <ProfileForm profile={profile} />
    </div>
  );
}
