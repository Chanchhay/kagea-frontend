"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import type { PublicJobResponse } from "@/contracts";
import { markdownToPlainText } from "@/lib/markdown";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import DecorativeBackground from "@/components/landing-page/DecorativeBackground";
import { ScrollReveal } from "@/components/landing-page/shared/ScrollReveal";
import { PublicJobCatalog } from "@/components/public/PublicJobCatalog";
import { ApplyJobDialog } from "@/components/public/ApplyJobDialog";
import {
  formatDate,
  formatEnum,
  formatSalary,
} from "@/components/public/PublicJobCard";
import { PageContainer } from "@/components/shared/PageContainer";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  useGetPublicJobCategoriesQuery,
  useGetPublicJobsQuery,
  useGetPublicSkillsQuery,
  useGetPublicIndustriesQuery,
} from "@/services/publicApi";

export default function PublicJobsPage() {
  const jobsQuery = useGetPublicJobsQuery({
    size: 100,
    sort: "publishedAt,desc",
  });
  const categories = useGetPublicJobCategoriesQuery();
  const skills = useGetPublicSkillsQuery();
  const industries = useGetPublicIndustriesQuery();

  const [keyword, setKeyword] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  /*
   * The selection is held by id, not by list index: filtering rebuilds the
   * array, and an index would silently point at a different job — or past the
   * end of it — the moment the keyword changes.
   */
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const jobs = useMemo(
    () => jobsQuery.data?.content ?? [],
    [jobsQuery.data?.content],
  );

  const filteredJobs = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    const place = locationTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesCategory = categoryId === null || job.categoryId === categoryId;

      const matchesTerm =
        term === "" ||
        [job.title, job.companyName, job.categoryName, job.description].some(
          (field) => field?.toLowerCase().includes(term),
        ) ||
        job.skills?.some((skill) =>
          skill.skillName?.toLowerCase().includes(term),
        );

      const matchesPlace =
        place === "" ||
        job.location?.toLowerCase().includes(place) ||
        job.workMode?.toLowerCase().includes(place);

      return matchesCategory && matchesTerm && matchesPlace;
    });
  }, [jobs, keyword, locationTerm, categoryId]);

  const activeJob =
    filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0];

  const isLoading =
    jobsQuery.isLoading ||
    categories.isLoading ||
    skills.isLoading ||
    industries.isLoading;
  const isError =
    jobsQuery.isError ||
    categories.isError ||
    skills.isError ||
    industries.isError;
  const hasFilters =
    keyword !== "" || locationTerm !== "" || categoryId !== null;

  const clearFilters = () => {
    setKeyword("");
    setLocationTerm("");
    setCategoryId(null);
  };

  return (
    <PublicShell>
      <main className="relative overflow-x-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0B0F19] dark:text-slate-50">
        <div className="pointer-events-none absolute inset-0 z-0 hidden dark:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(22,163,74,0.12),transparent_30%),radial-gradient(circle_at_72%_16%,rgba(234,179,8,0.05),transparent_18%)]" />
        </div>
        <DecorativeBackground />

        <div className="relative z-10">
          <ScrollReveal>
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
              {/* Same emerald bloom the landing hero sits inside. */}
              <div className="pointer-events-none absolute right-[8%] top-[6%] -z-10 h-104 w-104 rounded-full bg-[radial-gradient(circle,rgba(31,166,40,.14)_0%,rgba(31,166,40,.06)_45%,transparent_72%)] blur-3xl lg:h-136 lg:w-136 dark:bg-[radial-gradient(circle,rgba(39,183,51,.16)_0%,rgba(39,183,51,.06)_45%,transparent_72%)]" />

              <div className="text-center">
                <h1
                  data-reveal
                  className="text-3xl font-extrabold sm:text-4xl"
                >
                  <span className="text-[#008A1E]">Find </span>
                  <span className="text-[#F3BE00]">Your Next</span>
                  <span className="text-[#008A1E]"> Role</span>
                </h1>
                <p
                  data-reveal
                  className="mx-auto mt-2 max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Every published opening from verified recruiters, searchable in
                  one place.
                </p>
              </div>

              <div
                data-reveal
                className="mx-auto mt-8 flex max-w-4xl flex-col items-stretch gap-1.5 rounded-2xl border border-primary bg-white p-1.5 shadow-sm md:flex-row md:items-center dark:bg-slate-900"
              >
                <label className="flex w-full items-center gap-2.5 border-b border-slate-100 px-3 py-2.5 md:flex-[1.4] md:border-b-0 md:border-r dark:border-slate-800">
                  <Search
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[#008A1E]"
                  />
                  <span className="sr-only">Search jobs</span>
                  <input
                    type="search"
                    placeholder="Search by title, company, or skill"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                  />
                </label>

                <label className="flex w-full items-center gap-2.5 px-3 py-2.5 md:flex-1">
                  <MapPin
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[#F3BE00]"
                  />
                  <span className="sr-only">Filter by location</span>
                  <input
                    type="search"
                    placeholder="Location or work mode"
                    value={locationTerm}
                    onChange={(event) => setLocationTerm(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                  />
                </label>

                {/* Results update as you type, so the affordance here is undoing
                 * the filters rather than submitting them. */}
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#008A1E] bg-white px-6 text-sm font-semibold text-[#008A1E] transition-colors hover:bg-[#008A1E] hover:text-white dark:bg-slate-900"
                  >
                    <X aria-hidden="true" className="size-4" /> Clear
                  </button>
                ) : null}
              </div>

              {(categories.data ?? []).length > 0 ? (
                <div
                  data-reveal
                  className="mt-8 overflow-x-auto border-b border-slate-200 dark:border-slate-700"
                >
                  <div className="flex min-w-max justify-center gap-7 px-2 sm:gap-10">
                    <Tab
                      active={categoryId === null}
                      onClick={() => setCategoryId(null)}
                    >
                      All
                    </Tab>
                    {(categories.data ?? []).map((category) => (
                      <Tab
                        key={category.id}
                        active={categoryId === category.id}
                        onClick={() => setCategoryId(category.id)}
                      >
                        {category.name}
                      </Tab>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </ScrollReveal>

          <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  />
                ))}
              </div>
            ) : isError ? (
              <ErrorState message="Unable to load published jobs." />
            ) : filteredJobs.length === 0 ? (
              <Message
                title="No matching jobs"
                description="Try a different keyword, or clear the filters to see every published role."
                action={
                  hasFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 inline-flex h-11 items-center rounded-full border border-[#008A1E] bg-white px-6 text-sm font-semibold text-[#008A1E] transition-colors hover:bg-[#008A1E] hover:text-white dark:bg-slate-900"
                    >
                      Clear filters
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
                <div className="overflow-hidden rounded-2xl border border-primary bg-white shadow-sm lg:col-span-5 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Open roles
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {filteredJobs.length}{" "}
                      {filteredJobs.length === 1 ? "job" : "jobs"}
                    </span>
                  </div>

                  <ul className="max-h-180 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                    {filteredJobs.map((job) => (
                      <JobListRow
                        key={job.id}
                        job={job}
                        selected={job.id === activeJob?.id}
                        onSelect={() => setSelectedJobId(job.id)}
                      />
                    ))}
                  </ul>
                </div>

                <div className="min-h-145 rounded-2xl border border-primary bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:col-span-7 lg:p-8 dark:bg-slate-900">
                  <AnimatePresence mode="wait">
                    {activeJob ? (
                      <JobDetailPanel key={activeJob.id} job={activeJob} />
                    ) : (
                      <p className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                        Select a job on the left to review the details.
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </section>

          {/* Category / skill / industry catalog carried over from the previous
           * jobs page — it is the only browse-by-taxonomy entry point. */}
          <ScrollReveal delay={0.08} direction="right">
            <PageContainer className="pb-14">
              <PublicJobCatalog
                categories={categories.data ?? []}
                skills={skills.data ?? []}
                industries={industries.data ?? []}
              />
            </PageContainer>
          </ScrollReveal>
        </div>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}

function JobListRow({
  job,
  selected,
  onSelect,
}: {
  job: PublicJobResponse;
  selected: boolean;
  onSelect: () => void;
}) {
  const salary = formatSalary(job);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className={`w-full border-l-4 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008A1E] ${
          selected
            ? "border-l-[#008A1E] bg-[#008A1E]/6 dark:bg-[#008A1E]/15"
            : "border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {job.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-medium text-[#008A1E]">
              <BriefcaseBusiness aria-hidden="true" className="size-4 shrink-0" />
              {job.companyName}
            </p>
            <p className="mt-2 flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {job.location || formatEnum(job.workMode)}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {formatDate(job.publishedAt)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip>{formatEnum(job.jobType)}</Chip>
          <Chip>{formatEnum(job.workMode)}</Chip>
          <span className="ml-auto text-sm font-bold text-slate-900 dark:text-white">
            {salary ?? "Negotiable"}
          </span>
        </div>
      </button>
    </li>
  );
}

function JobDetailPanel({ job }: { job: PublicJobResponse }) {
  const salary = formatSalary(job);
  const summary = markdownToPlainText(job.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <Chip>{formatEnum(job.jobType)}</Chip>
          <Chip>{formatEnum(job.workMode)}</Chip>
          {job.categoryName ? <Chip>{job.categoryName}</Chip> : null}
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {job.title}
        </h2>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#008A1E]">
          <BriefcaseBusiness aria-hidden="true" className="size-4" />
          {job.companyName}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-4" />
            {job.location || formatEnum(job.workMode)}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-4" />
            Posted {formatDate(job.publishedAt)}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex h-11 items-center rounded-full bg-[#008A1E] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(36,169,68,.28)] transition-colors hover:bg-[#007018]"
          >
            View details
            <ArrowUpRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
          {/* Carries its own sign-in path and AI-interview action for guests. */}
          <ApplyJobDialog jobId={job.id} jobTitle={job.title} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-800/40">
        <JobFact label="Compensation" value={salary ?? "Negotiable"} accent />
        <JobFact label="Experience" value={formatEnum(job.experienceLevel)} />
        <JobFact label="Employment" value={formatEnum(job.jobType)} />
        <JobFact label="Work mode" value={formatEnum(job.workMode)} />
        <JobFact label="Category" value={job.categoryName} />
        <JobFact label="Closes" value={formatDate(job.expiredAt)} />
      </dl>

      {summary ? (
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Job description
          </h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {summary}
          </p>
        </div>
      ) : null}

      {job.skills?.length ? (
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Required skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Chip key={skill.skillId ?? skill.skillName}>
                {skill.skillName}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-3 text-sm font-semibold transition-colors ${
        active
          ? "text-[#008A1E]"
          : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
      }`}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#008A1E]" />
      ) : null}
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      {children}
    </span>
  );
}

function Message({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}

function JobFact({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm font-bold ${
          accent ? "text-[#008A1E]" : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
