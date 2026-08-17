"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JobsWorkspace } from "@/components/job-seeker/workspace/JobsWorkspace";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetApplicationsQuery,
  useGetResumesQuery,
} from "@/services/jobSeekerApi";
import { useGetPublicJobsQuery } from "@/services/publicApi";

/**
 * Job Seeker Jobs Page
 * 
 * Displays a list of available jobs with detailed view, search, and filtering.
 * Supports applying to jobs and AI interview practice.
 */
export default function JobSeekerJobsPage() {
  return (
    <Suspense fallback={<LoadingState rows={6} />}>
      <JobsExplorer />
    </Suspense>
  );
}

/**
 * Fetches and manages job, resume, and application data.
 * Passes data to JobsWorkspace component for rendering.
 */
function JobsExplorer() {
  const searchParams = useSearchParams();
  const jobsQuery = useGetPublicJobsQuery({ page: 0, size: 100 });
  const resumesQuery = useGetResumesQuery();
  const applicationsQuery = useGetApplicationsQuery();

  const queries = [jobsQuery, resumesQuery, applicationsQuery];
  const isLoading = queries.some((query) => query.isLoading);
  const hasError = jobsQuery.isError || !jobsQuery.data;

  if (isLoading) {
    return <LoadingState rows={6} />;
  }

  if (hasError) {
    return <ErrorState message="Unable to load published jobs." />;
  }

  return (
    <JobsWorkspace
      jobs={jobsQuery.data.content ?? []}
      resumes={resumesQuery.data ?? []}
      applications={applicationsQuery.data ?? []}
      initialKeyword={searchParams.get("q") ?? ""}
    />
  );
}
