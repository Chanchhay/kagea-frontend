"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useParams } from "next/navigation";
import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { JobForm } from "@/components/recruiter/JobForm";
import { useGetRecruiterJobQuery } from "@/services/recruiterApi";

export default function EditRecruiterJobPage() {
  const tx = useWorkspaceTranslation();
  const { jobId } = useParams<{ jobId: string }>();
  const jobQuery = useGetRecruiterJobQuery(jobId);

  if (jobQuery.isLoading) return <LoadingState rows={6} />;
  if (jobQuery.isError || !jobQuery.data) {
    return <ErrorState message={tx("Unable to load this job.")} />;
  }

  return (
    <>
      <PageIntro
        title={tx("Edit {0}", { 0: jobQuery.data.title })}
        description={tx("Changes apply immediately, including to published posts.")}
      />
      <PlainCard>
        <JobForm job={jobQuery.data} />
      </PlainCard>
    </>
  );
}
