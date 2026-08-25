"use client";

import Link from "next/link";
import { ArrowUpRight, Bookmark, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { BorderTrail } from "@/components/core/border-trail";
import { useGetPublicJobCategoriesQuery, useGetPublicJobsQuery } from "@/services/publicApi";

export default function NewestJobsSection() {
  const jobsQuery = useGetPublicJobsQuery({ size: 100, sort: "publishedAt,desc" });
  const categoriesQuery = useGetPublicJobCategoriesQuery();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(() => new Set());

  const jobs = useMemo(
    () => [...(jobsQuery.data?.content ?? [])]
      .filter((job) => categoryId === null || job.categoryId === categoryId)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    [categoryId, jobsQuery.data?.content],
  );

  return (
    <section className="mx-auto my-8 max-w-7xl px-4 py-12 sm:px-8 lg:px-10">
      <div className="text-center">
        <h2 data-reveal className="text-3xl font-extrabold sm:text-4xl"><span className="text-[#008A1E]">Newest </span><span className="text-[#F3BE00]">Jobs</span><span className="text-[#008A1E]"> For You</span></h2>
        <p data-reveal className="mt-2 text-sm font-medium text-slate-600 dark:text-[#CBD0D5]">Fresh opportunities published by verified recruiters.</p>
      </div>

      <div data-reveal className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex min-w-max justify-center gap-7 px-2 sm:gap-10">
          <Tab active={categoryId === null} onClick={() => setCategoryId(null)}>All</Tab>
          {(categoriesQuery.data ?? []).map((category) => <Tab key={category.id} active={categoryId === category.id} onClick={() => setCategoryId(category.id)}>{category.name}</Tab>)}
        </div>
      </div>

      {jobsQuery.isLoading || categoriesQuery.isLoading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[240px] animate-pulse rounded-[20px] border border-slate-200 bg-white dark:border-[#3E444B] dark:bg-[#23272D]" />)}</div>
      ) : jobsQuery.isError || categoriesQuery.isError ? (
        <Message title="Unable to load jobs" description="Please refresh the page and try again." />
      ) : jobs.length === 0 ? (
        <Message title="No published jobs" description="There are no jobs in this category yet." />
      ) : (
        <div data-stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => {
            const saved = savedJobIds.has(job.id);
            return (
              <article key={job.id} className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-4.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,.08)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#1FA628]/50 hover:shadow-[0_14px_30px_-6px_rgba(15,23,42,.12)] dark:border-[#3E444B] dark:bg-[#23272D] dark:shadow-[0_14px_32px_-18px_rgba(0,0,0,.9)] dark:hover:border-[#59616A] sm:p-5">
                <BorderTrail
                  className="bg-linear-to-r from-transparent via-[#1FA628] to-[#F3BE00] shadow-[0_0_8px_rgba(31,166,40,.55)] dark:via-[#1FA628] dark:to-[#F3BE00] dark:shadow-[0_0_10px_rgba(243,190,0,.45)]"
                  size={80}
                  duration={6}
                  delay={index * -0.55}
                />
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#1FA628]/15 bg-[#EEF8F0] text-[11px] font-black tracking-wide text-[#1FA628] shadow-[inset_0_0_0_2px_white] dark:border-[#4A5159] dark:bg-[#2B3036] dark:text-[#F3BE00] dark:shadow-none">{companyInitials(job.companyName)}</div>
                    <button type="button" aria-label={`${saved ? "Remove" : "Save"} ${job.title}`} aria-pressed={saved} onClick={() => setSavedJobIds((current) => toggleSaved(current, job.id))} className={`inline-flex h-7.5 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold transition-colors ${saved ? "border-[#1FA628]/20 bg-[#E8F5EA] text-[#1FA628] dark:border-[#59616A] dark:bg-[#3A4047] dark:text-white" : "border-slate-200 bg-[#FAFAF9] text-slate-500 hover:border-slate-300 hover:bg-white dark:border-[#3E444B] dark:bg-[#23272D] dark:text-[#CBD0D5] dark:hover:bg-[#2B3036]"}`}>
                      {saved ? "Saved" : "Save"}<Bookmark className={`size-3 ${saved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <p className="flex flex-wrap items-baseline gap-x-1.5 text-xs font-semibold text-slate-900 dark:text-[#F5F5F5]"><span>{job.companyName}</span><span className="text-[10px] font-normal text-slate-400 dark:text-[#929AA3]">{timeAgo(job.publishedAt)}</span></p>
                    <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug tracking-[-.015em] text-slate-950 dark:text-white">{job.title}</h3>
                    <div className="mt-2.5 flex flex-wrap gap-1.5"><Chip>{formatLabel(job.jobType || "Job")}</Chip><Chip>{formatLabel(job.workMode || "Flexible")}</Chip></div>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3 dark:border-[#3E444B]">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-bold text-slate-950 dark:text-[#F5F5F5]">{salary(job.salaryMin, job.salaryMax)}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-400 dark:text-[#929AA3]"><MapPin className="size-2.5 shrink-0" />{job.location || "Location not specified"}</p>
                  </div>
                  <Link href={`/jobs/${job.id}`} aria-label={`Apply for ${job.title}`} className="group/btn relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1FA628] px-3.5 text-xs font-bold text-white shadow-sm transition-all duration-300 ease-out hover:bg-[#F3BE00] hover:text-slate-950 hover:shadow-md hover:shadow-[#F3BE00]/20 active:scale-95">Apply now<ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {jobs.length > 0 && <div className="mt-8 text-center"><Link href="/jobs" className="inline-flex h-11 items-center rounded-full border border-[#008A1E] bg-white px-6 text-sm font-semibold text-[#008A1E] transition-colors hover:bg-[#008A1E] hover:text-white dark:bg-[#23272D] dark:text-[#F5F5F5] dark:hover:bg-[#008A1E]">View all jobs <ArrowUpRight className="ml-2 size-4" /></Link></div>}
    </section>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`text-sm font-semibold transition-colors ${active ? "text-[#008A1E] dark:text-[#F3BE00]" : "text-slate-500 hover:text-slate-800 dark:text-[#929AA3] dark:hover:text-white"}`}>{children}</button>; }
function Chip({ children }: { children: React.ReactNode }) { return <span className="inline-flex min-h-7 items-center rounded-lg border border-slate-200/70 bg-[#F1F2F0] px-3 text-[11px] font-semibold text-slate-600 dark:border-transparent dark:bg-[#30353B] dark:text-[#CBD0D5]">{children}</span>; }
function Message({ title, description }: { title: string; description: string }) { return <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-[#3E444B] dark:bg-[#23272D]"><h3 className="font-semibold text-slate-900 dark:text-[#F5F5F5]">{title}</h3><p className="mt-2 text-sm text-slate-500 dark:text-[#929AA3]">{description}</p></div>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function salary(min?: number, max?: number) { if (!min && !max) return "Salary negotiable"; const money = (value: number) => `$${new Intl.NumberFormat().format(value)}`; return min && max ? `${money(min)} – ${money(max)}` : min ? `From ${money(min)}` : `Up to ${money(max!)}`; }
function companyInitials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "CO"; }
function toggleSaved(current: Set<number>, jobId: number) { const next = new Set(current); if (next.has(jobId)) next.delete(jobId); else next.add(jobId); return next; }
function timeAgo(value: string) { const time = Date.parse(value); if (Number.isNaN(time)) return "Recently"; const days = Math.max(0, Math.floor((Date.now() - time) / 86_400_000)); if (days === 0) return "Today"; if (days === 1) return "1 day ago"; if (days < 30) return `${days} days ago`; const months = Math.floor(days / 30); return `${months} ${months === 1 ? "month" : "months"} ago`; }
