import type {
  ApiResponseCurrentUserResponse,
  CurrentUserResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

/** What the gateway reports about the current browser session. */
export type SessionResponse = {
  authenticated: boolean;
  username: string | null;
  email: string | null;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Cheap "am I signed in?" check, answered by the gateway itself rather than
     * the backend, so public pages can render the signed-out navbar without
     * provoking a 401.
     *
     * Uses `queryFn` because it sits at `/bff/session`, outside the `/api/v1`
     * base URL the rest of these endpoints share.
     */
    getSession: builder.query<SessionResponse, void>({
      queryFn: async () => {
        try {
          const response = await fetch("/bff/session", {
            headers: { accept: "application/json" },
          });
          if (!response.ok) {
            return {
              data: { authenticated: false, username: null, email: null },
            };
          }
          return { data: (await response.json()) as SessionResponse };
        } catch {
          return {
            data: { authenticated: false, username: null, email: null },
          };
        }
      },
      providesTags: ["Session"],
    }),
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => "/me",
      transformResponse: (response: ApiResponseCurrentUserResponse) =>
        unwrapApiResponse(response),
      providesTags: ["CurrentUser"],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
  }),
});

export const {
  useGetSessionQuery,
  useGetCurrentUserQuery,
  useRegisterMutation,
} = authApi;
