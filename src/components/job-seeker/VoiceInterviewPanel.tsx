"use client";

import { AlertTriangle, Loader2, Mic, MicOff, PhoneOff } from "lucide-react";
import type { AiInterviewQuestionResponse } from "@/contracts";
import { PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { Button } from "@/components/ui/button";
import { isVapiConfigured } from "@/lib/vapi";
import { useVapiInterview } from "@/components/job-seeker/useVapiInterview";

type VoiceInterviewPanelProps = {
  sessionId: number;
  /** Unanswered questions in display order. */
  questions: AiInterviewQuestionResponse[];
  candidateName: string;
  jobTitle: string;
  onSwitchToTyping: () => void;
};

export function VoiceInterviewPanel({
  sessionId,
  questions,
  candidateName,
  jobTitle,
  onSwitchToTyping,
}: VoiceInterviewPanelProps) {
  const {
    status,
    assistantSpeaking,
    volume,
    micLevel,
    micSilent,
    micMuted,
    assistantTranscript,
    currentIndex,
    turns,
    candidatePartial,
    submitFailed,
    retrySubmit,
    start,
    stop,
  } = useVapiInterview({ sessionId, questions, candidateName, jobTitle });

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

  const isLive = status === "live";
  // The live pointer leads the server by one round trip, so prefer it and fall
  // back to the server's first unanswered question before the call starts.
  const nextQuestion = questions[currentIndex] ?? questions[0];

  return (
    <div className="space-y-4">
      <PlainCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusPill>
            {status === "idle"
              ? "Not connected"
              : status === "connecting"
                ? "Connecting…"
                : status === "ending"
                  ? "Ending…"
                  : status === "scoring"
                    ? "Scoring"
                    : assistantSpeaking
                      ? "Interviewer speaking"
                      : "Listening"}
          </StatusPill>
          {status === "scoring" ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-fg">
              <Loader2 aria-hidden="true" className="size-3 animate-spin" />
              Scoring your interview…
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 text-center">
          <div
            aria-hidden="true"
            className="grid size-20 place-items-center rounded-full bg-surface-muted transition-transform"
            style={{ transform: `scale(${1 + Math.min(volume, 1) * 0.25})` }}
          >
            {isLive && !micMuted ? (
              <Mic className="size-8 text-brand" />
            ) : (
              <MicOff className="size-8 text-muted-fg" />
            )}
          </div>

          {isLive ? (
            <div className="w-full max-w-md space-y-3">
              <p aria-live="polite" className="text-sm leading-6 text-body">
                {micMuted
                  ? "The interviewer is asking a question. Your microphone is muted until it finishes."
                  : "Your turn — take as long as you need. The whole interview is scored once the call ends."}
              </p>
              {/* Mic input meter — a flat bar on your turn means Vapi hears nothing. */}
              <div
                role="meter"
                aria-valuenow={Math.round(Math.min(micLevel, 1) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Microphone input level"
                className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
              >
                <span
                  className="block h-full rounded-full bg-brand transition-[width] duration-150"
                  style={{
                    width: micMuted ? "0%" : `${Math.min(micLevel * 400, 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="max-w-md text-sm leading-6 text-body">
              {questions.length} question{questions.length === 1 ? "" : "s"} left.
              The AI interviewer will ask them one at a time — allow microphone
              access when your browser prompts.
            </p>
          )}

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
              {status === "connecting" ? "Connecting…" : "Start voice interview"}
            </Button>
          )}

          <button
            type="button"
            className="text-xs font-medium text-muted-fg underline underline-offset-4"
            onClick={onSwitchToTyping}
          >
            Type my answers instead
          </button>
        </div>
      </PlainCard>

      {micSilent ? (
        <PlainCard>
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <h3 className="text-sm font-semibold text-heading">
                We can&apos;t hear your microphone
              </h3>
              <p className="mt-1 text-sm leading-6 text-body">
                The interviewer is speaking but no audio is reaching it. Check
                that the right input device is selected and unmuted at the
                operating-system level, then restart the call — or switch to
                typing so you don&apos;t lose the session.
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

      {isLive ? (
        <PlainCard>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
              Transcript
            </h3>
            {assistantSpeaking ? (
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-brand"
              />
            ) : null}
          </div>

          {/* The whole call stays on screen: a candidate who missed a word of
              the question can re-read it instead of guessing or asking. */}
          <ul className="mt-3 space-y-3">
            {turns.map((turn) => (
              <li key={turn.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                  {turn.role === "interviewer" ? "Interviewer" : "You"}
                </p>
                <p
                  className={
                    turn.role === "interviewer"
                      ? "mt-0.5 text-base leading-7 text-heading"
                      : "mt-0.5 text-sm leading-6 text-body"
                  }
                >
                  {turn.text}
                </p>
              </li>
            ))}

            {/* Turns still in progress, streaming word by word. Finalised text
                has already been appended above, so only the partial shows here. */}
            {assistantSpeaking && assistantTranscript ? (
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                  Interviewer
                </p>
                <p aria-live="polite" className="mt-0.5 text-base leading-7 text-heading">
                  {assistantTranscript}
                </p>
              </li>
            ) : null}

            {candidatePartial ? (
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                  You
                </p>
                <p aria-live="polite" className="mt-0.5 text-sm leading-6 text-muted-fg">
                  {candidatePartial}
                </p>
              </li>
            ) : null}
          </ul>

          {!candidatePartial ? (
            <p aria-live="polite" className="mt-4 text-sm leading-6 text-muted-fg">
              {micMuted
                ? "Waiting for the interviewer to finish…"
                : "Listening for your answer…"}
            </p>
          ) : null}

          {nextQuestion ? (
            <>
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-fg">
                Question on record
              </h3>
              <p className="mt-2 text-sm leading-6 text-body">
                {nextQuestion.questionText}
              </p>
            </>
          ) : null}
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

      {/* Kept visible after the call so the candidate can read back what was
          transcribed, which is what the scoring is based on. */}
      {!isLive && turns.length > 0 ? (
        <PlainCard>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
            Transcript
          </h3>
          <ul className="mt-3 space-y-3">
            {turns.map((turn) => (
              <li key={turn.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                  {turn.role === "interviewer" ? "Interviewer" : "You"}
                </p>
                <p className="mt-0.5 text-sm leading-6 text-body">{turn.text}</p>
              </li>
            ))}
          </ul>
        </PlainCard>
      ) : null}
    </div>
  );
}
