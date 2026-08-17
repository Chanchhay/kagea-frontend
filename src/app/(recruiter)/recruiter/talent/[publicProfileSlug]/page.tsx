"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Calendar,
  Code2,
  DollarSign,
  ExternalLink,
  FileText,
  FolderGit2,
  Globe,
  Layers3,
  MapPin,
  Quote,
} from "lucide-react";
import type { PublicPortfolioResponse, PublicResumeResponse, PublicTalentListItemResponse } from "@/contracts";
import { PortfolioPreview } from "@/components/job-seeker/PortfolioDocument";
import { ResumePreview } from "@/components/job-seeker/ResumeDocument";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ResumeDownloadButton } from "@/components/recruiter/ResumeDownloadButton";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/lib/file-url";
import { hasResumeContent } from "@/lib/resume-data";
import { useGetTalentDetailQuery } from "@/services/recruiterApi";

export default function TalentDetailPage() {
  const { publicProfileSlug } = useParams<{ publicProfileSlug: string }>();
  const talentQuery = useGetTalentDetailQuery(publicProfileSlug);

  if (talentQuery.isLoading) return <LoadingState rows={8} />;
  if (talentQuery.isError || !talentQuery.data) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState message="Unable to load this public candidate profile." />
      </div>
    );
  }

  const { profile: talent, portfolios, resumes } = talentQuery.data;
  const projectCount = portfolios.reduce((total, portfolio) => total + (portfolio.projects?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <BackLink />

      <ProfileHero talent={talent} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={FileText} value={resumes.length} label={resumes.length === 1 ? "Published resume" : "Published resumes"} />
        <StatTile icon={FolderGit2} value={portfolios.length} label={portfolios.length === 1 ? "Portfolio" : "Portfolios"} />
        <StatTile icon={Layers3} value={projectCount} label={projectCount === 1 ? "Project" : "Projects"} />
      </div>

      {talent.bio ? (
        <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <Quote aria-hidden="true" className="absolute -right-3 -top-3 size-24 text-brand/5" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">About this candidate</h2>
          <p className="relative mt-4 max-w-3xl whitespace-pre-wrap text-[15px] leading-7 text-slate-700 dark:text-slate-300">
            {talent.bio}
          </p>
        </section>
      ) : null}

      <SectionHeading icon={FileText} title="Published resumes" count={resumes.length} />
      {resumes.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} slug={publicProfileSlug} />
          ))}
        </div>
      ) : (
        <EmptyPanel icon={FileText} message="This candidate has not published any resumes yet." />
      )}

      <SectionHeading icon={FolderGit2} title="Portfolios" count={portfolios.length} />
      {portfolios.length ? (
        <div className="space-y-8">
          {portfolios.map((portfolio) => (
            <PortfolioBlock key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      ) : (
        <EmptyPanel icon={FolderGit2} message="This candidate has not published any portfolios yet." />
      )}
    </div>
  );
}

/** Banner: portrait, headline, and the facts a recruiter screens on first. */
function ProfileHero({ talent }: { talent: PublicTalentListItemResponse }) {
  const avatar = resolveFileUrl(talent.avatarUrl);
  const initial = (talent.headline || talent.currentPosition || "?").trim().charAt(0).toUpperCase();
  const showSalary = talent.salaryVisibility === "PUBLIC" && (talent.expectedSalaryMin || talent.expectedSalaryMax);

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="relative h-32 bg-linear-to-br from-brand via-brand/80 to-brand/40 sm:h-36">
        <span aria-hidden="true" className="absolute -right-10 -top-16 size-56 rounded-full bg-white/10" />
        <span aria-hidden="true" className="absolute -bottom-20 right-24 size-40 rounded-full bg-black/5" />
      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              width={128}
              height={128}
              unoptimized
              className="size-28 shrink-0 rounded-2xl border-4 border-surface object-cover shadow-md sm:size-32"
            />
          ) : (
            <span className="flex size-28 shrink-0 items-center justify-center rounded-2xl border-4 border-surface bg-brand-tint text-4xl font-bold text-brand shadow-md sm:size-32">
              {initial}
            </span>
          )}

          <div className="min-w-0 flex-1 sm:pb-1">
            <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
              {talent.headline || "Candidate profile"}
            </h1>
            {talent.currentPosition ? (
              <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Briefcase className="size-4 text-brand" />
                {talent.currentPosition}
              </p>
            ) : null}
          </div>

          {talent.availabilityStatus ? (
            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
              <BadgeCheck className="size-3.5" />
              {formatEnum(talent.availabilityStatus)}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {talent.preferredLocation ? <Fact icon={MapPin}>{talent.preferredLocation}</Fact> : null}
          {showSalary ? (
            <Fact icon={DollarSign} highlight>
              {formatSalaryRange(talent.expectedSalaryMin, talent.expectedSalaryMax, talent.expectedSalaryCurrency)}
            </Fact>
          ) : null}
          <Fact icon={Globe}>{talent.publicProfileSlug}</Fact>
        </div>
      </div>
    </section>
  );
}

/**
 * Uploaded resumes are downloaded as a PDF; resumes built in the app have no
 * file, so their content is rendered here instead of offering a dead download.
 */
function ResumeCard({ resume, slug }: { resume: PublicResumeResponse; slug: string }) {
  const isBuilt = !resume.resumeFileUrl && hasResumeContent(resume.resumeData);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:shadow-[var(--shadow-card)]">
      <div className="flex justify-center bg-surface-muted/50 p-5">
        {isBuilt ? (
          <ResumePreview title={resume.title} data={resume.resumeData} className="w-full max-w-52" />
        ) : resume.resumeFileUrl ? (
          <div className="aspect-[0.707] w-full max-w-52 overflow-hidden bg-white shadow-sm">
            <iframe
              src={`${resolveFileUrl(resume.resumeFileUrl)}#page=1&view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
              title={`${resume.title} preview`}
              tabIndex={-1}
              scrolling="no"
              className="pointer-events-none size-full border-0"
            />
          </div>
        ) : (
          <div className="flex aspect-[0.707] w-full max-w-52 items-center justify-center bg-white">
            <FileText className="size-10 text-slate-300" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-heading">{resume.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{isBuilt ? "Built in app" : "PDF document"}</p>
          </div>
          {resume.isDefault ? (
            <span className="shrink-0 rounded bg-brand-tint px-2 py-0.5 text-[10px] font-semibold text-brand">Default</span>
          ) : null}
        </div>

        {resume.publishedAt ? (
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="size-3" />
            Published {new Date(resume.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
          </p>
        ) : null}

        <div className="mt-auto pt-2">
          {resume.resumeFileUrl ? (
            <ResumeDownloadButton slug={slug} resumeId={resume.id} title={resume.title} />
          ) : (
            <p className="text-xs text-slate-500">Shown in full above — this candidate did not attach a PDF.</p>
          )}
        </div>
      </div>
    </article>
  );
}

/** The portfolio as its owner designed it, plus links a recruiter can click. */
function PortfolioBlock({ portfolio }: { portfolio: PublicPortfolioResponse }) {
  const projects = [...(portfolio.projects ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const linked = projects.filter((project) => project.projectUrl || project.githubUrl);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-heading">{portfolio.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        {portfolio.publicUrl ? (
          <Button
            render={<a href={portfolio.publicUrl} target="_blank" rel="noopener noreferrer" />}
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 gap-1 rounded-lg text-brand"
          >
            <Globe className="size-3.5" /> Website
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted/30 p-4">
        <PortfolioPreview
          title={portfolio.title}
          summary={portfolio.summary ?? ""}
          publicUrl={portfolio.publicUrl ?? ""}
          projects={projects}
          theme={portfolio.portfolioData}
        />
      </div>

      {/* The rendered page shows links as text, so repeat them here as real links. */}
      {linked.length ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {linked.map((project) => (
            <span key={project.id} className="flex items-center gap-2 rounded-lg border border-border/80 bg-surface px-2.5 py-1.5">
              <span className="font-semibold text-heading">{project.title}</span>
              {project.projectUrl ? (
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-brand hover:underline">
                  <ExternalLink className="size-3" /> Live
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-slate-700 hover:underline dark:text-slate-300">
                  <Code2 className="size-3" /> Code
                </a>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BackLink() {
  return (
    <Button render={<Link href="/recruiter/talent" />} variant="outline" size="sm" className="rounded-xl border-border text-slate-600">
      <ArrowLeft className="mr-1.5 size-4" />
      Back to Talent Discovery
    </Button>
  );
}

function SectionHeading({ icon: Icon, title, count }: { icon: typeof FileText; title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-tint text-brand">
        <Icon className="size-4.5" />
      </span>
      <h2 className="text-lg font-semibold text-heading">{title}</h2>
      <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-slate-500">{count}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function StatTile({ icon: Icon, value, label }: { icon: typeof FileText; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-heading">{value}</p>
        <p className="mt-1.5 text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Fact({ icon: Icon, highlight, children }: { icon: typeof MapPin; highlight?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
        highlight ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-surface-muted text-slate-600 dark:text-slate-400"
      }`}
    >
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

function EmptyPanel({ icon: Icon, message }: { icon: typeof FileText; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-muted/30 px-6 py-12 text-center">
      <Icon className="mx-auto size-8 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}

function formatEnum(value: string) {
  return value.replace(/_/g, " ").toLowerCase().replace(/^./, (char) => char.toUpperCase());
}

function formatSalaryRange(min?: number, max?: number, currency = "USD") {
  if (!min && !max) return "Not specified";
  const fmt = new Intl.NumberFormat();
  if (min && max) return `${currency} ${fmt.format(min)} – ${fmt.format(max)}`;
  if (min) return `From ${currency} ${fmt.format(min)}`;
  return `Up to ${currency} ${fmt.format(max!)}`;
}
