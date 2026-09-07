"use client";

import Link from "next/link";
import { ArrowUpRight, Bookmark, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetPublicJobCategoriesQuery, useGetPublicJobsQuery } from "@/services/publicApi";
import { useLocale } from "@/i18n/LocaleProvider";

export default function NewestJobsSection() {
  const { t } = useLocale();
  const jobsQuery = useGetPublicJobsQuery({ size: 100, sort: "publishedAt,desc" });
  const categoriesQuery = useGetPublicJobCategoriesQuery();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(() => new Set());

  const jobs = useMemo(
    () => [...(jobsQuery.data?.content ?? [])]
      .filter((job) => categoryId === null || job.categoryId === categoryId)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    [categoryId, jobsQuery.data?.content],
  );

  return (
    <section className="mx-auto my-8 max-w-7xl px-4 py-12 sm:px-8 lg:px-10">
      <div className="text-center">
        <h2 data-reveal className="text-3xl font-bold sm:text-4xl"><span className="text-[#008A1E]">{t("landing.newestJobs.headingPrefix")} </span><span className="text-[#F3BE00]">{t("landing.newestJobs.headingHighlight")}</span><span className="text-[#008A1E]"> {t("landing.newestJobs.headingSuffix")}</span></h2>
        <p data-reveal className="mt-2 text-sm font-medium text-slate-600 dark:text-[#CBD0D5]">{t("landing.newestJobs.subtitle")}</p>
      </div>

      <div data-reveal className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex min-w-max justify-center gap-7 px-2 sm:gap-10">
          <Tab active={categoryId === null} onClick={() => setCategoryId(null)}>{t("landing.newestJobs.allTab")}</Tab>
          {(categoriesQuery.data ?? []).map((category) => <Tab key={category.id} active={categoryId === category.id} onClick={() => setCategoryId(category.id)}>{category.name}</Tab>)}
        </div>
      </div>

      {jobsQuery.isLoading || categoriesQuery.isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className={`h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-[#3E444B] dark:bg-[#22262C] ${cardVisibility(index)}`} />)}</div>
      ) : jobsQuery.isError || categoriesQuery.isError ? (
        <Message title={t("landing.newestJobs.errorTitle")} description={t("landing.newestJobs.errorDescription")} />
      ) : jobs.length === 0 ? (
        <Message title={t("landing.newestJobs.emptyTitle")} description={t("landing.newestJobs.emptyDescription")} />
      ) : (
        <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((job, index) => {
            const saved = savedJobIds.has(job.id);
            return (
              <div key={job.id} className={`min-w-0 ${cardVisibility(index)}`}>
              <article className="group flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-[#008A1E] dark:border-[#3E444B] dark:bg-[#22262C] dark:hover:border-emerald-400">
                {/* Employer */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-[#EEF8F0] text-[18px] font-medium text-[#008A1E] dark:border-[#3E444B] dark:bg-[#2B3036] dark:text-[#F3BE00]">
                      {companyInitials(job.companyName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900 dark:text-[#F5F5F5]">{job.companyName}</p>
                      <p className="mt-0.5 truncate text-slate-500 dark:text-[#929AA3]">{timeAgo(job.publishedAt, t)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`${saved ? t("common.remove") : t("common.save")} ${job.title}`}
                    aria-pressed={saved}
                    onClick={() => setSavedJobIds((current) => toggleSaved(current, job.id))}
                    className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                      saved
                        ? "text-[#008A1E] dark:text-emerald-400"
                        : "text-slate-400 hover:text-slate-700 dark:text-[#929AA3] dark:hover:text-white"
                    }`}
                  >
                    <Bookmark className={`size-5 ${saved ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Role */}
                <h3 className="mt-6 line-clamp-2 text-xl font-medium leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-[#008A1E] dark:text-white dark:group-hover:text-[#F3BE00]">
                  {job.title}
                </h3>

                <p className="mt-3 flex items-center gap-2 text-slate-500 dark:text-[#929AA3]">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">{job.location || t("landing.newestJobs.locationUnknown")}</span>
                </p>

                <div className="mt-5 mb-8 flex flex-wrap gap-2">
                  <Chip>{jobTypeLabel(job.jobType, t)}</Chip>
                  <Chip>{workModeLabel(job.workMode, t)}</Chip>
                </div>

                {/* `mt-auto` pins the footer to the bottom edge, so the Apply
                    buttons line up across the row however the titles wrap. */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-[#3E444B]">
                  <p className="min-w-0 truncate font-medium text-slate-950 dark:text-[#F5F5F5]">{salary(job.salaryMin, job.salaryMax, t)}</p>
                  <Link
                    href={`/jobs/${job.id}`}
                    aria-label={`${t("landing.newestJobs.applyFor")} ${job.title}`}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#008A1E] px-5 font-medium text-white transition-colors hover:bg-[#007018]"
                  >
                    {t("jobs.apply")}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </article>
              </div>
            );
          })}
        </div>
      )}

      {jobs.length > 0 && <div className="mt-8 text-center"><Link href="/jobs" className="inline-flex h-12 items-center rounded-xl border border-[#008A1E]/30 px-6 font-medium text-[#008A1E] transition-colors hover:border-[#008A1E] hover:bg-[#008A1E] hover:text-white dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:border-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white">{t("landing.newestJobs.viewAllJobs")} <ArrowUpRight className="ml-2 size-4" /></Link></div>}
    </section>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`text-sm font-semibold transition-colors ${active ? "text-[#008A1E] dark:text-[#F3BE00]" : "text-slate-500 hover:text-slate-800 dark:text-[#929AA3] dark:hover:text-white"}`}>{children}</button>; }
function Chip({ children }: { children: React.ReactNode }) { return <span className="inline-flex min-h-8 items-center rounded-full border border-slate-200 px-3.5 text-slate-600 dark:border-[#3E444B] dark:text-[#CBD0D5]">{children}</span>; }
function cardVisibility(index: number) { if (index < 2) return ""; if (index < 4) return "hidden sm:flex"; return "hidden lg:flex"; }
function Message({ title, description }: { title: string; description: string }) { return <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-[#3E444B] dark:bg-[#22262C]"><h3 className="font-semibold text-slate-900 dark:text-[#F5F5F5]">{title}</h3><p className="mt-2 text-sm text-slate-500 dark:text-[#929AA3]">{description}</p></div>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
const jobTypeKeys: Record<string, string> = { FULL_TIME: "jobs.fullTime", PART_TIME: "jobs.partTime", CONTRACT: "jobs.contract", INTERNSHIP: "jobs.internship" };
const workModeKeys: Record<string, string> = { REMOTE: "jobs.remote", HYBRID: "jobs.hybrid", ON_SITE: "jobs.onSite", ONSITE: "jobs.onSite" };
function jobTypeLabel(value: string | undefined, t: (key: string) => string) { if (!value) return t("jobs.job"); const key = jobTypeKeys[value.toUpperCase()]; return key ? t(key) : formatLabel(value); }
function workModeLabel(value: string | undefined, t: (key: string) => string) { if (!value) return t("jobs.flexible"); const key = workModeKeys[value.toUpperCase()]; return key ? t(key) : formatLabel(value); }
function salary(min: number | undefined, max: number | undefined, t: (key: string) => string) { if (!min && !max) return t("landing.newestJobs.salaryNegotiable"); const money = (value: number) => `$${new Intl.NumberFormat().format(value)}`; return min && max ? `${money(min)} – ${money(max)}` : min ? `${t("landing.newestJobs.salaryFrom")} ${money(min)}` : `${t("landing.newestJobs.salaryUpTo")} ${money(max!)}`; }
function companyInitials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "CO"; }
function toggleSaved(current: Set<string>, jobId: string) { const next = new Set(current); if (next.has(jobId)) next.delete(jobId); else next.add(jobId); return next; }
function timeAgo(value: string, t: (key: string) => string) { const time = Date.parse(value); if (Number.isNaN(time)) return t("landing.newestJobs.time.recently"); const days = Math.max(0, Math.floor((Date.now() - time) / 86_400_000)); if (days === 0) return t("landing.newestJobs.time.today"); if (days === 1) return t("landing.newestJobs.time.oneDayAgo"); if (days < 30) return `${days} ${t("landing.newestJobs.time.daysAgo")}`; const months = Math.floor(days / 30); return months === 1 ? t("landing.newestJobs.time.oneMonthAgo") : `${months} ${t("landing.newestJobs.time.monthsAgo")}`; }
