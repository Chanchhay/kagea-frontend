/**
 * `/api/v1/public/guest-interviews` — trying an AI interview without an
 * account.
 *
 * The guest token stands in for a login. It arrives once, when the interview is
 * created, and every later call carries it in the `X-Guest-Token` header; the
 * backend answers "not found" to anyone holding the wrong one. Losing it loses
 * the interview, because there is no account to recover it from.
 */

import type { ApiResponse } from "./common";
import type { AiInterviewSessionResponse } from "./job-seeker";

export type GuestInterviewAvailabilityResponse = {
  enabled: boolean;
  attemptsUsed: number;
  attemptsAllowed: number;
  canStart: boolean;
  /** Why not, in words to show the visitor, or null when they can start. */
  blockedReason: string | null;
};

export type GuestInterviewStartResponse = {
  guestToken: string;
  attemptsUsed: number;
  attemptsAllowed: number;
  session: AiInterviewSessionResponse;
};

export type ApiResponseGuestInterviewAvailability =
  ApiResponse<GuestInterviewAvailabilityResponse>;
export type ApiResponseGuestInterviewStart =
  ApiResponse<GuestInterviewStartResponse>;
