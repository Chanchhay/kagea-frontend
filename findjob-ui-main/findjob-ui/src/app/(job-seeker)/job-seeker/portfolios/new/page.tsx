"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PortfolioBuilder } from "@/components/job-seeker/PortfolioBuilder";
import { usePortfolioProjectSync } from "@/components/job-seeker/usePortfolioProjectSync";
import { PageIntro } from "@/components/shared/ApiCards";
import { useCreatePortfolioMutation } from "@/services/jobSeekerApi";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [createPortfolio, state] = useCreatePortfolioMutation();
  const syncProjects = usePortfolioProjectSync();
  const [isSavingProjects, setIsSavingProjects] = useState(false);

  return (
    <div className="mx-auto max-w-7xl">
      <PageIntro title="Create portfolio" description="Pick a template, add your projects, and watch the page build itself." />
      <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg">
        <ArrowLeft className="size-4" /> Back to portfolios
      </button>

      <PortfolioBuilder
        submitLabel="Create portfolio"
        isSubmitting={state.isLoading || isSavingProjects}
        onCancel={() => router.back()}
        onSubmit={async ({ title, summary, publicUrl, portfolioData, projects, removedProjectIds }) => {
          try {
            // The portfolio has to exist before its projects can be posted to it.
            const portfolio = await createPortfolio({ title, summary, publicUrl, portfolioData }).unwrap();
            if (projects.length) {
              setIsSavingProjects(true);
              await syncProjects(portfolio.id, { projects, removedProjectIds });
            }
            toast.success("Portfolio created");
            router.push(`/job-seeker/portfolios/${portfolio.id}`);
          } catch {
            toast.error("Could not create portfolio.");
          } finally {
            setIsSavingProjects(false);
          }
        }}
      />
    </div>
  );
}
