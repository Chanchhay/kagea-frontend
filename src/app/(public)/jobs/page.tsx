"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Bookmark, BriefcaseBusiness, ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import type { PublicJobFacetOption, PublicJobFacetValue, PublicJobResponse } from "@/contracts";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { ErrorState } from "@/components/shared/ErrorState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PublicJobsQuery } from "@/services/publicApi";
import { useGetPublicJobFacetsQuery, useGetPublicJobsQuery } from "@/services/publicApi";
import { resolveFileUrl } from "@/lib/file-url";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLocale } from "@/i18n/LocaleProvider";

type SortOrder = "newest" | "salary" | "title";

const PAGE_SIZE = 12;

/** Skills shown before the group folds into a "Show all"; the API sends 25. */
const SKILLS_SHOWN = 8;

/** i18n keys for the values the API reports, keyed by the raw value. */
const knownLabelKeys: Record<string, string> = {
  FULL_TIME: "jobs.fullTime", PART_TIME: "jobs.partTime", CONTRACT: "jobs.contract", INTERNSHIP: "jobs.internship", TEMPORARY: "jobs.temporary",
  ONSITE: "jobs.onSite", HYBRID: "jobs.hybrid", REMOTE: "jobs.remote",
  ENTRY: "jobs.entryLevel", JUNIOR: "jobs.junior", MID: "jobs.midLevel", SENIOR: "jobs.senior", LEAD: "jobs.lead",
};

const postedWithinKeys: Record<string, string> = {
  "1": "findJobsPage.last24Hours",
  "7": "findJobsPage.last7Days",
  "30": "findJobsPage.last30Days",
};

const emptyFacets = {
  jobTypes: [] as PublicJobFacetValue[],
  workModes: [] as PublicJobFacetValue[],
  experienceLevels: [] as PublicJobFacetValue[],
  categories: [] as PublicJobFacetOption[],
  skills: [] as PublicJobFacetOption[],
  postedWithin: [] as PublicJobFacetValue[],
  salaryRange: null,
  totalJobs: 0,
};

/** The sort each option asks the API for. Only columns the API allows. */
const sortParams: Record<SortOrder, string> = {
  newest: "publishedAt,desc",
  salary: "salaryMax,desc",
  title: "title,asc",
};

export default function PublicJobsPage() {
  const { t } = useLocale();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [minimumSalary, setMinimumSalary] = useState(0);
  const [jobTypes, setJobTypes] = useState<Set<string>>(() => new Set());
  const [workModes, setWorkModes] = useState<Set<string>>(() => new Set());
  const [categoryIds, setCategoryIds] = useState<Set<string>>(() => new Set());
  const [skillIds, setSkillIds] = useState<Set<string>>(() => new Set());
  const [postedWithinDays, setPostedWithinDays] = useState<number | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [page, setPage] = useState(0);
  const [allSkillsShown, setAllSkillsShown] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compactSearchVisible, setCompactSearchVisible] = useState(false);
  const searchPanelRef = useRef<HTMLElement>(null);

  // Typing and dragging settle before they turn into a request; the checkbox
  // and select filters are a single deliberate click, so they go straight out.
  const debouncedKeyword = useDebouncedValue(keyword);
  const debouncedLocation = useDebouncedValue(location);
  const debouncedMinimumSalary = useDebouncedValue(minimumSalary);

  const filters: Omit<PublicJobsQuery, "page" | "size" | "sort"> = useMemo(() => ({
    keyword: debouncedKeyword.trim() || undefined,
    location: debouncedLocation.trim() || undefined,
    jobType: jobTypes.size ? [...jobTypes] : undefined,
    workMode: workModes.size ? [...workModes] : undefined,
    categoryId: categoryIds.size ? [...categoryIds] : undefined,
    skillIds: skillIds.size ? [...skillIds] : undefined,
    experienceLevel: experience || undefined,
    salaryMin: debouncedMinimumSalary || undefined,
    postedWithinDays: postedWithinDays ?? undefined,
  }), [categoryIds, debouncedKeyword, debouncedLocation, debouncedMinimumSalary, experience, jobTypes, postedWithinDays, skillIds, workModes]);

  const jobsQuery = useGetPublicJobsQuery({ ...filters, sort: sortParams[sortOrder], page, size: PAGE_SIZE });
  // The sidebar describes the same search, so it moves with the filters: every
  // group is counted against the others and options that lead nowhere are gone.
  const facetsQuery = useGetPublicJobFacetsQuery(filters);

  const facets = facetsQuery.data ?? emptyFacets;
  const jobs = jobsQuery.data?.content ?? [];
  const totalElements = jobsQuery.data?.totalElements ?? 0;
  const totalPages = jobsQuery.data?.totalPages ?? 0;
  const shownSkills = allSkillsShown ? facets.skills : facets.skills.slice(0, SKILLS_SHOWN);
  // The slider spans the salaries on offer rather than a guessed ceiling. Its
  // bounds come back with the salary filter lifted, so dragging cannot shrink
  // the track under the reader's thumb.
  const salaryCeiling = Math.max(1000, Math.ceil((facets.salaryRange?.max ?? 5000) / 250) * 250);

  /**
   * Every filter change sends the reader back to the first page: page 4 of the
   * previous result says nothing about the new one, and asking for it usually
   * lands past the end.
   */
  const changeFilter = (apply: () => void) => {
    apply();
    setPage(0);
  };

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

  const clearFilters = () => changeFilter(() => {
    setKeyword(""); setLocation(""); setExperience(""); setMinimumSalary(0);
    setJobTypes(new Set()); setWorkModes(new Set()); setCategoryIds(new Set());
    setSkillIds(new Set()); setPostedWithinDays(null);
  });

  return (
    <PublicShell>
      <main className="min-h-screen bg-white text-slate-950 dark:bg-background dark:text-heading">
        <div className="mx-auto max-w-[120rem] px-5 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16 2xl:px-24">
          <section ref={searchPanelRef} aria-label={t("findJobsPage.searchAria")} className="relative grid gap-2 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2 md:grid-cols-[1.2fr_1.15fr_1fr_1.25fr_auto] md:items-stretch dark:border-border dark:bg-surface">
            <SearchField icon={Search} topLabel={t("findJobsPage.keywordLabel")} placeholder={t("findJobsPage.keywordPlaceholder")} value={keyword} onChange={(value) => changeFilter(() => setKeyword(value))} />
            <SearchField icon={MapPin} topLabel={t("jobs.location")} placeholder={t("jobs.location")} value={location} onChange={(value) => changeFilter(() => setLocation(value))} />
            <label className="group flex min-h-15 items-center gap-3 rounded-2xl px-3.5 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-surface-muted dark:focus-within:bg-surface-muted">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-focus-within:bg-brand-wash group-focus-within:text-brand dark:bg-surface-muted dark:text-muted-fg dark:group-focus-within:bg-brand/10 dark:group-focus-within:text-[#75D47C]"><BriefcaseBusiness className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="flex h-7 items-center text-lg font-semibold uppercase tracking-[.08em] text-slate-400 dark:text-muted-fg">{t("jobs.experience")}</span>
              <Select value={experience || null} onValueChange={(value) => changeFilter(() => setExperience(value ?? ""))}>
                <SelectTrigger size="sm" className="-ml-3 w-full border-none px-3 font-medium hover:border-none focus-visible:ring-0">
                  <SelectValue placeholder={t("findJobsPage.anyExperience")} />
                </SelectTrigger>
                <SelectContent>
                  {facets.experienceLevels.map((facet) => (
                    <SelectItem key={facet.value} value={facet.value}>{labelFor(facet.value, t)} ({facet.count})</SelectItem>
                  ))}
                </SelectContent>
              </Select></span>
            </label>
            <label className="flex min-h-15 flex-col justify-center rounded-2xl px-4 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-surface-muted dark:focus-within:bg-surface-muted">
              <span className="flex h-7 items-center justify-between gap-3 text-lg font-semibold uppercase tracking-[.08em] text-slate-400 dark:text-muted-fg"><span>{t("jobs.minimumSalary")}</span><span className="rounded-full bg-[#FFF5CE] px-2 leading-6 text-warning-text dark:bg-warning/12 dark:text-warning-text">${minimumSalary.toLocaleString()}{minimumSalary === 0 ? "+" : ""}</span></span>
              <span className="flex h-10 items-center"><input aria-label={t("findJobsPage.minimumSalaryAria")} type="range" min="0" max={salaryCeiling} step="250" value={minimumSalary} onChange={(event) => changeFilter(() => setMinimumSalary(Number(event.target.value)))} className="h-1.5 w-full cursor-pointer accent-warning" /></span>
            </label>
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 self-center rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-hover md:mx-1"><Search className="size-4" />{t("findJobsPage.search")}</button>
          </section>

          {compactSearchVisible && (
            <div className="pointer-events-none fixed inset-x-0 top-18 z-40 hidden px-8 lg:block">
              <section aria-label={t("findJobsPage.compactSearchAria")} className="pointer-events-auto mx-auto flex h-16 max-w-[120rem] items-center gap-2 rounded-b-2xl border border-t-0 border-slate-200 bg-white/95 p-2 backdrop-blur-xl dark:border-border dark:bg-surface/95">
                <CompactSearchField icon={Search} label={t("findJobsPage.keywordPlaceholder")} value={keyword} onChange={(value) => changeFilter(() => setKeyword(value))} />
                <div className="h-8 w-px bg-slate-200 dark:bg-border" />
                <CompactSearchField icon={MapPin} label={t("jobs.location")} value={location} onChange={(value) => changeFilter(() => setLocation(value))} />
                <button type="button" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-hover">
                  <Search className="size-3.5" />{t("findJobsPage.search")}
                </button>
              </section>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 lg:hidden">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium dark:border-border"><SlidersHorizontal className="size-4" />{t("findJobsPage.filtersButton")}</button>
            <SortSelect value={sortOrder} onChange={(value) => changeFilter(() => setSortOrder(value))} />
          </div>

          <div className="mt-8 grid items-start gap-8 lg:mt-12 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className={`${filtersOpen ? "block" : "hidden"} rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:block lg:transition-[top] lg:duration-300 ${compactSearchVisible ? "lg:top-[152px]" : "lg:top-20"} dark:border-border dark:bg-surface`}>
              <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{t("findJobsPage.filtersButton")}</h2><button type="button" onClick={clearFilters} className="text-xs font-medium text-slate-600 hover:text-brand">{t("findJobsPage.clearAll")}</button></div>
              {/* Each group lists only what the matching jobs carry, so a
                  filter never leads to an empty result. */}
              <FilterGroup title={t("findJobsPage.jobTypeGroup")} options={facets.jobTypes.length}>
                {facets.jobTypes.map((facet) => <FilterCheckbox key={facet.value} label={labelFor(facet.value, t)} count={facet.count} checked={jobTypes.has(facet.value)} onChange={() => changeFilter(() => setJobTypes(toggleSet(jobTypes, facet.value)))} />)}
              </FilterGroup>
              <FilterGroup title={t("findJobsPage.workTypeGroup")} options={facets.workModes.length}>
                {facets.workModes.map((facet) => <FilterCheckbox key={facet.value} label={labelFor(facet.value, t)} count={facet.count} checked={workModes.has(facet.value)} onChange={() => changeFilter(() => setWorkModes(toggleSet(workModes, facet.value)))} />)}
              </FilterGroup>
              <FilterGroup title={t("findJobsPage.jobFunctionsGroup")} options={facets.categories.length}>
                {facets.categories.map((category) => <FilterCheckbox key={category.id} label={category.name} count={category.count} checked={categoryIds.has(category.id)} onChange={() => changeFilter(() => setCategoryIds(toggleSet(categoryIds, category.id)))} />)}
              </FilterGroup>
              <FilterGroup title={t("findJobsPage.skillsGroup")} options={facets.skills.length}>
                {shownSkills.map((skill) => <FilterCheckbox key={skill.id} label={skill.name} count={skill.count} checked={skillIds.has(skill.id)} onChange={() => changeFilter(() => setSkillIds(toggleSet(skillIds, skill.id)))} />)}
                {facets.skills.length > SKILLS_SHOWN ? (
                  <button type="button" onClick={() => setAllSkillsShown((shown) => !shown)} className="text-xs font-medium text-brand hover:underline">
                    {allSkillsShown ? t("findJobsPage.showFewer") : `${t("findJobsPage.showAll")} ${facets.skills.length}`}
                  </button>
                ) : null}
              </FilterGroup>
              <FilterGroup title={t("findJobsPage.datePostedGroup")} options={facets.postedWithin.length}>
                {/* One window at a time, so these behave as radios: picking the
                    one already chosen clears it. */}
                {facets.postedWithin.map((facet) => <FilterCheckbox key={facet.value} label={postedWithinKeys[facet.value] ? t(postedWithinKeys[facet.value]) : `${t("findJobsPage.datePostedGroup")} ${facet.value}`} count={facet.count} checked={postedWithinDays === Number(facet.value)} onChange={() => changeFilter(() => setPostedWithinDays(postedWithinDays === Number(facet.value) ? null : Number(facet.value)))} />)}
              </FilterGroup>
            </aside>

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h1 className="text-xl font-semibold sm:text-2xl">{keyword.trim() || t("findJobsPage.allJobs")} <span className="text-sm font-normal text-slate-600">{t("findJobsPage.searchResult")} ({totalElements})</span></h1>
                <div className="hidden lg:block"><SortSelect value={sortOrder} onChange={(value) => changeFilter(() => setSortOrder(value))} /></div>
              </div>
              {jobsQuery.isLoading || facetsQuery.isLoading ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-surface" />)}</div> :
                jobsQuery.isError || facetsQuery.isError ? <ErrorState message={t("findJobsPage.unableToLoad")} /> : jobs.length ?
                <>
                  {/* Dimmed rather than replaced while the next page loads, so
                      the grid does not collapse and jump the page under the
                      reader's cursor. */}
                  <div className={`grid gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${jobsQuery.isFetching ? "opacity-60" : ""}`} aria-busy={jobsQuery.isFetching}>{jobs.map((job) => <JobCard key={job.id} job={job} saved={savedJobs.has(job.id)} onSave={() => setSavedJobs(toggleSet(savedJobs, job.id))} />)}</div>
                  <Pagination page={page} totalPages={totalPages} totalElements={totalElements} pageSize={PAGE_SIZE} onChange={setPage} />
                </> :
                <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-20 text-center dark:border-border"><h2 className="text-lg font-semibold">{t("findJobsPage.noMatchingJobs")}</h2><p className="mt-2 text-sm text-slate-500">{t("findJobsPage.tryChangingFilters")}</p><button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover">{t("findJobsPage.clearFilters")}</button></div>}
            </section>
          </div>
        </div>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}

function JobCard({ job, saved, onSave }: { job: PublicJobResponse; saved: boolean; onSave: () => void }) {
  const { t } = useLocale();
  const logoSrc = resolveFileUrl(job.companyLogoUrl ?? job.logoUrl);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-brand dark:border-border dark:bg-surface dark:hover:border-emerald-400">
      {/* Employer */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {/*
            * `companyLogoUrl` is already the logo this viewer is allowed to
            * see — the backend swaps a masked company's own mark for the
            * stand-in an administrator set, and sends null when there is
            * neither. A real logo sits on a plain surface rather than the
            * brand wash, so a transparent mark is not tinted green; the
            * initials keep the wash as their own ground.
            */}
          <span
            className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 text-lg font-medium text-brand dark:border-border dark:text-warning-text ${
              logoSrc ? "bg-white dark:bg-surface" : "bg-brand-wash dark:bg-surface-muted"
            }`}
          >
            {logoSrc ? (
              <Image src={logoSrc} alt="" aria-hidden="true" fill unoptimized sizes="44px" className="object-contain p-1" />
            ) : (
              initials(job.companyName)
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-heading">{job.companyName}</p>
            <p className="mt-0.5 truncate text-slate-500 dark:text-slate-400">{timeAgo(job.publishedAt, t)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          aria-label={`${saved ? t("findJobsPage.remove") : t("findJobsPage.save")} ${job.title}`}
          aria-pressed={saved}
          className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
            saved
              ? "text-brand dark:text-emerald-400"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
          }`}
        >
          <Bookmark className={`size-5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Role */}
      <h2 className="mt-6 line-clamp-2 text-xl font-medium leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-brand dark:text-white dark:group-hover:text-warning-text">
        {job.title}
      </h2>

      <p className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <MapPin className="size-4 shrink-0" />
        <span className="truncate">{job.location || t("findJobsPage.locationNotSpecified")}</span>
      </p>

      <div className="mt-5 mb-8 flex flex-wrap gap-2">
        <Tag>{job.jobType ? labelFor(job.jobType, t) : t("jobs.job")}</Tag>
        <Tag>{job.workMode ? labelFor(job.workMode, t) : t("jobs.flexible")}</Tag>
      </div>

      {/* `mt-auto` keeps the footer on the card's bottom edge whatever the
          title wraps to, so a grid of cards lines its actions up. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-border">
        <p className="min-w-0 truncate font-medium text-slate-950 dark:text-heading">
          {salary(job.salaryMin, job.salaryMax, t)}
        </p>
        <Link
          href={`/jobs/${job.id}`}
          aria-label={`${t("findJobsPage.applyForAria")} ${job.title}`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {t("jobs.apply")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

/**
 * Pages the listing. Long results collapse to a window around the current page
 * with the first and last always reachable, so the control keeps its width
 * whether there are three pages or three hundred.
 */
function Pagination({ page, totalPages, totalElements, pageSize, onChange }: { page: number; totalPages: number; totalElements: number; pageSize: number; onChange: (page: number) => void }) {
  const { t } = useLocale();
  if (totalPages <= 1) return null;

  const first = page * pageSize + 1;
  const last = Math.min(totalElements, (page + 1) * pageSize);
  const around = new Set([0, totalPages - 1, page, page - 1, page + 1].filter((value) => value >= 0 && value < totalPages));
  const shown = [...around].sort((a, b) => a - b);

  return (
    <nav aria-label={t("findJobsPage.resultsPagesAria")} className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-border">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t("findJobsPage.showingResults")} <span className="font-medium text-slate-800 dark:text-heading">{first}–{last}</span> {t("findJobsPage.of")} {totalElements}
      </p>

      <div className="flex items-center gap-1.5">
        <PageButton label={t("findJobsPage.previousPage")} disabled={page === 0} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="size-4" />
        </PageButton>

        {shown.map((value, index) => (
          <span key={value} className="flex items-center gap-1.5">
            {index > 0 && value - shown[index - 1] > 1 ? <span className="px-1 text-slate-400">…</span> : null}
            <PageButton
              label={`${t("findJobsPage.page")} ${value + 1}`}
              current={value === page}
              onClick={() => onChange(value)}
            >
              {value + 1}
            </PageButton>
          </span>
        ))}

        <PageButton label={t("findJobsPage.nextPage")} disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
          <ChevronRight className="size-4" />
        </PageButton>
      </div>
    </nav>
  );
}

function PageButton({ label, children, onClick, disabled = false, current = false }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean; current?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      className={`inline-flex size-9 items-center justify-center rounded-xl border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        current
          ? "border-brand bg-brand text-white"
          : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand dark:border-border dark:text-body dark:hover:border-emerald-400 dark:hover:text-emerald-400"
      }`}
    >
      {children}
    </button>
  );
}

function SearchField({ icon: Icon, topLabel, placeholder, value, onChange }: { icon: typeof Search; topLabel: string; placeholder: string; value: string; onChange: (value: string) => void }) { return <label className="group flex min-h-15 items-center gap-3 rounded-2xl px-3.5 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-surface-muted dark:focus-within:bg-surface-muted"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-focus-within:bg-brand-wash group-focus-within:text-brand dark:bg-surface-muted dark:text-muted-fg dark:group-focus-within:bg-brand/10 dark:group-focus-within:text-[#75D47C]"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="flex h-7 items-center text-lg font-semibold uppercase tracking-[.08em] text-slate-400 dark:text-muted-fg">{topLabel}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 dark:text-heading dark:placeholder:text-muted-fg" /></span></label>; }
function CompactSearchField({ icon: Icon, label, value, onChange }: { icon: typeof Search; label: string; value: string; onChange: (value: string) => void }) { return <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 dark:hover:bg-surface-muted dark:focus-within:bg-surface-muted"><Icon className="size-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-brand" /><span className="min-w-0 flex-1"><span className="sr-only">{label}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-heading dark:placeholder:text-muted-fg" /></span></label>; }
/** Renders nothing when the search leaves the group with no options. */
function FilterGroup({ title, options, children }: { title: string; options: number; children: React.ReactNode }) {
  if (!options) return null;

  return <div className="mt-6 border-t border-slate-200 pt-5 dark:border-border"><h3 className="mb-3 text-sm font-semibold">{title}</h3><div className="space-y-2.5">{children}</div></div>;
}
function FilterCheckbox({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded accent-warning" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count === undefined ? null : <span className="shrink-0 tabular-nums text-slate-400 dark:text-slate-500">{count}</span>}
    </label>
  );
}

/** The display name for a raw API value, or a readable form of the value. */
function labelFor(value: string, t: (key: string) => string) { const key = knownLabelKeys[value]; return key ? t(key) : formatLabel(value); }

const sortOptions: { value: SortOrder; labelKey: string }[] = [
  { value: "newest", labelKey: "findJobsPage.sortNewest" },
  { value: "salary", labelKey: "findJobsPage.sortSalary" },
  { value: "title", labelKey: "findJobsPage.sortTitle" },
];

function SortSelect({ value, onChange }: { value: SortOrder; onChange: (value: SortOrder) => void }) {
  const { t } = useLocale();

  return (
    <Select value={value} onValueChange={(next) => onChange((next ?? "newest") as SortOrder)}>
      <SelectTrigger aria-label={t("findJobsPage.sortAria")} size="sm" className="w-44 bg-white font-medium dark:bg-surface">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function Tag({ children }: { children: React.ReactNode }) { return <span className="inline-flex min-h-8 items-center rounded-full border border-slate-200 px-3.5 text-slate-600 dark:border-border dark:text-body">{children}</span>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function salary(min: number | undefined, max: number | undefined, t: (key: string) => string) { if (!min && !max) return t("landing.newestJobs.salaryNegotiable"); const money = (value: number) => `$${new Intl.NumberFormat().format(value)}`; return min && max ? `${money(min)} – ${money(max)}` : min ? `${t("landing.newestJobs.salaryFrom")} ${money(min)}` : `${t("landing.newestJobs.salaryUpTo")} ${money(max!)}`; }
function timeAgo(value: string, t: (key: string) => string) { const time = Date.parse(value); if (Number.isNaN(time)) return t("landing.newestJobs.time.recently"); const days = Math.max(0, Math.floor((Date.now() - time) / 86_400_000)); if (days === 0) return t("landing.newestJobs.time.today"); if (days === 1) return t("landing.newestJobs.time.oneDayAgo"); if (days < 30) return `${days} ${t("landing.newestJobs.time.daysAgo")}`; const months = Math.floor(days / 30); return months === 1 ? t("landing.newestJobs.time.oneMonthAgo") : `${months} ${t("landing.newestJobs.time.monthsAgo")}`; }
function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "CO"; }
function toggleSet<T>(current: Set<T>, value: T) { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next; }
