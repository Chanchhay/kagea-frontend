"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { JobForm } from "@/components/recruiter/JobForm";

export default function NewRecruiterJobPage() {
  const tx = useWorkspaceTranslation();
  return (
    <>
      <PageIntro
        title={tx("Create job")}
        description={tx("New posts start as a draft. Publish it once the details are right.")}
      />
      <PlainCard>
        <JobForm />
      </PlainCard>
    </>
  );
}
