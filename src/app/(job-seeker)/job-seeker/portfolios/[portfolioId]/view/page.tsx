"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { PortfolioPreview } from "@/components/job-seeker/PortfolioDocument";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { useGetPortfolioQuery } from "@/services/jobSeekerApi";

/** The portfolio on its own, at full width, the way a visitor would see it. */
export default function ViewPortfolioPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const query = useGetPortfolioQuery(portfolioId);

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load this portfolio." />;
  const portfolio = query.data;
  const projects = [...(portfolio.projects ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link href={`/job-seeker/portfolios/${portfolio.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg">
          <ArrowLeft className="size-4" /> Back to portfolio
        </Link>
        <Button render={<Link href={`/job-seeker/portfolios/${portfolio.id}`} />} variant="secondary" className="rounded-xl">
          <Pencil /> Edit
        </Button>
      </div>

      <PortfolioPreview
        title={portfolio.title}
        summary={portfolio.summary ?? ""}
        publicUrl={portfolio.publicUrl ?? ""}
        projects={projects}
        theme={portfolio.portfolioData}
      />
    </div>
  );
}
