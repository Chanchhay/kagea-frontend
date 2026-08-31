"use client";

import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { PageIntro } from "@/components/shared/ApiCards";

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Messages"
        description="Threads a moderator has opened with you."
      />
      <MessagesWorkspace basePath="/recruiter/messages" />
    </div>
  );
}
