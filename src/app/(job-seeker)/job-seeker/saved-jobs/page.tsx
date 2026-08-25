"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  BookmarkX,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Trash2,
} from "lucide-react";
import type { FavoriteJobResponse } from "@/contracts";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetFavoriteJobsQuery,
  useRemoveFavoriteJobMutation,
} from "@/services/jobSeekerApi";

const PAGE_SIZE = 20;

export default function SavedJobsPage() {
  const [page, setPage] = useState(0);
  const query = useGetFavoriteJobsQuery({ page, size: PAGE_SIZE });

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message="Unable to load saved jobs." />;

  const saved = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 1;
  const openCount = saved.filter((job) => job.available).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title="Saved jobs"
        description="Roles you bookmarked while browsing. Closed and expired posts stay here until you remove them."
      />

      {saved.length ? (
        <>
          <p className="mb-5 text-xs text-ws-muted">
            {saved.length} saved · {openCount} still accepting applications
          </p>
          <div className="space-y-3">
            {saved.map((job) => (
              <SavedJobRow key={job.id} job={job} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-ws-muted">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={page >= totalPages - 1}
                className="h-10 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-[24px] bg-ws-card px-6 py-16 text-center">
          <BookmarkX className="mx-auto size-10 text-ws-faint" />
          <h2 className="mt-4 font-semibold text-ws-fg">No saved jobs yet</h2>
          <p className="mt-2 text-sm text-ws-muted">
            Tap the bookmark on any job to keep it here for later.
          </p>
          <Link
            href="/job-seeker/jobs"
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </div>
  );
}

function SavedJobRow({ job }: { job: FavoriteJobResponse }) {
  const [removeJob, { isLoading }] = useRemoveFavoriteJobMutation();

  return (
    <div
      className={`grid gap-4 rounded-[20px] bg-ws-card p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center ${
        job.available ? "" : "opacity-60"
      }`}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-ws-panel text-primary shadow-sm">
        <Bookmark className="size-5" />
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {/*
           * Only an open job links out: the public detail page returns 404 for
           * a closed or expired post, so a link there would be a dead end.
           */}
          {job.available ? (
            <Link
              href={`/jobs/${job.jobId}`}
              className="truncate font-semibold text-ws-fg hover:text-primary"
            >
              {job.title}
            </Link>
          ) : (
            <h2 className="truncate font-semibold text-ws-fg">{job.title}</h2>
          )}
          {job.available ? null : (
            <span className="rounded-full bg-chip-alert px-2.5 py-1 text-[11px] font-semibold text-chip-alert-fg">
              No longer accepting applications
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ws-muted">
          <span className="flex items-center gap-1.5">
            <BriefcaseBusiness className="size-3.5" /> {job.companyName}
          </span>
          {job.location ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {job.location}
            </span>
          ) : null}
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> Saved {formatDate(job.savedAt)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeJob(job.jobId)}
        disabled={isLoading}
        aria-label={`Remove ${job.title} from saved jobs`}
        className="inline-flex size-10 items-center justify-center rounded-xl bg-ws-panel text-ws-muted transition hover:text-chip-alert-fg disabled:opacity-40"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "recently"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}
