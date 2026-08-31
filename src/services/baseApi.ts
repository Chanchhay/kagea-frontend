import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse, Page, PagedModel } from "@/contracts";

export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  if (!response.success) throw new Error(response.message);
  return response.data;
}

/**
 * Flattens the backend's `PagedModel` into the `Page` shape the screens read.
 *
 * Kept in one place so a pager never has to know that `totalPages` lives a
 * level down; the derived flags (`first`, `last`, `empty`) are computed here
 * rather than trusted from the wire, because the DTO shape does not send them.
 */
export function normalizePage<T>(payload: PagedModel<T>): Page<T> {
  const { number, size, totalElements, totalPages } = payload.page;
  const numberOfElements = payload.content.length;
  const emptySort = { empty: true, sorted: false, unsorted: true };

  return {
    content: payload.content,
    number,
    size,
    totalElements,
    totalPages,
    numberOfElements,
    first: number === 0,
    last: totalPages === 0 || number >= totalPages - 1,
    empty: numberOfElements === 0,
    sort: emptySort,
    pageable: {
      offset: number * size,
      paged: true,
      pageNumber: number,
      pageSize: size,
      sort: emptySort,
      unpaged: false,
    },
  };
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
    "FavoriteJobs",
    "HiringRecords",
    "Invoices",
    "Conversations",
    "Messages",
    "Notifications",
    "UnreadCount",
    "Skills",
    "JobSeekerProfile",
    "Resumes",
    "ResumeTemplates",
    "Portfolios",
    "Applications",
    "Interviews",
    "RecruiterProfile",
    "RecruiterCompany",
    "RecruiterProfile",
    "RecruiterJobs",
    "CompanyDocuments",
    "ForwardedApplications",
    "Talent",
  ],
  endpoints: () => ({}),
});
