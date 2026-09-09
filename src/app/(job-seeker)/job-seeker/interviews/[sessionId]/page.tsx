"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { useParams } from "next/navigation";
import { PageIntro } from "@/components/shared/ApiCards";
import { AiInterviewRunner } from "@/components/job-seeker/AiInterviewRunner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetAiInterviewQuery } from "@/services/jobSeekerApi";

export default function InterviewSessionPage() {
  const tx = useWorkspaceTranslation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const interviewQuery = useGetAiInterviewQuery(sessionId);
  const interview = interviewQuery.data;

  // Question generation happens server-side. A second subscription to the same
  // cache entry polls it, and only while generation is actually running.
  useGetAiInterviewQuery(sessionId, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    skip: interview?.status !== "PREPARING",
  });

  // Scoring happens off the request thread, so the browser learns the interview
  // is marked by watching the session rather than by waiting on a response.
  // Vapi's end-of-call webhook can also complete it without the browser asking.
  useGetAiInterviewQuery(sessionId, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    skip: interview?.status !== "IN_PROGRESS" && interview?.status !== "SCORING",
  });

  if (interviewQuery.isLoading) return <LoadingState rows={5} />;
  if (interviewQuery.isError || !interview)
    return (
      <ErrorState
        message={tx("Unable to load this interview.")}
        onRetry={() => interviewQuery.refetch()}
      />
    );

  return (
    <>
      <PageIntro
        title={interview.jobTitle}
        description={tx("Answer each question, then submit the interview for AI scoring.")}
        action={
          interview.status === "COMPLETED" ? (
            <Link
              className="text-sm font-semibold text-brand"
              href={`/job-seeker/interviews/${interview.id}/result`}
            >
              {tx("View result")}</Link>
          ) : null
        }
      />
      <AiInterviewRunner session={interview} />
    </>
  );
}
