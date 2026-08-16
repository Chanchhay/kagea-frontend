"use client";

import { useMemo, useState } from "react";
import type { PublicJobCategoryResponse, PublicJobResponse, PublicSkillResponse } from "@/contracts";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { PublicJobFilters, type PublicJobFilterValues } from "./PublicJobFilters";
import { PublicJobList } from "./PublicJobList";
import { PublicJobPagination } from "./PublicJobPagination";

type PublicJobExplorerProps = {
  jobs: PublicJobResponse[];
  categories: PublicJobCategoryResponse[];
  skills: PublicSkillResponse[];
};

const emptyFilters: PublicJobFilterValues = {
  keyword: "",
  location: "",
  categoryId: "",
  skillId: "",
  workMode: "",
  jobType: "",
  minimumSalary: "",
};

const pageSize = 5;

export function PublicJobExplorer({ jobs, categories, skills }: PublicJobExplorerProps) {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(0);

  const filteredJobs = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const minimumSalary = Number(filters.minimumSalary);

    const matchingJobs = jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        (job.title ?? "").toLowerCase().includes(keyword) ||
        (job.companyName ?? "").toLowerCase().includes(keyword) ||
        (job.skills ?? []).some((skill) => (skill.skillName ?? "").toLowerCase().includes(keyword));
      const matchesLocation = !location || (job.location ?? "").toLowerCase().includes(location);
      const matchesCategory =
        !filters.categoryId || job.categoryId === Number(filters.categoryId);
      const matchesSkill =
        !filters.skillId ||
        (job.skills ?? []).some((skill) => skill.skillId === Number(filters.skillId));
      const matchesWorkMode = !filters.workMode || job.workMode === filters.workMode;
      const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
      const offeredSalary = job.salaryMax ?? job.salaryMin;
      const matchesSalary =
        !filters.minimumSalary || (offeredSalary != null && offeredSalary >= minimumSalary);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesCategory &&
        matchesSkill &&
        matchesWorkMode &&
        matchesJobType &&
        matchesSalary
      );
    });

    return matchingJobs.sort((firstJob, secondJob) => {
      const firstPublished = Date.parse(firstJob.publishedAt ?? "");
      const secondPublished = Date.parse(secondJob.publishedAt ?? "");

      if (!Number.isNaN(firstPublished) && !Number.isNaN(secondPublished)) {
        return secondPublished - firstPublished;
      }

      // IDs are monotonic in the current API and provide a safe fallback for
      // older records that do not contain a valid publication timestamp.
      return secondJob.id - firstJob.id;
    });
  }, [filters, jobs]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleJobs = filteredJobs.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const listState = visibleJobs.length === 0 ? "empty" : "populated";

  const updateFilters = (nextFilters: PublicJobFilterValues) => {
    setFilters(nextFilters);
    setPage(0);
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    requestAnimationFrame(() => {
      document.getElementById("public-job-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Published jobs"
        description="Filter published jobs by keyword, location, category, skill, work mode, job type, and minimum salary."
      />
      <PublicJobFilters
        values={filters}
        categories={categories}
        skills={skills}
        onChange={updateFilters}
      />
      {hasActiveFilters ? (
        <p className="text-sm text-body">
          Filters active · {filteredJobs.length} matching jobs
        </p>
      ) : null}
      <div id="public-job-results" className="scroll-mt-24">
        <PublicJobList jobs={visibleJobs} state={listState} />
      </div>
      {visibleJobs.length > 0 ? (
        <PublicJobPagination
          page={safePage}
          totalPages={totalPages}
          totalItems={filteredJobs.length}
          pageSize={pageSize}
          onPageChange={changePage}
        />
      ) : null}
    </div>
  );
}
