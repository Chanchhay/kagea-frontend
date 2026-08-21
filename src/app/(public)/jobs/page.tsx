"use client";

import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { PublicJobExplorer } from "@/components/public/PublicJobExplorer";
import { PublicJobCatalog } from "@/components/public/PublicJobCatalog";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetPublicJobCategoriesQuery,
  useGetPublicJobsQuery,
  useGetPublicSkillsQuery,
  useGetPublicIndustriesQuery,
} from "@/services/publicApi";

export default function PublicJobsPage() {
  const jobs = useGetPublicJobsQuery({ size: 100, sort: "publishedAt,desc" });
  const categories = useGetPublicJobCategoriesQuery();
  const skills = useGetPublicSkillsQuery();
  const industries = useGetPublicIndustriesQuery();

  const content =
    jobs.isLoading || categories.isLoading || skills.isLoading || industries.isLoading ? (
      <LoadingState rows={6} />
    ) : jobs.isError || categories.isError || skills.isError || industries.isError ? (
      <ErrorState message="Unable to load published jobs." />
    ) : (
      <><PublicJobExplorer
        jobs={jobs.data?.content ?? []}
        categories={categories.data ?? []}
        skills={skills.data ?? []}
      /><PublicJobCatalog categories={categories.data ?? []} skills={skills.data ?? []} industries={industries.data ?? []} /></>
    );

  return (
    <PublicShell>
      <main className="bg-canvas py-10">
        <PageContainer>
          {content}
        </PageContainer>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}



