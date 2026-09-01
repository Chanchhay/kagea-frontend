import type { ApiResponse, PagedModel } from "./common";

export type PublicSkillResponse = {
  id: number;
  name: string;
  skillType: string;
};

export type PublicJobCategoryResponse = {
  id: number;
  name: string;
  description: string;
};

export type PublicIndustryResponse = {
  id: number;
  name: string;
  description: string;
};

export type JobPostSectionType =
  | "DESCRIPTION"
  | "REQUIREMENT_RESPONSIBILITY"
  | "BENEFIT"
  | "QUALIFICATION"
  | "NICE_TO_HAVE"
  | "ABOUT_ROLE";

export type JobPostSectionResponse = {
  id: number;
  sectionType: JobPostSectionType;
  title: string;
  contentMarkdown: string;
  contentText: string;
  displayOrder: number;
};

export type JobPostSkillResponse = {
  id: number;
  skillId: number;
  skillName: string;
  skillType: string;
  requiredLevel: string;
};

export type PublicJobResponse = {
  id: number;
  /**
   * Null when an administrator has masked the company. The id is withheld along
   * with the name, so there is nothing to link to and no way to tell that two
   * confidential postings came from the same employer.
   */
  companyId: number | null;
  /** "Confidential company" when the company is masked. */
  companyName: string;
  /** Uploaded company logo when included by the public jobs endpoint. */
  companyLogoUrl?: string;
  /** Compatibility with APIs that expose the company field without a prefix. */
  logoUrl?: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  publishedAt: string;
  expiredAt: string;
  sections: JobPostSectionResponse[];
  skills: JobPostSkillResponse[];
  /**
   * Whether the signed-in job seeker has saved this job. `null` for anyone
   * else — anonymous visitors and recruiters — which is why these responses
   * vary per caller and must not be cached across users.
   */
  isFavorite: boolean | null;
};

/** One option a filter group can offer, and how many jobs sit behind it. */
export type PublicJobFacetValue = {
  /** Upper-cased, so `full_time` and `FULL_TIME` arrive as one option. */
  value: string;
  count: number;
};

/** A facet option that names a row - a category or a skill. */
export type PublicJobFacetOption = {
  id: number;
  name: string;
  count: number;
};

/**
 * The options the sidebar should offer for the current search.
 *
 * Each group is counted with every filter applied except its own, so ticking
 * one option never empties the group it belongs to. Only values the matching
 * jobs actually carry are returned.
 */
export type PublicJobFacetsResponse = {
  jobTypes: PublicJobFacetValue[];
  workModes: PublicJobFacetValue[];
  experienceLevels: PublicJobFacetValue[];
  categories: PublicJobFacetOption[];
  skills: PublicJobFacetOption[];
  /** Keyed by a number of days: "1", "7", "30". */
  postedWithin: PublicJobFacetValue[];
  /** Null when no matching job names a salary. */
  salaryRange: { min: number; max: number } | null;
  totalJobs: number;
};

export type ApiResponsePagePublicJobResponse = ApiResponse<
  PagedModel<PublicJobResponse>
>;

export type ApiResponsePublicJobFacetsResponse =
  ApiResponse<PublicJobFacetsResponse>;

export type ApiResponsePublicJobResponse = ApiResponse<PublicJobResponse>;

export type ApiResponseListPublicSkillResponse = ApiResponse<
  PublicSkillResponse[]
>;

export type ApiResponseListPublicJobCategoryResponse = ApiResponse<
  PublicJobCategoryResponse[]
>;

export type ApiResponseListPublicIndustryResponse = ApiResponse<
  PublicIndustryResponse[]
>;
