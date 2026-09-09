"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { ArrowRight, FileText, FolderGit2, UserRound } from "lucide-react";
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
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="flex min-w-0 items-start gap-3.5 rounded-2xl border border-ws-line bg-ws-panel p-4 sm:p-5">
        <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-card text-primary sm:flex"><UserRound aria-hidden="true" className="size-5" /></span>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-ws-fg sm:text-2xl">{tx("Profile & Visibility")}</h1>
          <p className="mt-1 text-xs leading-relaxed text-ws-muted sm:text-sm">{tx("Keep your profile up-to-date and manage how recruiters discover you.")}</p>
        </div>
      </header>

      {/* Avatar, identity chips & profile strength */}
      <ProfileHeaderCard profile={profile} />

      {/* Quick shortcuts to Resumes & Portfolios */}
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="min-w-0 overflow-hidden rounded-2xl border border-ws-line bg-ws-panel py-0 shadow-xs ring-0 transition hover:border-ws-muted/40 hover:shadow-md">
          <CardContent className="p-0">
            <Link href="/job-seeker/resumes" className="group flex min-w-0 items-center justify-between gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-card text-primary">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <h3 className="font-semibold text-ws-fg">{tx("Resumes & CVs")}</h3>
                <p className="mt-0.5 text-xs text-ws-muted">{tx("Create and manage resumes for applications")}</p>
              </div>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-fg transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden rounded-2xl border border-ws-line bg-ws-panel py-0 shadow-xs ring-0 transition hover:border-ws-muted/40 hover:shadow-md">
          <CardContent className="p-0">
            <Link href="/job-seeker/portfolios" className="group flex min-w-0 items-center justify-between gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-card text-primary">
                <FolderGit2 className="size-5" />
              </div>
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <h3 className="font-semibold text-ws-fg">{tx("Portfolios & Projects")}</h3>
                <p className="mt-0.5 text-xs text-ws-muted">{tx("Showcase your strongest projects and work")}</p>
              </div>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-fg transition group-hover:translate-x-1 group-hover:text-primary" />
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
