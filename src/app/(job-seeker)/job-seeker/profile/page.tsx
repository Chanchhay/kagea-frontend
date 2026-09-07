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
      <header className="flex min-w-0 items-start gap-4 rounded-3xl border border-primary/15 bg-linear-to-r from-primary/10 to-ws-panel p-5 sm:p-7">
        <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex"><UserRound aria-hidden="true" className="size-6" /></span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Profile & Visibility")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx("Keep your profile up-to-date and manage how recruiters discover you.")}</p>
        </div>
      </header>

      {/* Avatar, identity chips & profile strength */}
      <ProfileHeaderCard profile={profile} />

      {/* Quick shortcuts to Resumes & Portfolios */}
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="min-w-0 overflow-hidden rounded-2xl border border-primary/20 bg-ws-panel py-0 shadow-sm ring-0 transition hover:border-primary/40 hover:shadow-md">
          <CardContent className="p-0">
            <Link href="/job-seeker/resumes" className="group flex min-w-0 items-center justify-between gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="size-5.5" />
              </div>
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <h3 className="font-semibold text-ws-fg">{tx("Resumes & CVs")}</h3>
                <p className="mt-1 text-sm text-ws-muted">{tx("Create and manage resumes for applications")}</p>
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0 text-muted-fg transition group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden rounded-2xl border border-primary/20 bg-ws-panel py-0 shadow-sm ring-0 transition hover:border-primary/40 hover:shadow-md">
          <CardContent className="p-0">
            <Link href="/job-seeker/portfolios" className="group flex min-w-0 items-center justify-between gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FolderGit2 className="size-5.5" />
              </div>
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <h3 className="font-semibold text-ws-fg">{tx("Portfolios & Projects")}</h3>
                <p className="mt-1 text-sm text-ws-muted">{tx("Showcase your strongest projects and work")}</p>
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
