import type {
  ApiResponseListResumeTemplate,
  PublicResumeTemplateResponse,
  ApiResponseListPublicIndustryResponse,
  ApiResponseListPublicJobCategoryResponse,
  ApiResponseListPublicSkillResponse,
  ApiResponsePagePublicJobResponse,
  ApiResponsePublicJobFacetsResponse,
  ApiResponsePublicJobResponse,
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
  useGetPublicSkillsQuery,
  useGetPublicJobCategoriesQuery,
  useGetPublicIndustriesQuery,
  useGetPublicResumeTemplatesQuery,
} = publicApi;
