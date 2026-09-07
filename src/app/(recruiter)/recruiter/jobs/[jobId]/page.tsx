"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Edit3,
  Layers3,
  MapPin,
  WalletCards,
} from "lucide-react";
import type { JobPostResponse } from "@/contracts";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Markdown } from "@/components/shared/Markdown";
import { JobStatusActions } from "@/components/recruiter/JobStatusActions";
import { formatMoney } from "@/lib/money";
import { useGetRecruiterJobQuery } from "@/services/recruiterApi";

export default function RecruiterJobDetailPage() {
  const tx = useWorkspaceTranslation();
  const { jobId } = useParams<{ jobId: string }>();
  const jobQuery = useGetRecruiterJobQuery(jobId);

  if (jobQuery.isLoading) return <LoadingState rows={6} />;
  if (jobQuery.isError || !jobQuery.data) {
    return <ErrorState message={tx("Unable to load this job.")} />;
  }

  const job = jobQuery.data;
  const sections = [...(job.sections ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <header className="rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-xs">
        <div className="flex flex-wrap items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            render={<Link href="/recruiter/jobs" />}
            className="-ml-2 size-10 shrink-0 rounded-lg text-ws-muted"
            aria-label={tx("Back to jobs")}
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              {job.categoryName ? (
                <span className="rounded-full bg-ws-card px-2.5 py-1 text-xs font-medium text-ws-muted">
                  {job.categoryName}
                </span>
              ) : null}
            </div>
            <h1 className="truncate text-2xl font-bold text-ws-fg">
              {job.title}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ws-muted">
              <span>{job.companyName}</span>
              {job.location ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{job.location}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              render={<Link href={`/recruiter/jobs/${job.id}/edit`} />}
              className="h-11 rounded-lg px-5"
            >
              <Edit3 aria-hidden="true" className="size-4" />
              {tx("Edit")}
            </Button>
            <JobStatusActions job={job} />
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <main className="space-y-5">
          <ContentCard title={tx("Overview")}>
            <Markdown content={job.description} />
          </ContentCard>

          {sections.map((section) => (
            <ContentCard key={section.id} title={section.title}>
              <Markdown content={section.contentMarkdown || section.contentText} />
            </ContentCard>
          ))}
        </main>

        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          <SummaryCard job={job} />

          {job.skills?.length ? (
            <section className="rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-xs">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Layers3 aria-hidden="true" className="size-5" />
                </span>
                <h2 className="font-semibold text-ws-fg">{tx("Skills")}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill.skillId}
                    className="rounded-full border border-ws-line bg-ws-card px-3 py-1 text-xs font-medium text-ws-fg"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
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
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ws-line bg-ws-panel p-6 shadow-xs">
      <h2 className="mb-4 text-base font-semibold text-ws-fg">{title}</h2>
      <div className="text-sm leading-7 text-ws-muted">{children}</div>
    </section>
  );
}

function SummaryCard({ job }: { job: JobPostResponse }) {
  const tx = useWorkspaceTranslation();

  return (
    <section className="rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <BriefcaseBusiness aria-hidden="true" className="size-5" />
        </span>
        <h2 className="font-semibold text-ws-fg">{tx("Job summary")}</h2>
      </div>

      <dl className="space-y-1">
        <Fact
          icon={<WalletCards aria-hidden="true" className="size-4" />}
          label={tx("Salary")}
          value={formatSalary(job)}
        />
        <Fact
          icon={<MapPin aria-hidden="true" className="size-4" />}
          label={tx("Location")}
          value={job.location}
        />
        <Fact
          icon={<Clock3 aria-hidden="true" className="size-4" />}
          label={tx("Mode & type")}
          value={[formatStatus(job.workMode), formatStatus(job.jobType)]
            .filter(Boolean)
            .join(" · ")}
        />
        <Fact
          icon={<BriefcaseBusiness aria-hidden="true" className="size-4" />}
          label={tx("Experience")}
          value={formatStatus(job.experienceLevel)}
        />
        <Fact
          icon={<CalendarDays aria-hidden="true" className="size-4" />}
          label={tx("Published")}
          value={formatDate(job.publishedAt)}
        />
        <Fact
          icon={<CalendarDays aria-hidden="true" className="size-4" />}
          label={tx("Expires")}
          value={formatDate(job.expiredAt)}
        />
      </dl>
    </section>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t border-ws-line py-3 first:border-t-0 first:pt-0 last:pb-0">
      <span className="mt-0.5 flex size-7 items-center justify-center rounded-lg bg-ws-card text-ws-muted">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-ws-faint">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-medium text-ws-fg">
          {value || "—"}
        </dd>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: JobPostResponse["status"] }) {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
      {formatStatus(status)}
    </span>
  );
}

function formatSalary(job: JobPostResponse) {
  if (!job.salaryMin && !job.salaryMax) return "—";
  if (job.salaryMin && job.salaryMax) {
    return `${formatMoney(job.salaryMin, "USD")} - ${formatMoney(job.salaryMax, "USD")}`;
  }
  return formatMoney(job.salaryMin || job.salaryMax, "USD");
}

function formatStatus(value?: string | null) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}
