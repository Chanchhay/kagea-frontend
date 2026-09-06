import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, Clock, MapPin, WalletCards } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { Markdown } from "@/components/shared/Markdown";
import { ApplyJobDialog } from "./ApplyJobDialog";
import { CompanyLogo } from "./CompanyLogo";
import { PracticeInterviewLink } from "./PracticeInterviewLink";
import { SaveJobButton } from "./SaveJobButton";
import { formatDate, formatEnum, formatSalary } from "./PublicJobCard";

/*
 * The landing page's panel: a flat bordered surface, no ring and no shadow.
 * The job page is wrapped in `.landing-page` (see the route), which repoints
 * the surface/border/text tokens at the landing palette, so every colour here
 * stays a token — the page follows the theme instead of pinning its own hexes.
 */
const PANEL = "rounded-2xl border border-border bg-surface";
const CHIP =
  "inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-body";

type PublicJobDetailsProps = {
  job: PublicJobResponse;
  relatedJobs: PublicJobResponse[];
};

export function PublicJobDetails({ job, relatedJobs }: PublicJobDetailsProps) {
  const salary = formatSalary(job);
  const sections = job.sections
    .filter((section) => section.contentMarkdown || section.contentText)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
<<<<<<< HEAD
    <div className="space-y-8">
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand">
                  {job.categoryName}
                </span>
                {[job.jobType, job.workMode].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-body"
                  >
                    {formatEnum(tag)}
                  </span>
                ))}
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Building2 aria-hidden="true" className="size-4 text-brand" />
                  {/*
                    * A masked company has no id, so there is no page to open —
                    * the name renders as plain text rather than as a link to
                    * /companies/null.
                    */}
                  {job.companyId == null ? (
                    job.companyName
                  ) : (
                    <Link
                      href={`/companies/${job.companyId}`}
                      className="hover:text-brand"
                    >
                      {job.companyName}
                    </Link>
                  )}
=======
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/*
       * Title and the one primary action share the top row; the apply button
       * used to sit in a sidebar card, where it competed with the job's own
       * identity for the first thing a candidate reads.
       */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
            {job.title}
          </h1>

          <div className="flex items-center gap-3">
            <CompanyLogo job={job} />
            <div className="flex min-w-0 flex-col gap-1">
              {/*
               * A masked company has no id, so there is no page to open — the
               * name renders as plain text rather than as a link to
               * /companies/null.
               */}
              {job.companyId == null ? (
                <span className="text-sm font-semibold text-heading">
                  {job.companyName}
>>>>>>> afdc0b8e48bbc453f563954761ac35d22ed4ba83
                </span>
              ) : (
                <Link
                  href={`/companies/${job.companyId}`}
                  className="text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                >
                  {job.companyName}
                </Link>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body">
                {job.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-4 text-muted-fg" />
                    {job.location}
                  </span>
                ) : null}
                {salary ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
                    <WalletCards
                      aria-hidden="true"
                      className="size-4 text-muted-fg"
                    />
                    {salary}
                  </span>
                ) : null}
                {formatDate(job.publishedAt) ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays
                      aria-hidden="true"
                      className="size-4 text-muted-fg"
                    />
                    Posted {formatDate(job.publishedAt)}
                  </span>
                ) : null}
                {formatDate(job.expiredAt) ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden="true" className="size-4 text-muted-fg" />
                    Expires {formatDate(job.expiredAt)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-landing-tint px-3 py-1 text-xs font-semibold text-brand">
              {job.categoryName}
            </span>
            {[job.jobType, job.workMode, job.experienceLevel]
              .filter(Boolean)
              .map((tag) => (
                <span key={tag} className={CHIP}>
                  {formatEnum(tag)}
                </span>
              ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <ApplyJobDialog jobId={job.id} jobTitle={job.title} />
          <SaveJobButton jobId={job.id} isFavorite={job.isFavorite} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0 space-y-5">
          {job.description ? (
            <ContentCard title="About this role">
              <Markdown content={job.description} />
            </ContentCard>
          ) : null}

          {sections.map((section) => (
            <ContentCard key={section.id} title={section.title}>
              {/* Authored as markdown; contentText is only a plain-text mirror. */}
              <Markdown
                content={section.contentMarkdown || section.contentText}
              />
            </ContentCard>
          ))}
        </div>

        <aside className="space-y-5">
          {job.skills.length > 0 ? (
            <div className={`${PANEL} p-6`}>
              <h2 className="font-semibold text-heading">Required skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill.id} className={CHIP}>
                    {skill.skillName}
                    {skill.requiredLevel
                      ? ` · ${formatEnum(skill.requiredLevel)}`
                      : null}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <PracticeInterviewLink jobId={job.id} />

          <div className={`${PANEL} p-6`}>
            <h2 className="font-semibold text-heading">Similar jobs</h2>
            {relatedJobs.length > 0 ? (
              <div className="mt-4 space-y-3">
                {relatedJobs.map((relatedJob) => (
                  <Link
                    key={relatedJob.id}
                    href={`/jobs/${relatedJob.id}`}
                    className="flex gap-3 rounded-xl border border-border p-3.5 transition-colors duration-200 hover:border-brand"
                  >
                    <CompanyLogo job={relatedJob} size={40} />
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-sm font-semibold text-heading">
                        {relatedJob.title}
                      </span>
                      <span className="truncate text-xs text-body">
                        {relatedJob.companyName}
                        {relatedJob.location ? ` · ${relatedJob.location}` : null}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[relatedJob.jobType, relatedJob.workMode]
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-body"
                            >
                              {formatEnum(tag)}
                            </span>
                          ))}
                      </div>
                      {formatDate(relatedJob.expiredAt) ? (
                        <span className="text-[11px] text-muted-fg">
                          Expires {formatDate(relatedJob.expiredAt)}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-body">
                No other openings in this category right now.
              </p>
            )}
            <Link
              href="/jobs"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-brand/30 px-6 text-sm font-semibold text-brand transition-colors duration-200 hover:border-brand hover:bg-primary hover:text-primary-foreground"
            >
              Back to jobs
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={`${PANEL} p-6 sm:p-7`}>
      <h2 className="text-xl font-semibold text-heading">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
