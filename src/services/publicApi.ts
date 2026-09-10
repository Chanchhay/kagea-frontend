import type {
  ApiResponseListResumeTemplate,
  PublicResumeTemplateResponse,
  ApiResponseListPublicIndustryResponse,
  ApiResponseListPublicJobCategoryResponse,
  ApiResponseListPublicSkillResponse,
  ApiResponsePagePublicJobResponse,
  ApiResponsePublicJobFacetsResponse,
  ApiResponseListPublicJobInterviewPreviewResponse,
  ApiResponsePublicJobInterviewPreviewResponse,
  ApiResponsePublicJobResponse,
  PublicJobInterviewPreviewResponse,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

/**
 * Every filter is optional and they compose with AND. The array-valued ones go
 * out comma separated - `?jobType=FULL_TIME,PART_TIME` - and match any of their
 * values, which is what the checkbox groups on the job board send.
 */
export type PublicJobsQuery = {
  keyword?: string;
  location?: string;
  categoryId?: string | string[];
  skillIds?: string[];
  workMode?: string | string[];
  jobType?: string | string[];
  experienceLevel?: string | string[];
  /** Keeps jobs that can pay at least this much. */
  salaryMin?: number;
  /** Keeps jobs whose range starts at or below this. */
  salaryMax?: number;
  /** Only jobs published within this many days. */
  postedWithinDays?: number;
  page?: number;
  size?: number;
  sort?: string;
};

function unwrapPublicJobs(response: ApiResponsePagePublicJobResponse) {
  return normalizePage(unwrapApiResponse(response));
}

function unwrapPublicJobFacets(response: ApiResponsePublicJobFacetsResponse) {
  return unwrapApiResponse(response);
}

function unwrapPublicJob(response: ApiResponsePublicJobResponse) {
  return unwrapApiResponse(response);
}

function unwrapPublicSkills(response: ApiResponseListPublicSkillResponse) {
  return unwrapApiResponse(response);
}

function unwrapPublicJobCategories(
  response: ApiResponseListPublicJobCategoryResponse,
) {
  return unwrapApiResponse(response);
}

function unwrapPublicIndustries(
  response: ApiResponseListPublicIndustryResponse,
) {
  return unwrapApiResponse(response);
}

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicJobs: builder.query<
      ReturnType<typeof unwrapPublicJobs>,
      PublicJobsQuery | void
    >({
      query: (params) => ({ url: "/public/jobs", params: params ?? undefined }),
      transformResponse: unwrapPublicJobs,
      providesTags: ["PublicJobs"],
    }),
    /**
     * The filter options for a search, counted. Takes the same arguments as
     * `getPublicJobs` minus the paging, so pass the listing's own filters.
     */
    getPublicJobFacets: builder.query<
      ReturnType<typeof unwrapPublicJobFacets>,
      Omit<PublicJobsQuery, "page" | "size" | "sort"> | void
    >({
      query: (params) => ({
        url: "/public/jobs/facets",
        params: params ?? undefined,
      }),
      transformResponse: unwrapPublicJobFacets,
      providesTags: ["PublicJobs"],
    }),
    getPublicJob: builder.query<
      ReturnType<typeof unwrapPublicJob>,
      string | number
    >({
      query: (jobId) => `/public/jobs/${jobId}`,
      transformResponse: unwrapPublicJob,
      providesTags: (_result, _error, id) => [{ type: "PublicJobs", id }],
    }),
    /**
     * The interview questions a recruiter set for one job, read before the
     * visitor commits to sitting it.
     *
     * <p>Open to anyone, like the job itself: the point is to let someone
     * decide whether the interview is worth their time, and a preview behind a
     * login cannot do that.
     */
    getPublicJobInterviewQuestions: builder.query<
      PublicJobInterviewPreviewResponse,
      string
    >({
      query: (jobId) => `/public/jobs/${jobId}/interview-questions`,
      transformResponse: (
        response: ApiResponsePublicJobInterviewPreviewResponse,
      ) => unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [
        { type: "PublicJobs", id: `${id}-interview-questions` },
      ],
    }),
    /**
     * The same previews for a whole page of the board in one request.
     *
     * <p>Skipped by passing an empty list — the hook is called before the jobs
     * arrive, and a request for no jobs is one nobody needs to answer.
     */
    getPublicJobInterviewQuestionsBatch: builder.query<
      PublicJobInterviewPreviewResponse[],
      string[]
    >({
      query: (jobIds) => ({
        url: "/public/job-interview-questions",
        params: { jobIds: jobIds.join(",") },
      }),
      transformResponse: (
        response: ApiResponseListPublicJobInterviewPreviewResponse,
      ) => unwrapApiResponse(response),
      providesTags: ["PublicJobs"],
    }),
    getPublicSkills: builder.query<
      ReturnType<typeof unwrapPublicSkills>,
      void
    >({
      query: () => "/public/skills",
      transformResponse: unwrapPublicSkills,
      providesTags: ["Skills"],
    }),
    getPublicJobCategories: builder.query<
      ReturnType<typeof unwrapPublicJobCategories>,
      void
    >({
      query: () => "/public/job-categories",
      transformResponse: unwrapPublicJobCategories,
    }),
    getPublicResumeTemplates: builder.query<
      PublicResumeTemplateResponse[],
      void
    >({
      query: () => "/public/resume-templates",
      transformResponse: (response: ApiResponseListResumeTemplate) =>
        unwrapApiResponse(response),
      providesTags: ["ResumeTemplates"],
    }),
    getPublicIndustries: builder.query<
      ReturnType<typeof unwrapPublicIndustries>,
      void
    >({
      query: () => "/public/industries",
      transformResponse: unwrapPublicIndustries,
    }),
  }),
});

export const {
  useGetPublicJobsQuery,
  useGetPublicJobFacetsQuery,
  useGetPublicJobQuery,
  useGetPublicJobInterviewQuestionsQuery,
  useGetPublicJobInterviewQuestionsBatchQuery,
  useGetPublicSkillsQuery,
  useGetPublicJobCategoriesQuery,
  useGetPublicIndustriesQuery,
  useGetPublicResumeTemplatesQuery,
} = publicApi;
