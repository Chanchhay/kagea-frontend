"use client";

import { RecruiterProfileForm } from "@/components/recruiter/RecruiterProfileForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetCurrentUserQuery } from "@/services/authApi";
import { useGetRecruiterProfileQuery } from "@/services/recruiterApi";

export default function RecruiterProfilePage() {
  const user = useGetCurrentUserQuery();
  const profile = useGetRecruiterProfileQuery();
  if (user.isLoading || profile.isLoading) return <LoadingState rows={5} />;
  if (user.isError || !user.data || profile.isError || !profile.data) return <ErrorState message="Unable to load your recruiter profile." />;
  return <div className="mx-auto max-w-6xl pb-4 pt-1">
    <div className="mb-6"><p className="text-sm font-medium text-primary">Personal workspace</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">Your recruiter profile</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ws-muted">Keep your professional identity clear and current for every candidate conversation.</p></div>
    <RecruiterProfileForm currentUser={user.data} profile={profile.data} />
  </div>;
}
