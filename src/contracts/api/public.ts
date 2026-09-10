import type { ApiResponse, PagedModel } from "./common";

export type PublicSkillResponse = {
  id: string;
  name: string;
  skillType: string;
};

export type PublicJobCategoryResponse = {
  id: string;
  name: string;
  description: string;
};

export type PublicIndustryResponse = {
  id: string;
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
  id: string;
  sectionType: JobPostSectionType;
  title: string;
  contentMarkdown: string;
  contentText: string;
  displayOrder: number;
};

export type JobPostSkillResponse = {
  id: string;
  skillId: string;
  skillName: string;
  skillType: string;
  requiredLevel: string;
};

export type PublicJobResponse = {
  id: string;
  /**
   * Null when an administrator has masked the company. The id is withheld along
   * with the name, so there is nothing to link to and no way to tell that two
   * confidential postings came from the same employer.
   */
  companyId: string | null;
  /** "Confidential company" when the company is masked. */
  companyName: string;
  /**
   * The employer's logo. Null for a masked posting unless an administrator set
   * a stand-in for it, and null for any company that never uploaded one — so
   * the absence of a logo is ordinary, not an error.
   */
  companyLogoUrl?: string | null;
  /** Compatibility with APIs that expose the company field without a prefix. */
  logoUrl?: string;
  categoryId: string;
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
  id: string;
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

/**
 * The kinds of question an interview can ask. Mirrors the backend's
 * `InterviewQuestionType`, and `AiInterviewQuestionResponse["questionType"]` on
 * the job-seeker side: a written question is copied into the session verbatim,
 * so all three vocabularies have to stay identical.
 */
export type PublicJobInterviewQuestionType =
  | "TECHNICAL"
  | "BEHAVIORAL"
  | "SITUATIONAL"
  | "COMMUNICATION"
  | "PROBLEM_SOLVING"
  | "GENERAL";

/**
 * One question an administrator wrote for a job, as shown to a visitor *before*
 * the interview starts.
 *
 * <p>Deliberately thinner than the admin console's view of the same row: it
 * carries no `expectedAnswer`. That field is the scoring rubric, and this
 * endpoint is public — the syllabus is fair to publish, the mark scheme is not.
 */
export type PublicJobInterviewQuestionResponse = {
  id: string;
  displayOrder: number;
  questionType: PublicJobInterviewQuestionType;
  questionText: string;
  maxScore: number;
};

/**
 * What the interview for one job will cover.
 *
 * <p>`questions` holds only the questions an administrator wrote. It is shorter
 * than `questionCount` whenever the job is in `MANUAL_PLUS_AI` mode, because
 * the rest are written by the AI when the session starts and so do not exist
 * yet. Report length from `questionCount`, never from `questions.length`.
 *
 * <p>A job nobody wrote questions for comes back with an empty `questions` and
 * a non-zero `questionCount` — the interview still runs, entirely generated.
 */
export type PublicJobInterviewPreviewResponse = {
  jobId: string;
  jobTitle: string;
  /** How many questions the interview will actually ask. */
  questionCount: number;
  /** A rough sitting time, or null when the backend will not estimate one. */
  estimatedMinutes: number | null;
  questions: PublicJobInterviewQuestionResponse[];
};

export type ApiResponsePublicJobInterviewPreviewResponse =
  ApiResponse<PublicJobInterviewPreviewResponse>;

/**
 * Previews for a page of the board, in the order the ids were asked for.
 *
 * <p>Shorter than the list of ids sent when one of them has left the board
 * since the listing was drawn — match on `jobId` rather than by position.
 */
export type ApiResponseListPublicJobInterviewPreviewResponse = ApiResponse<
  PublicJobInterviewPreviewResponse[]
>;
