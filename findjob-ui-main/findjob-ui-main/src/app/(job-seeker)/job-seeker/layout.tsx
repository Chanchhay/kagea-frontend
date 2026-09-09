"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { jobSeekerLinks, WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tx = useWorkspaceTranslation();
  return (
    <WorkspaceShell role="job-seeker" title={tx("Job seeker")} links={jobSeekerLinks}>
      {children}
    </WorkspaceShell>
  );
}
