import type {
  AiInterviewResultResponse,
  AiInterviewSessionResponse,
  ApiResponseAiInterviewResultResponse,
  ApiResponseAiInterviewSessionResponse,
  ApiResponseGuestInterviewAvailability,
  ApiResponseGuestInterviewStart,
  GuestInterviewAvailabilityResponse,
  GuestInterviewStartResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";
import { readGuestToken } from "@/lib/guest-token";

/**
 * The signed-out interview.
 *
 * Every call attaches the guest token by hand rather than through a global
 * `prepareHeaders`: it is a bearer secret for exactly these endpoints, and
 * sending it on every request the app makes would leak it to endpoints that
 * have no business seeing it.
 */
const guestHeaders = () => {
  const token = readGuestToken();
  return token ? { "X-Guest-Token": token } : undefined;
};

export const guestInterviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGuestInterviewAvailability: builder.query<
      GuestInterviewAvailabilityResponse,
      void
    >({
      query: () => ({
        url: "/public/guest-interviews/availability",
        headers: guestHeaders(),
      }),
      transformResponse: (response: ApiResponseGuestInterviewAvailability) =>
        unwrapApiResponse(response),
      providesTags: ["GuestInterview"],
    }),
    startGuestInterview: builder.mutation<GuestInterviewStartResponse, number>({
      query: (jobId) => ({
        url: `/public/guest-interviews/jobs/${jobId}`,
        method: "POST",
        headers: guestHeaders(),
      }),
      transformResponse: (response: ApiResponseGuestInterviewStart) =>
        unwrapApiResponse(response),
      invalidatesTags: ["GuestInterview"],
    }),
    getGuestInterview: builder.query<AiInterviewSessionResponse, number>({
      query: (sessionId) => ({
        url: `/public/guest-interviews/${sessionId}`,
        headers: guestHeaders(),
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "GuestInterview", id }],
    }),
    beginGuestInterview: builder.mutation<AiInterviewSessionResponse, number>({
      query: (sessionId) => ({
        url: `/public/guest-interviews/${sessionId}/start`,
        method: "POST",
        headers: guestHeaders(),
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, id) => [{ type: "GuestInterview", id }],
    }),
    answerGuestInterview: builder.mutation<
      AiInterviewSessionResponse,
      { sessionId: number; questionId: number; answerText: string }
    >({
      query: ({ sessionId, questionId, answerText }) => ({
        url: `/public/guest-interviews/${sessionId}/questions/${questionId}/answer`,
        method: "PUT",
        headers: guestHeaders(),
        body: { answerText },
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "GuestInterview", id: sessionId },
      ],
    }),
    /** Attaches the voice call speaking this interview. */
    bindGuestVoiceCall: builder.mutation<
      AiInterviewSessionResponse,
      { sessionId: number; callId: string }
    >({
      query: ({ sessionId, callId }) => ({
        url: `/public/guest-interviews/${sessionId}/vapi-call`,
        method: "PUT",
        headers: guestHeaders(),
        body: { callId },
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
    }),
    submitGuestVoiceTranscript: builder.mutation<
      AiInterviewSessionResponse,
      { sessionId: number; turns: { role: string; text: string }[] }
    >({
      query: ({ sessionId, turns }) => ({
        url: `/public/guest-interviews/${sessionId}/transcript`,
        method: "POST",
        headers: guestHeaders(),
        body: { turns },
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "GuestInterview", id: sessionId },
      ],
    }),
    completeGuestInterview: builder.mutation<AiInterviewResultResponse, number>({
      query: (sessionId) => ({
        url: `/public/guest-interviews/${sessionId}/complete`,
        method: "POST",
        headers: guestHeaders(),
      }),
      transformResponse: (response: ApiResponseAiInterviewResultResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["GuestInterview"],
    }),
  }),
});

export const {
  useBindGuestVoiceCallMutation,
  useSubmitGuestVoiceTranscriptMutation,
  useGetGuestInterviewAvailabilityQuery,
  useStartGuestInterviewMutation,
  useGetGuestInterviewQuery,
  useBeginGuestInterviewMutation,
  useAnswerGuestInterviewMutation,
  useCompleteGuestInterviewMutation,
} = guestInterviewApi;
