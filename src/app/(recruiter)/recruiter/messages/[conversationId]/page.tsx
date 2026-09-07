"use client";

import { useParams } from "next/navigation";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function MessageThreadPage() {
  const tx = useWorkspaceTranslation();
  const { conversationId } = useParams<{ conversationId: string }>();

  useSetPageHeading(
    tx("Messages"),
    tx("Threads a moderator has opened with you.")
  );

  return (
    <MessagesWorkspace
      basePath="/recruiter/messages"
      conversationId={conversationId}
    />
  );
}
