import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/contracts";

export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export const baseApi = createApi({
  reducerPath: "api",
  // Same origin as the page: the Spring Cloud Gateway serves this app and
  // forwards /api/** to the backend, attaching the access token itself.
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: [
    "Session",
    "CurrentUser",
    "PublicJobs",
    "Skills",
    "JobSeekerProfile",
    "Resumes",
    "Portfolios",
    "Applications",
    "Interviews",
    "RecruiterProfile",
    "RecruiterCompany",
    "RecruiterJobs",
    "CompanyDocuments",
    "ForwardedApplications",
    "Talent",
  ],
  endpoints: () => ({}),
});
