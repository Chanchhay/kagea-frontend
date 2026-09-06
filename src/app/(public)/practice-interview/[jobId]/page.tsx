"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GuestInterview } from "@/components/public/GuestInterview";
import { useGetPublicJobQuery } from "@/services/publicApi";

/**
 * Practising against one published job without an account.
 *
 * <p>Its own route rather than a panel on the job page: the interview takes
 * over the screen once it starts, and a visitor who is halfway through should
 * not be looking at an Apply button.
 */
export default function PracticeInterviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const id = Number(jobId);
  const { data: job, isLoading } = useGetPublicJobQuery(id, {
    skip: !Number.isFinite(id),
  });

  if (!Number.isFinite(id)) {
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

      <div className="mt-5">
        {isLoading || !job ? (
          <p className="text-sm text-body">Loading the job…</p>
        ) : (
          <GuestInterview jobId={id} jobTitle={job.title} />
        )}
      </div>
    </main>
  );
}
