"use client";

import { useMemo } from "react";
import { AlertTriangle, Bot, Loader2, PhoneOff } from "lucide-react";
import type { AiInterviewQuestionResponse } from "@/contracts";
import { PlainCard } from "@/components/shared/ApiCards";
import { Button } from "@/components/ui/button";
import { isVapiConfigured } from "@/lib/vapi";
import { useVapiInterview } from "@/components/job-seeker/useVapiInterview";

type VoiceInterviewPanelProps = {
  sessionId: number;
  /** Unanswered questions in display order. */
  questions: AiInterviewQuestionResponse[];
  candidateName: string;
  candidateAvatarUrl?: string;
  jobTitle: string;
  onSwitchToTyping: () => void;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function VoiceInterviewPanel({
  sessionId,
  questions,
  candidateName,
  candidateAvatarUrl,
  jobTitle,
  onSwitchToTyping,
}: VoiceInterviewPanelProps) {
  const {
    status,
    assistantSpeaking,
    micLevel,
    micSilent,
    micMuted,
    assistantTranscript,
    candidatePartial,
    turns,
    submitFailed,
    retrySubmit,
    start,
    stop,
  } = useVapiInterview({ sessionId, questions, candidateName, jobTitle });

  const isLive = status === "live";

  // One line, not a feed. Whoever holds the floor is what the candidate needs to
  // read; the rest of the call is behind a disclosure below.
  const lastTurn = turns.length > 0 ? turns[turns.length - 1] : undefined;
  const caption = useMemo(() => {
    if (assistantSpeaking && assistantTranscript) return assistantTranscript;
    if (candidatePartial) return candidatePartial;
    return lastTurn?.text ?? "";
  }, [assistantSpeaking, assistantTranscript, candidatePartial, lastTurn]);

  if (!isVapiConfigured) {
    return (
      <PlainCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <AlertTriangle aria-hidden="true" className="size-8 text-brand" />
          <h2 className="text-lg font-semibold text-heading">
            Voice interview unavailable
          </h2>
          <p className="max-w-md text-sm leading-6 text-body">
            NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID are not
            set for this build. Answer by typing instead.
          </p>
          <Button type="button" variant="outline" onClick={onSwitchToTyping}>
            Type my answers
          </Button>
        </div>
      </PlainCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Two participants, side by side, so it reads as a call rather than a form. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <PlainCard>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="relative grid size-24 place-items-center rounded-full bg-primary/10">
              {/* Ring pulses only while the interviewer actually speaks. */}
              {assistantSpeaking ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-primary/20"
                />
              ) : null}
              <Bot aria-hidden="true" className="relative size-10 text-primary" />
            </span>
            <h3 className="text-sm font-semibold text-heading">AI Interviewer</h3>
            <p className="text-xs text-muted-fg">{jobTitle}</p>
          </div>
        </PlainCard>

        <PlainCard>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span
              className="grid size-24 place-items-center rounded-full bg-primary/15 bg-cover bg-center text-lg font-bold text-primary"
              style={
                candidateAvatarUrl
                  ? { backgroundImage: `url("${candidateAvatarUrl}")` }
                  : undefined
              }
            >
              {candidateAvatarUrl ? null : initials(candidateName)}
            </span>
            <h3 className="text-sm font-semibold text-heading">{candidateName}</h3>
            {isLive ? (
              <div
                role="meter"
                aria-valuenow={Math.round(Math.min(micLevel, 1) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Microphone input level"
                className="h-1 w-24 overflow-hidden rounded-full bg-surface-muted"
              >
                <span
                  className="block h-full rounded-full bg-brand transition-[width] duration-150"
                  style={{
                    width: micMuted ? "0%" : `${Math.min(micLevel * 400, 100)}%`,
                  }}
                />
              </div>
            ) : (
              <p className="text-xs text-muted-fg">Candidate</p>
            )}
          </div>
        </PlainCard>
      </div>

      {caption ? (
        <PlainCard>
          {/* Keyed on the text so each new line fades in rather than snapping. */}
          <p
            key={caption}
            aria-live="polite"
            className="animate-in fade-in text-center text-base leading-7 text-heading duration-500"
          >
            {caption}
          </p>
        </PlainCard>
      ) : null}

      <div className="flex flex-col items-center gap-3">
        {isLive || status === "ending" ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => void stop()}
            disabled={status === "ending"}
          >
            <PhoneOff aria-hidden="true" className="size-4" />
            End interview
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => void start()}
            disabled={status !== "idle" || questions.length === 0}
          >
            {status === "connecting" ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Connecting…
              </>
            ) : status === "scoring" ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Scoring your interview…
              </>
            ) : (
              "Start voice interview"
            )}
          </Button>
        )}

        <p aria-live="polite" className="text-xs leading-5 text-muted-fg">
          {status === "scoring"
            ? "Reading back the transcript and scoring your answers."
            : isLive
              ? micMuted
                ? "Microphone muted while the interviewer speaks"
                : "Your turn — take as long as you need"
              : `${questions.length} question${questions.length === 1 ? "" : "s"} left. Allow microphone access when prompted.`}
        </p>

        <button
          type="button"
          className="text-xs font-medium text-muted-fg underline underline-offset-4"
          onClick={onSwitchToTyping}
        >
          Type my answers instead
        </button>
      </div>

      {turns.length > 0 ? (
        <PlainCard>
          <details className="group">
            <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wide text-muted-fg marker:content-none">
              Full transcript ({turns.length})
              <span className="ml-1 font-normal normal-case group-open:hidden">
                — show
              </span>
              <span className="ml-1 hidden font-normal normal-case group-open:inline">
                — hide
              </span>
            </summary>
            <ul className="mt-4 space-y-3">
              {turns.map((turn) => (
                <li key={turn.id}>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-fg">
                    {turn.role === "interviewer" ? "Interviewer" : "You"}
                  </p>
                  <p className="mt-0.5 text-sm leading-6 text-body">{turn.text}</p>
                </li>
              ))}
            </ul>
          </details>
        </PlainCard>
      ) : null}

      {micSilent ? (
        <PlainCard>
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <h3 className="text-sm font-semibold text-heading">
                We can&apos;t hear your microphone
              </h3>
              <p className="mt-1 text-sm leading-6 text-body">
                The interviewer is waiting but no audio is reaching it. Check
                that the right input device is selected and unmuted at the
                operating-system level, or switch to typing so you don&apos;t
                lose the session.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={onSwitchToTyping}
              >
                Type my answers instead
              </Button>
            </div>
          </div>
        </PlainCard>
      ) : null}

      {submitFailed ? (
        <PlainCard>
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <h3 className="text-sm font-semibold text-heading">
                Your interview was not submitted
              </h3>
              <p className="mt-1 text-sm leading-6 text-body">
                The transcript is still held in this tab, so retrying will send
                it. Leaving the page loses it — though if the interviewer hung up
                on its own, Vapi may already have reported the call.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => void retrySubmit()}
              >
                Retry submitting
              </Button>
            </div>
          </div>
        </PlainCard>
      ) : null}
    </div>
  );
}
