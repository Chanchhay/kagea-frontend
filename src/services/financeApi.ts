import type {
  ApiResponseHiringRecord,
  ApiResponseInvoice,
  ApiResponsePageHiringRecord,
  ApiResponsePageInvoice,
  HiringRecordResponse,
  InvoiceResponse,
  Page,
  ReportHireRequest,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reportHire: builder.mutation<
      HiringRecordResponse,
      { applicationId: number; body: ReportHireRequest }
    >({
      query: ({ applicationId, body }) => ({
        url: `/recruiter/forwarded-applications/${applicationId}/hire`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseHiringRecord) =>
        unwrapApiResponse(response),
      invalidatesTags: ["HiringRecords", "ForwardedApplications"],
    }),
    getMyHiringRecords: builder.query<
      Page<HiringRecordResponse>,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/recruiter/hiring-records",
        params: { page: params?.page ?? 0, size: params?.size ?? 20 },
      }),
      transformResponse: (response: ApiResponsePageHiringRecord) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: ["HiringRecords"],
    }),
    getMyInvoices: builder.query<
      Page<InvoiceResponse>,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/recruiter/invoices",
        params: { page: params?.page ?? 0, size: params?.size ?? 20 },
      }),
      transformResponse: (response: ApiResponsePageInvoice) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: ["Invoices"],
    }),
    getMyInvoice: builder.query<InvoiceResponse, number>({
      query: (invoiceId) => `/recruiter/invoices/${invoiceId}`,
      transformResponse: (response: ApiResponseInvoice) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Invoices", id }],
    }),
  }),
});

export const {
  useReportHireMutation,
  useGetMyHiringRecordsQuery,
  useGetMyInvoicesQuery,
  useGetMyInvoiceQuery,
} = financeApi;
