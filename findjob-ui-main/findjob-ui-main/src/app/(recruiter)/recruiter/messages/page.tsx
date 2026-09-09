"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function MessagesPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(
    tx("Messages"),
    tx("Threads a moderator has opened with you.")
  );

  return <MessagesWorkspace basePath="/recruiter/messages" />;
}
