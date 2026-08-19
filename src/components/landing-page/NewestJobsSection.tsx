"use client";

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetPublicJobCategoriesQuery, useGetPublicJobsQuery } from "@/services/publicApi";

export default function NewestJobsSection() {
  const jobsQuery = useGetPublicJobsQuery({ size: 100, sort: "publishedAt,desc" });
  const categoriesQuery = useGetPublicJobCategoriesQuery();
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const jobs = useMemo(() => [...(jobsQuery.data?.content ?? [])]
    .filter((job) => categoryId === null || job.categoryId === categoryId)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)), [categoryId, jobsQuery.data?.content]);

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="text-center"><h2 data-reveal className="text-3xl font-extrabold sm:text-4xl"><span className="text-[#008A1E]">Newest </span><span className="text-[#F3BE00]">Jobs</span><span className="text-[#008A1E]"> For You</span></h2><p data-reveal className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Fresh opportunities published by verified recruiters.</p></div>

    <div data-reveal className="mt-8 overflow-x-auto border-b border-slate-200 dark:border-slate-700"><div className="flex min-w-max justify-center gap-7 px-2 sm:gap-10">
      <Tab active={categoryId === null} onClick={() => setCategoryId(null)}>All</Tab>
      {(categoriesQuery.data ?? []).map((category) => <Tab key={category.id} active={categoryId === category.id} onClick={() => setCategoryId(category.id)}>{category.name}</Tab>)}
    </div></div>

    {jobsQuery.isLoading || categoriesQuery.isLoading ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div>
      : jobsQuery.isError || categoriesQuery.isError ? <Message title="Unable to load jobs" description="Please refresh the page and try again." />
      : jobs.length === 0 ? <Message title="No published jobs" description="There are no jobs in this category yet." />
      : <div data-stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{jobs.map((job) => <article key={job.id} className="group flex min-h-64 flex-col rounded-2xl border border-primary bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-primary dark:bg-slate-900">
        <div className="flex flex-wrap gap-2"><Chip>{formatLabel(job.jobType || "Job")}</Chip><Chip>{formatLabel(job.workMode || "Flexible")}</Chip>{job.categoryName && <Chip>{job.categoryName}</Chip>}</div>
        <div className="mt-6 flex-1"><h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{job.title}</h3><p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#008A1E]"><BriefcaseBusiness className="size-4" />{job.companyName}</p><p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><MapPin className="size-4" />{job.location || "Location not specified"}</p></div>
        <div className="mt-6 flex items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800"><div><p className="text-sm font-bold text-slate-900 dark:text-white">{salary(job.salaryMin, job.salaryMax)}</p>{job.expiredAt && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="size-3.5" />Closes {date(job.expiredAt)}</p>}</div><Link href={`/jobs/${job.id}`} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#008A1E] text-white transition-transform group-hover:scale-105" aria-label={`View ${job.title}`}><ArrowUpRight className="size-4" /></Link></div>
      </article>)}</div>}

    {jobs.length > 0 && <div className="mt-8 text-center"><Link href="/jobs" className="inline-flex h-11 items-center rounded-full border border-[#008A1E] bg-white px-6 text-sm font-semibold text-[#008A1E] transition-colors hover:bg-[#008A1E] hover:text-white dark:bg-slate-900">View all jobs <ArrowUpRight className="ml-2 size-4" /></Link></div>}
  </section>;
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`relative pb-3 text-sm font-semibold transition-colors ${active ? "text-[#008A1E]" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"}`}>{children}{active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#008A1E]" />}</button>; }
function Chip({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{children}</span>; }
function Message({ title, description }: { title: string; description: string }) { return <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900"><h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3><p className="mt-2 text-sm text-slate-500">{description}</p></div>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function salary(min?: number, max?: number) { if (!min && !max) return "Salary negotiable"; const money = (value: number) => `$${new Intl.NumberFormat().format(value)}`; return min && max ? `${money(min)} – ${money(max)}` : min ? `From ${money(min)}` : `Up to ${money(max!)}`; }
function date(value: string) { const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? "Soon" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(parsed); }
