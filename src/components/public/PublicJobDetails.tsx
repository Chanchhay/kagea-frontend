import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, Clock, MapPin, WalletCards } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { Markdown } from "@/components/shared/Markdown";
import { ApplyJobDialog } from "./ApplyJobDialog";
import { CompanyLogo } from "./CompanyLogo";
import { JobInterviewQuestions } from "./JobInterviewQuestions";
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 max-lg:[overflow-wrap:anywhere]">
      {/*
       * Shown at every width. It used to be `lg:hidden`, on the assumption that
       * a desktop reader would use the browser's back button — but arriving
       * from a shared link there is nothing to go back to, and the only other
       * way out was a link buried under the similar-jobs list.
       */}
      <Link
        href="/jobs"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-body hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
        Back to jobs
      </Link>
      {/*
       * Title and the one primary action share the top row; the apply button
       * used to sit in a sidebar card, where it competed with the job's own
       * identity for the first thing a candidate reads.
       */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-col gap-4">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-heading sm:text-3xl lg:text-4xl">
            {job.title}
          </h1>

          <div className="relative grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 lg:flex">
            <CompanyLogo job={job} />
            <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-1">
              {/*
               * A masked company has no id, so there is no page to open — the
               * name renders as plain text rather than as a link to
               * /companies/null.
               */}
              {job.companyId == null ? (
                <span className="text-sm font-semibold text-heading max-lg:pr-14">
                  {job.companyName}
                </span>
              ) : (
                <Link
                  href={`/companies/${job.companyId}`}
                  className="text-sm font-semibold text-brand transition-colors hover:text-brand-hover max-lg:pr-14"
                >
                  {job.companyName}
                </Link>
              )}
              <SaveJobButton
                jobId={job.id}
                isFavorite={job.isFavorite}
                className="absolute right-0 top-0 size-11 lg:hidden"
              />
              <div className="col-span-2 grid min-w-0 gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-body sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-1 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 max-lg:[&_svg]:shrink-0 max-lg:[&>span]:items-start">
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

          <div className="flex flex-wrap gap-2 max-lg:flex-nowrap max-lg:gap-1.5 max-lg:overflow-x-auto max-lg:pb-1 max-lg:[&>span]:shrink-0 max-lg:[&>span]:whitespace-nowrap max-lg:[&>span]:px-2">
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

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <ApplyJobDialog jobId={job.id} jobTitle={job.title} />
          <SaveJobButton jobId={job.id} isFavorite={job.isFavorite} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
        <div className="min-w-0 space-y-4 lg:space-y-5">
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

          {/*
           * Last in the column on purpose: it answers "what would this actually
           * be like", which is a question someone asks after they have read the
           * role, not before. Removes itself when nobody wrote questions for
           * this job, so most postings end on their last section as before.
           */}
          <JobInterviewQuestions
            jobId={job.id}
            className={`${PANEL} p-4 sm:p-5 lg:p-7`}
          />
        </div>

        <aside className="min-w-0 space-y-4 lg:space-y-5 max-lg:[&>div]:p-4 sm:max-lg:[&>div]:p-5 max-lg:[&>div]:min-w-0 max-lg:[&_span]:max-w-full">
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
                      <span className="text-xs text-body lg:truncate">
                        {relatedJob.companyName}
                        {relatedJob.location ? ` · ${relatedJob.location}` : null}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[relatedJob.jobType, relatedJob.workMode]
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-surface-muted px-2 py-0.5 text-xs text-body"
                            >
                              {formatEnum(tag)}
                            </span>
                          ))}
                      </div>
                      {formatDate(relatedJob.expiredAt) ? (
                        <span className="text-xs text-muted-fg">
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
    <div className={`${PANEL} min-w-0 p-4 sm:p-5 lg:p-7`}>
      <h2 className="text-lg font-semibold text-heading lg:text-xl">{title}</h2>
      <div className="mt-3 max-lg:[&_.rich-text]:text-sm max-lg:[&_.rich-text]:leading-7 max-lg:[&_table]:block max-lg:[&_table]:overflow-x-auto max-lg:[&_table]:[table-layout:auto] max-lg:[&_th]:min-w-32 max-lg:[&_td]:min-w-32">{children}</div>
    </div>
  );
}
