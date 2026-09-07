"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, Eye, Globe2, Layers3, Loader2, Lock, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PublicationVisibility } from "@/contracts";
import { PortfolioBuilder } from "@/components/job-seeker/PortfolioBuilder";
import { PortfolioPreview } from "@/components/job-seeker/PortfolioDocument";
import { usePortfolioProjectSync } from "@/components/job-seeker/usePortfolioProjectSync";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { getPortfolioTemplate } from "@/components/job-seeker/portfolio-templates";
import { normalizePortfolioTheme } from "@/lib/portfolio-data";
import {
  useDeletePortfolioMutation,
  useGetPortfolioQuery,
  useUpdatePortfolioMutation,
  useUpdatePortfolioPublicationMutation,
} from "@/services/jobSeekerApi";

export default function PortfolioDetailPage() {
  const tx = useWorkspaceTranslation();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const router = useRouter();
  const query = useGetPortfolioQuery(portfolioId);
  const syncProjects = usePortfolioProjectSync();
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProjects, setIsSavingProjects] = useState(false);
  const [updatePortfolio, updateState] = useUpdatePortfolioMutation();
  const [updatePublication, publicationState] = useUpdatePortfolioPublicationMutation();
  const [deletePortfolio, deleteState] = useDeletePortfolioMutation();

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError || !query.data) return <ErrorState message={tx("Unable to load this portfolio.")} />;
  const portfolio = query.data;
  const projects = [...(portfolio.projects ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const theme = normalizePortfolioTheme(portfolio.portfolioData);
  const isPublic = portfolio.visibility === "PUBLIC";

  async function removePortfolio() {
    if (!window.confirm(`Delete “${portfolio.title}” and all its projects?`)) return;
    try {
      await deletePortfolio(portfolioId).unwrap();
      toast.success(tx("Portfolio deleted"));
      router.replace("/job-seeker/portfolios");
    } catch { toast.error(tx("Could not delete portfolio.")); }
  }

  async function setVisibility(visibility: PublicationVisibility) {
    try {
      await updatePublication({ portfolioId, body: { visibility } }).unwrap();
      toast.success(visibility === "PUBLIC" ? tx("Portfolio is now visible to recruiters") : tx("Portfolio is private again"));
    } catch { toast.error(tx("Could not change visibility.")); }
  }

  if (isEditing) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageIntro title={portfolio.title} description={tx("Edit your portfolio and watch the page update as you type.")} />
        <button onClick={() => setIsEditing(false)} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg">
          <ArrowLeft className="size-4" /> {tx(" Back to portfolio")}</button>
        <PortfolioBuilder
          initialTitle={portfolio.title}
          initialSummary={portfolio.summary ?? ""}
          initialPublicUrl={portfolio.publicUrl ?? ""}
          initialTheme={portfolio.portfolioData}
          initialProjects={projects}
          submitLabel={tx("Save changes")}
          isSubmitting={updateState.isLoading || isSavingProjects}
          onCancel={() => setIsEditing(false)}
          onSubmit={async ({ title, summary, publicUrl, portfolioData, projects: drafts, removedProjectIds }) => {
            try {
              await updatePortfolio({ portfolioId, body: { title, summary, publicUrl, portfolioData } }).unwrap();
              setIsSavingProjects(true);
              await syncProjects(portfolioId, { projects: drafts, removedProjectIds });
              toast.success(tx("Portfolio updated"));
              setIsEditing(false);
            } catch {
              toast.error(tx("Could not save your changes."));
            } finally {
              setIsSavingProjects(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={portfolio.title} description={portfolio.summary || tx("Review and manage this portfolio.")} />
      <Link href="/job-seeker/portfolios" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg">
        <ArrowLeft className="size-4" /> {tx(" All portfolios")}</Link>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
        <section className="overflow-hidden rounded-[24px] bg-ws-card">
          <div className="bg-ws-card-hover p-6 sm:p-8">
            <PortfolioPreview
              title={portfolio.title}
              summary={portfolio.summary ?? ""}
              publicUrl={portfolio.publicUrl ?? ""}
              projects={projects}
              theme={portfolio.portfolioData}
            />
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-ws-fg">{portfolio.title}</h2>
              <p className="mt-1 text-sm text-ws-muted">{getPortfolioTemplate(theme.templateId).name} {tx(" template · ")}{projects.length} {projects.length === 1 ? tx("project") : tx("projects")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="rounded-xl"><Pencil /> {tx(" Edit")}</Button>
              <Button render={<Link href={`/job-seeker/portfolios/${portfolio.id}/view`} />} className="rounded-xl"><Eye /> {tx(" Full view")}</Button>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[22px] bg-ws-card p-5">
            <h2 className="text-sm font-semibold text-ws-fg">{tx("Visibility")}</h2>
            <p className="mt-2 text-xs leading-5 text-ws-muted">
              {isPublic ? tx("Recruiters browsing talent can see this portfolio on your public profile.") : tx("Only you can see this portfolio. Make it public to show it to recruiters.")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className={`flex size-9 items-center justify-center rounded-xl ${isPublic ? "bg-chip-soft text-chip-soft-fg" : "bg-ws-panel text-ws-muted"}`}>
                {isPublic ? <Globe2 className="size-4" /> : <Lock className="size-4" />}
              </span>
              <div>
                <p className="text-xs text-ws-muted">{tx("Current status")}</p>
                <p className="mt-0.5 text-sm font-medium capitalize text-ws-fg">{portfolio.visibility?.toLowerCase() ?? tx("private")}</p>
              </div>
            </div>
            <Button
              variant={isPublic ? "secondary" : "default"}
              onClick={() => setVisibility(isPublic ? "PRIVATE" : "PUBLIC")}
              disabled={publicationState.isLoading}
              className="mt-5 w-full rounded-xl"
            >
              {publicationState.isLoading ? <Loader2 className="animate-spin" /> : isPublic ? <Lock /> : <Globe2 />}
              {isPublic ? tx("Make private") : tx("Make public")}
            </Button>
          </section>

          <section className="rounded-[22px] bg-ws-card p-5">
            <h2 className="text-sm font-semibold text-ws-fg">{tx("Details")}</h2>
            <div className="mt-5 space-y-4">
              <InfoRow icon={Layers3} label={tx("Projects")} value={`${projects.length}`} />
              <InfoRow icon={CalendarDays} label={tx("Last updated")} value={formatDate(portfolio.updatedAt)} />
              {portfolio.publicUrl ? (
                <a href={portfolio.publicUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-primary">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg"><ExternalLink className="size-4" /></span>
                  <div className="min-w-0">
                    <p className="text-xs text-ws-muted">{tx("Website")}</p>
                    <p className="mt-0.5 truncate text-sm font-medium">{portfolio.publicUrl}</p>
                  </div>
                </a>
              ) : null}
            </div>
          </section>

          <section className="rounded-[22px] bg-ws-card p-5">
            <h2 className="text-sm font-semibold text-ws-fg">{tx("Portfolio actions")}</h2>
            <p className="mt-2 text-xs leading-5 text-ws-muted">{tx("Deleting removes this portfolio and every project inside it.")}</p>
            <Button variant="destructive" onClick={removePortfolio} disabled={deleteState.isLoading} className="mt-5 w-full rounded-xl">
              {deleteState.isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />} {tx(" Delete portfolio")}</Button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Layers3; label: string; value: string }) {
  const tx = useWorkspaceTranslation();
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-xl bg-ws-panel text-ws-muted"><Icon className="size-4" /></span>
      <div>
        <p className="text-xs text-ws-muted">{tx(label)}</p>
        <p className="mt-0.5 text-sm font-medium text-ws-fg">{value}</p>
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
