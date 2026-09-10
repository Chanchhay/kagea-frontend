"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GuestInterview } from "@/components/public/GuestInterview";
import { JobInterviewQuestions } from "@/components/public/JobInterviewQuestions";
import { useGetPublicJobQuery } from "@/services/publicApi";
import { isUuid } from "@/lib/uuid";

/**
 * Practising against one published job without an account.
 *
 * <p>Its own route rather than a panel on the job page: the interview takes
 * over the screen once it starts, and a visitor who is halfway through should
 * not be looking at an Apply button.
 */
export default function PracticeInterviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const id = jobId;
  const { data: job, isLoading } = useGetPublicJobQuery(id, {
    skip: !isUuid(id),
  });

  if (!isUuid(id)) {
    return <p className="p-6 text-sm text-body">That job link is not valid.</p>;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-fg hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to the job
      </Link>

      {/*
        * The questions come first and the interview second: someone who has
        * just arrived from the job board is deciding whether to sit this at
        * all, and that decision needs the syllabus in front of it. The panel
        * removes itself when the employer set no questions, which puts the
        * interview back at the top of the page for those jobs.
        */}
      <div className="mt-5 space-y-6">
        {isLoading || !job ? (
          <p className="text-sm text-body">Loading the job…</p>
        ) : (
          <>
            <JobInterviewQuestions jobId={id} />
            <GuestInterview jobId={id} jobTitle={job.title} />
          </>
        )}
      </div>
    </main>
  );
}
