"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import {
  recruiterLinks,
  WorkspaceShell,
} from "@/components/layout/WorkspaceShell";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tx = useWorkspaceTranslation();
  return (
    <WorkspaceShell role="recruiter" title={tx("Recruiter")} links={recruiterLinks}>
      {children}
    </WorkspaceShell>
  );
}
