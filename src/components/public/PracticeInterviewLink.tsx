"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useGetGuestInterviewAvailabilityQuery } from "@/services/guestInterviewApi";

/**
 * The way in to a practice interview from a job page.
 *
 * <p>Renders nothing at all when an administrator has guest interviews closed,
 * or when this visitor has used their attempts: a link that only leads to a
 * refusal is worse than no link.
 *
 * <p>Sits in the job sidebar between the required skills and the related jobs.
 * The brand green arrives as the tint token and the primary button, not as a
 * full-bleed fill — a solid green panel shouts over the neutral cards around it.
 */
export function PracticeInterviewLink({ jobId }: { jobId: number }) {
  const { data } = useGetGuestInterviewAvailabilityQuery();

  if (!data?.enabled || !data.canStart) return null;

  return (
    <div className="rounded-2xl border border-brand/30 bg-landing-tint p-6">
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        <span className="text-sm font-medium text-body">Practice first</span>
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-heading">
        Try the <span className="text-brand">AI interview</span> for this role
      </h2>

      <p className="mt-2 text-sm leading-6 text-body">
        No account needed. Answer a few role-specific questions and see how you
        sound before you apply.
      </p>

      <Link
        href={`/practice-interview/${jobId}`}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-hover active:translate-y-0 active:scale-[0.98]"
      >
        <Sparkles aria-hidden="true" className="size-4" />
        Practice Interview
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
