export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PageableObject = {
  offset: number;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  unpaged: boolean;
};

export type SortObject = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

/**
 * What the backend actually sends for a paged endpoint.
 *
 * The application sets `pageSerializationMode = VIA_DTO`, so page metadata
 * arrives nested under `page` rather than flattened alongside `content`. Note
 * that `api-docs/api.json` still documents the old flat shape and is stale on
 * this point.
 */
export type PagedModel<T> = {
  content: T[];
  page: {
    size: number;
    /** Zero-based, as Spring numbers pages. */
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

/** The flattened shape the app works with, produced by `normalizePage`. */
export type Page<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  sort: SortObject;
  empty: boolean;
};

export type EntityStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export type PublicationVisibility = "PUBLIC" | "PRIVATE" | "HIDDEN";

export type InterviewStatus =
  | "PREPARING"
  | "READY"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type InterviewResult = "PASSED" | "FAILED" | "NEEDS_REVIEW";

/**
 * Where a company stands with the moderators. Mirrors the backend enum.
 *
 * `SUSPENDED` is part of that enum and so can come back from the API, but
 * nothing in the platform sets it: there is no suspend endpoint, and no
 * screen that offers the action. It is handled wherever a status is rendered
 * and is deliberately not offered as a filter.
 */
export type CompanyVerificationStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type RegistrationRole = "SEEKER" | "RECRUITER";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";

export type SalaryVisibility = "PRIVATE" | "RECRUITERS_ONLY" | "PUBLIC";

export type ApiVoid = Record<string, never>;

export type ApiResponseVoid = ApiResponse<ApiVoid>;
