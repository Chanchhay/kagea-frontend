"use client";

import Link from "next/link";
import { ArrowUpRight, ListChecks, Sparkles } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { useGetPublicJobInterviewQuestionsBatchQuery } from "@/services/publicApi";
import { useLocale } from "@/i18n/LocaleProvider";

/** Questions shown per job before the block stops and counts the rest. */
const QUESTIONS_PER_JOB = 3;

/**
 * The interviews behind the jobs on this page of the board.
 *
 * <p>Sits under the grid and its pagination rather than inside the cards: a
 * card is a summary someone scans, and a stack of questions in each one would
 * bury the title and the salary that the scan is actually for. Down here there
 * is room to show real questions, and a reader who has finished the grid is
 * exactly the reader deciding what to try.
 *
 * <p>Follows the page, so filtering or paging the listing changes what it
 * covers. Jobs with no written questions are left out entirely, and the whole
 * section disappears when that is all of them — which is the common case until
 * an administrator writes some.
 */
export function JobListInterviewQuestions({ jobs }: { jobs: PublicJobResponse[] }) {
  const { t } = useLocale();
  const jobIds = jobs.map((job) => job.id);

  const { data } = useGetPublicJobInterviewQuestionsBatchQuery(jobIds, {
    skip: jobIds.length === 0,
  });

  // The batch answers in the order asked, but a job can drop off the board
  // between the listing and this call, so titles come from the card's own job.
  const titles = new Map(jobs.map((job) => [job.id, job]));
  const withQuestions = (data ?? []).filter(
    (preview) => preview.questions.length > 0 && titles.has(preview.jobId),
  );

  if (withQuestions.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-border dark:bg-surface sm:p-7">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-heading">
        <ListChecks aria-hidden="true" className="size-5 text-brand" />
        {t("findJobsPage.interviewPreviewHeading")}
      </h2>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-body">
        {t("findJobsPage.interviewPreviewIntro")}
      </p>

      <div className="mt-6 space-y-5">
        {withQuestions.map((preview) => {
          const job = titles.get(preview.jobId)!;
          const shown = preview.questions.slice(0, QUESTIONS_PER_JOB);
          // Counted against the whole interview, not just the written part, so
          // this and the job page tell a reader the same story about length.
          const remaining = preview.questionCount - shown.length;

          return (
            <article
              key={preview.jobId}
              className="rounded-xl border border-slate-200 p-5 dark:border-border"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/jobs/${preview.jobId}`}
                    className="font-medium text-slate-950 hover:text-brand dark:text-heading"
                  >
                    {job.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {job.companyName}
                    {preview.estimatedMinutes
                      ? ` · ${t("findJobsPage.interviewPreviewMinutes").replace(
                          "{count}",
                          String(preview.estimatedMinutes),
                        )}`
                      : null}
                  </p>
                </div>

                <Link
                  href={`/practice-interview/${preview.jobId}`}
                  aria-label={`${t("findJobsPage.interviewNowAria")} ${job.title}`}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
                >
                  <Sparkles aria-hidden="true" className="size-4" />
                  {t("findJobsPage.interviewNow")}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>

              <ol className="mt-4 space-y-2">
                {shown.map((question, index) => (
                  <li
                    key={question.id}
                    className="flex gap-2.5 text-sm leading-6 text-slate-700 dark:text-body"
                  >
                    <span aria-hidden="true" className="shrink-0 text-muted-fg">
                      {index + 1}.
                    </span>
                    <span className="min-w-0">{question.questionText}</span>
                  </li>
                ))}
              </ol>

              {remaining > 0 ? (
                <p className="mt-3 text-xs text-muted-fg">
                  {(remaining === 1
                    ? t("findJobsPage.interviewPreviewMoreOne")
                    : t("findJobsPage.interviewPreviewMoreMany")
                  ).replace("{count}", String(remaining))}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
