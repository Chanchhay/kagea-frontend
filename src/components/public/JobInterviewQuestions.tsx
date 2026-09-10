"use client";

import { ListChecks, Timer } from "lucide-react";
import type { PublicJobInterviewQuestionType } from "@/contracts";
import { useGetPublicJobInterviewQuestionsQuery } from "@/services/publicApi";
import { cn } from "@/lib/utils";

/**
 * The questions an administrator wrote for one job, shown before the interview
 * starts.
 *
 * <p>Renders nothing when the job has no written questions, which is the common
 * case: most interviews are generated in full at session start, and there is
 * then genuinely nothing to preview. The interview below this panel works
 * without it either way.
 *
 * <p>Only the question text is public — the backend withholds the rubric — so
 * reading this page cannot buy a candidate a better score. It tells them what
 * they are walking into, which is the whole point.
 *
 * <p>`className` replaces the panel's own shell so the job page can hand it the
 * same border radius and padding as the cards it sits among; the practice page
 * takes the default.
 */
export function JobInterviewQuestions({
  jobId,
  className,
}: {
  jobId: string;
  className?: string;
}) {
  const { data, isLoading } = useGetPublicJobInterviewQuestionsQuery(jobId);
  const panel =
    className ?? "rounded-3xl border border-border bg-surface p-4 sm:p-6";

  if (isLoading) {
    return (
      <section className={panel}>
        <p className="text-sm text-body">Loading the interview questions…</p>
      </section>
    );
  }

  if (!data || data.questions.length === 0) return null;

  return (
    <section className={cn("min-w-0", panel)}>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-heading">
        <ListChecks aria-hidden="true" className="size-5 shrink-0 text-brand" />
        What this interview asks
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body">
        <span>
          {data.questionCount === 1
            ? "1 question"
            : `${data.questionCount} questions`}{" "}
          in total
        </span>
        {data.estimatedMinutes ? (
          <span className="inline-flex items-center gap-1.5">
            <Timer aria-hidden="true" className="size-4 text-muted-fg" />
            About {data.estimatedMinutes} min
          </span>
        ) : null}
      </div>

      <ol className="mt-5 space-y-3">
        {[...data.questions]
          .sort((first, second) => first.displayOrder - second.displayOrder)
          .map((question, index) => (
            <li
              key={question.id}
              className="rounded-2xl border border-border bg-surface-muted/50 p-3 sm:p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-semibold text-brand">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="break-words text-sm leading-6 text-heading">
                    {question.questionText}
                  </p>
                  <span className="mt-2 inline-flex rounded-md border border-border px-2 py-0.5 text-xs text-body">
                    {labelForType(question.questionType)}
                  </span>
                </div>
              </div>
            </li>
          ))}
      </ol>

      {/*
        * The gap between the two numbers is the AI's half of the interview. It
        * is not withheld — it does not exist yet, and is written fresh for each
        * candidate when the session starts. Saying so is kinder than letting
        * someone count the list and be surprised at question four.
        */}
      {data.questionCount > data.questions.length ? (
        <p className="mt-4 text-xs text-muted-fg">
          The remaining{" "}
          {data.questionCount - data.questions.length === 1
            ? "question is written"
            : `${data.questionCount - data.questions.length} questions are written`}{" "}
          by the AI when you start, so they are different every time.
        </p>
      ) : null}
    </section>
  );
}

const typeLabels: Record<PublicJobInterviewQuestionType, string> = {
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioural",
  SITUATIONAL: "Situational",
  COMMUNICATION: "Communication",
  PROBLEM_SOLVING: "Problem solving",
  GENERAL: "General",
};

function labelForType(type: PublicJobInterviewQuestionType) {
  return typeLabels[type] ?? "General";
}
