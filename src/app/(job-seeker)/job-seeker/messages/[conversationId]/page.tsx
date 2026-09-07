"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useParams } from "next/navigation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { PageIntro } from "@/components/shared/ApiCards";

export default function MessageThreadPage() {
  const tx = useWorkspaceTranslation();
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title={tx("Messages")}
        description={tx("Threads a moderator has opened with you.")}
      />
      <MessagesWorkspace
        basePath="/job-seeker/messages"
        conversationId={Number(conversationId)}
      />
    </div>
  );
}
