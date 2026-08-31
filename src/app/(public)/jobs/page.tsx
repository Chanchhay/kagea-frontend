"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Bookmark, BriefcaseBusiness, MapPin, Search, SlidersHorizontal } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { ErrorState } from "@/components/shared/ErrorState";
import { jobTypeOptions, workModeOptions } from "@/lib/job-options";
import { useGetPublicJobCategoriesQuery, useGetPublicJobsQuery } from "@/services/publicApi";

type SortOrder = "newest" | "salary" | "title";

export default function PublicJobsPage() {
  const jobsQuery = useGetPublicJobsQuery({ size: 100, sort: "publishedAt,desc" });
  const categoriesQuery = useGetPublicJobCategoriesQuery();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [minimumSalary, setMinimumSalary] = useState(0);
  const [jobTypes, setJobTypes] = useState<Set<string>>(() => new Set());
  const [workModes, setWorkModes] = useState<Set<string>>(() => new Set());
  const [categoryIds, setCategoryIds] = useState<Set<number>>(() => new Set());
  const [savedJobs, setSavedJobs] = useState<Set<number>>(() => new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compactSearchVisible, setCompactSearchVisible] = useState(false);
  const searchPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const searchPanel = searchPanelRef.current;
    if (!searchPanel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCompactSearchVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 72),
      { threshold: 0 },
    );
    observer.observe(searchPanel);

    return () => observer.disconnect();
  }, []);

  const jobs = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    const place = location.trim().toLowerCase();
    const filtered = (jobsQuery.data?.content ?? []).filter((job) => {
      const searchable = [job.title, job.companyName, job.categoryName, job.description].filter(Boolean).join(" ").toLowerCase();
      return (!term || searchable.includes(term) || job.skills?.some((skill) => skill.skillName.toLowerCase().includes(term))) &&
        (!place || job.location?.toLowerCase().includes(place) || job.workMode?.toLowerCase().includes(place)) &&
        (!experience || job.experienceLevel === experience) &&
        (!minimumSalary || (job.salaryMax ?? 0) >= minimumSalary) &&
        (!jobTypes.size || jobTypes.has(job.jobType)) &&
        (!workModes.size || workModes.has(job.workMode)) &&
        (!categoryIds.size || categoryIds.has(job.categoryId));
    });
    return filtered.sort((a, b) => sortOrder === "salary" ? (b.salaryMax ?? 0) - (a.salaryMax ?? 0) : sortOrder === "title" ? a.title.localeCompare(b.title) : Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  }, [categoryIds, experience, jobTypes, jobsQuery.data?.content, keyword, location, minimumSalary, sortOrder, workModes]);

  const clearFilters = () => {
    setKeyword(""); setLocation(""); setExperience(""); setMinimumSalary(0);
    setJobTypes(new Set()); setWorkModes(new Set()); setCategoryIds(new Set());
  };

  return (
    <PublicShell>
      <main className="min-h-screen bg-[#FCFCFC] text-slate-950 dark:bg-[#0B0F19] dark:text-white">
        <div className="mx-auto max-w-352 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          <section ref={searchPanelRef} aria-label="Search jobs" className="relative grid gap-2 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white/95 p-2 shadow-[0_18px_50px_-28px_rgba(15,23,42,.35)] backdrop-blur-xl md:grid-cols-[1.2fr_1.15fr_1fr_1.25fr_auto] md:items-stretch dark:border-[#303741] dark:bg-[#151A24]/95 dark:shadow-[0_22px_55px_-30px_rgba(0,0,0,.9)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-[#1FA628]/65 to-transparent" />
            <SearchField icon={Search} label="Job title or keyword" value={keyword} onChange={setKeyword} />
            <SearchField icon={MapPin} label="Location" value={location} onChange={setLocation} />
            <label className="group flex min-h-15 items-center gap-3 rounded-2xl px-3.5 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-[#1D232E] dark:focus-within:bg-[#1D232E]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-focus-within:bg-[#E9F7EB] group-focus-within:text-[#1FA628] dark:bg-[#242B35] dark:text-[#929AA3] dark:group-focus-within:bg-[#1FA628]/10 dark:group-focus-within:text-[#75D47C]"><BriefcaseBusiness className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.08em] text-slate-400 dark:text-[#7F8995]">Experience</span>
              <select value={experience} onChange={(event) => setExperience(event.target.value)} className="mt-0.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-800 outline-none [&>option]:bg-white [&>option]:text-slate-800 dark:text-[#F5F5F5] dark:[color-scheme:dark] dark:[&>option]:bg-[#1D232E] dark:[&>option]:text-[#F5F5F5]">
                <option value="">Any experience</option><option value="ENTRY">Entry level</option><option value="JUNIOR">Junior</option><option value="MID">Mid level</option><option value="SENIOR">Senior</option><option value="LEAD">Lead</option>
              </select></span>
            </label>
            <label className="flex min-h-15 flex-col justify-center rounded-2xl px-4 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-[#1D232E] dark:focus-within:bg-[#1D232E]">
              <span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[.08em] text-slate-400 dark:text-[#7F8995]"><span>Minimum salary</span><span className="rounded-full bg-[#FFF5CE] px-2 py-0.5 text-[#9A7400] dark:bg-[#F3BE00]/12 dark:text-[#F3BE00]">${minimumSalary.toLocaleString()}</span></span>
              <input aria-label="Minimum monthly salary" type="range" min="0" max="5000" step="250" value={minimumSalary} onChange={(event) => setMinimumSalary(Number(event.target.value))} className="mt-2 h-1.5 cursor-pointer accent-[#F3BE00]" />
            </label>
            <button type="button" className="group inline-flex h-11 self-center items-center justify-center gap-2 rounded-xl bg-[#159B23] px-5 text-xs font-semibold text-white shadow-[0_8px_18px_-11px_rgba(21,155,35,.9)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#0F861C] hover:shadow-[0_12px_22px_-12px_rgba(21,155,35,.8)] active:translate-y-0 motion-reduce:transform-none md:mx-1"><Search className="size-3.5 transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none" />Search</button>
          </section>

          {compactSearchVisible && (
            <div className="pointer-events-none fixed inset-x-0 top-18 z-40 hidden px-8 lg:block">
              <section aria-label="Compact job search" className="pointer-events-auto mx-auto flex h-16 max-w-352 items-center gap-2 rounded-b-2xl border border-t-0 border-slate-200/80 bg-white/92 p-2 shadow-[0_16px_38px_-22px_rgba(15,23,42,.4)] backdrop-blur-xl dark:border-[#303741] dark:bg-[#151A24]/92 dark:shadow-[0_18px_42px_-22px_rgba(0,0,0,.9)]">
                <CompactSearchField icon={Search} label="Job title or keyword" value={keyword} onChange={setKeyword} />
                <div className="h-8 w-px bg-slate-200 dark:bg-[#303741]" />
                <CompactSearchField icon={MapPin} label="Location" value={location} onChange={setLocation} />
                <button type="button" className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#159B23] px-6 text-xs font-semibold text-white shadow-[0_8px_18px_-11px_rgba(21,155,35,.9)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#0F861C] hover:shadow-[0_12px_22px_-12px_rgba(21,155,35,.8)] active:translate-y-0 motion-reduce:transform-none">
                  <Search className="size-3.5" />Search
                </button>
              </section>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 lg:hidden">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold dark:border-slate-700 dark:bg-[#171C27]"><SlidersHorizontal className="size-4" />Filters</button>
            <SortSelect value={sortOrder} onChange={setSortOrder} />
          </div>

          <div className="mt-6 grid items-start gap-7 lg:mt-10 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className={`${filtersOpen ? "block" : "hidden"} rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:block lg:transition-[top] lg:duration-300 ${compactSearchVisible ? "lg:top-[152px]" : "lg:top-20"} dark:border-slate-700 dark:bg-[#171C27]`}>
              <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Filters</h2><button type="button" onClick={clearFilters} className="text-xs font-medium text-slate-600 hover:text-[#008A1E]">Clear all</button></div>
              <FilterGroup title="Job Type">{jobTypeOptions.map((option) => <FilterCheckbox key={option.value} label={option.label} checked={jobTypes.has(option.value)} onChange={() => setJobTypes(toggleSet(jobTypes, option.value))} />)}</FilterGroup>
              <FilterGroup title="Work Type">{workModeOptions.map((option) => <FilterCheckbox key={option.value} label={option.label} checked={workModes.has(option.value)} onChange={() => setWorkModes(toggleSet(workModes, option.value))} />)}</FilterGroup>
              <FilterGroup title="Job Functions">{(categoriesQuery.data ?? []).map((category) => <FilterCheckbox key={category.id} label={category.name} checked={categoryIds.has(category.id)} onChange={() => setCategoryIds(toggleSet(categoryIds, category.id))} />)}</FilterGroup>
            </aside>

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h1 className="text-xl font-bold sm:text-2xl">{keyword.trim() || "All Jobs"} <span className="text-sm font-normal text-slate-600">Search Result ({jobs.length})</span></h1>
                <div className="hidden lg:block"><SortSelect value={sortOrder} onChange={setSortOrder} /></div>
              </div>
              {jobsQuery.isLoading || categoriesQuery.isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}</div> :
                jobsQuery.isError || categoriesQuery.isError ? <ErrorState message="Unable to load published jobs." /> : jobs.length ?
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{jobs.map((job) => <JobCard key={job.id} job={job} saved={savedJobs.has(job.id)} onSave={() => setSavedJobs(toggleSet(savedJobs, job.id))} />)}</div> :
                <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-20 text-center dark:border-slate-700"><h2 className="text-lg font-bold">No matching jobs</h2><p className="mt-2 text-sm text-slate-500">Try changing or clearing your filters.</p><button type="button" onClick={clearFilters} className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-black">Clear filters</button></div>}
            </section>
          </div>
        </div>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}

function JobCard({ job, saved, onSave }: { job: PublicJobResponse; saved: boolean; onSave: () => void }) {
  return (
    <article className="group relative flex min-h-[205px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-[#1FA628]/60 hover:shadow-[0_20px_40px_-15px_rgba(31,166,40,0.18),0_10px_20px_-8px_rgba(15,23,42,0.06)] dark:border-[#3E444B] dark:bg-[#22262C] dark:shadow-[0_14px_32px_-18px_rgba(0,0,0,.9)] dark:hover:border-[#1FA628]/50 dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_24px_rgba(31,166,40,0.2)] will-change-transform">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-[#1FA628]/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 dark:from-[#1FA628]/[0.10]" />
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#1FA628]/15 bg-[#EEF8F0] text-[10px] font-bold tracking-wide text-[#1FA628] shadow-[inset_0_0_0_2px_white] transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-[#1FA628]/40 group-hover:shadow-[0_4px_12px_rgba(31,166,40,0.25)] dark:border-[#4A5159] dark:bg-[#2B3036] dark:text-[#F3BE00] dark:shadow-none dark:group-hover:border-[#F3BE00]/40">
            {initials(job.companyName)}
          </div>
          <button
            type="button"
            onClick={onSave}
            aria-label={`${saved ? "Remove" : "Save"} ${job.title}`}
            aria-pressed={saved}
            className={`inline-flex h-7.5 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold transition-all duration-200 active:scale-95 ${
              saved
                ? "border-[#1FA628]/20 bg-[#E8F5EA] text-[#1FA628] dark:border-[#59616A] dark:bg-[#3A4047] dark:text-white"
                : "border-slate-200 bg-[#FAFAF9] text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-700 dark:border-[#3E444B] dark:bg-[#22262C] dark:text-[#CBD0D5] dark:hover:bg-[#2B3036] dark:hover:text-white"
            }`}
          >
            {saved ? "Saved" : "Save"}
            <Bookmark className={`size-3 transition-transform duration-200 ${saved ? "fill-current scale-110" : ""}`} />
          </button>
        </div>
        <div className="mt-2.5">
          <p className="flex flex-wrap items-baseline gap-x-1.5 text-xs font-medium text-slate-900 dark:text-[#F5F5F5]">
            <span>{job.companyName}</span>
            <span className="text-[10px] font-normal text-slate-600 dark:text-slate-300">{timeAgo(job.publishedAt)}</span>
          </p>
          <h2 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug tracking-[-.015em] text-slate-950 transition-colors duration-200 group-hover:text-[#008A1E] dark:text-white dark:group-hover:text-[#F3BE00]">
            {job.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag>{formatLabel(job.jobType || "Job")}</Tag>
            <Tag>{formatLabel(job.workMode || "Flexible")}</Tag>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-2.5 dark:border-[#3E444B]">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-950 sm:text-sm dark:text-[#F5F5F5]">{salary(job.salaryMin, job.salaryMax)}</p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-600 dark:text-slate-300"><MapPin className="size-2.5 shrink-0" />{job.location || "Location not specified"}</p>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          aria-label={`Apply for ${job.title}`}
          className="group/btn relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1FA628] px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 ease-out group-hover:shadow-[0_4px_14px_rgba(31,166,40,0.35)] hover:!bg-[#F3BE00] hover:!text-slate-950 hover:!shadow-[#F3BE00]/30 active:scale-95"
        >
          Apply now
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

function SearchField({ icon: Icon, label, value, onChange }: { icon: typeof Search; label: string; value: string; onChange: (value: string) => void }) { return <label className="group flex min-h-15 items-center gap-3 rounded-2xl px-3.5 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-[#1D232E] dark:focus-within:bg-[#1D232E]"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-focus-within:bg-[#E9F7EB] group-focus-within:text-[#1FA628] dark:bg-[#242B35] dark:text-[#929AA3] dark:group-focus-within:bg-[#1FA628]/10 dark:group-focus-within:text-[#75D47C]"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.08em] text-slate-400 dark:text-[#7F8995]">{label === "Location" ? "Location" : "Search jobs"}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 dark:text-[#F5F5F5] dark:placeholder:text-[#7F8995]" /></span></label>; }
function CompactSearchField({ icon: Icon, label, value, onChange }: { icon: typeof Search; label: string; value: string; onChange: (value: string) => void }) { return <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-[#1D232E] dark:focus-within:bg-[#1D232E]"><Icon className="size-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-[#1FA628]" /><span className="min-w-0 flex-1"><span className="sr-only">{label}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-[#F5F5F5] dark:placeholder:text-[#7F8995]" /></span></label>; }
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) { return <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-700"><h3 className="mb-3 text-sm font-semibold">{title}</h3><div className="space-y-2.5">{children}</div></div>; }
function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) { return <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded accent-[#F3BE00]" />{label}</label>; }
function SortSelect({ value, onChange }: { value: SortOrder; onChange: (value: SortOrder) => void }) { return <select aria-label="Sort jobs" value={value} onChange={(event) => onChange(event.target.value as SortOrder)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-[#171C27]"><option value="newest">Newest</option><option value="salary">Highest salary</option><option value="title">Job title</option></select>; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="inline-flex min-h-6 items-center rounded-lg border border-slate-200/70 bg-[#F1F2F0] px-2.5 text-[10px] font-semibold text-slate-600 transition-all duration-200 group-hover:border-[#1FA628]/25 group-hover:bg-[#EBF7ED] group-hover:text-[#008A1E] dark:border-transparent dark:bg-[#30353B] dark:text-[#CBD0D5] dark:group-hover:border-[#F3BE00]/25 dark:group-hover:bg-[#2B3036] dark:group-hover:text-[#F3BE00]">{children}</span>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function salary(min?: number, max?: number) { if (!min && !max) return "Salary negotiable"; const money = (value: number) => `$${new Intl.NumberFormat().format(value)}`; return min && max ? `${money(min)} – ${money(max)}` : min ? `From ${money(min)}` : `Up to ${money(max!)}`; }
function timeAgo(value: string) { const time = Date.parse(value); if (Number.isNaN(time)) return "Recently"; const days = Math.max(0, Math.floor((Date.now() - time) / 86_400_000)); if (days === 0) return "Today"; if (days === 1) return "1 day ago"; if (days < 30) return `${days} days ago`; const months = Math.floor(days / 30); return `${months} ${months === 1 ? "month" : "months"} ago`; }
function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "CO"; }
function toggleSet<T>(current: Set<T>, value: T) { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next; }
