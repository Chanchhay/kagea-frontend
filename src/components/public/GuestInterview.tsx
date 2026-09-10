"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Mic, Sparkles, Type } from "lucide-react";
import type {
  AiInterviewResultResponse,
  AiInterviewSessionResponse,
} from "@/contracts";
import { VoiceInterviewPanel } from "@/components/job-seeker/VoiceInterviewPanel";
import { writeGuestToken } from "@/lib/guest-token";
import { isVapiConfigured } from "@/lib/vapi";
import {
  useAnswerGuestInterviewMutation,
  useBeginGuestInterviewMutation,
  useBindGuestVoiceCallMutation,
  useCompleteGuestInterviewMutation,
  useGetGuestInterviewAvailabilityQuery,
  useStartGuestInterviewMutation,
  useSubmitGuestVoiceTranscriptMutation,
} from "@/services/guestInterviewApi";

/**
 * An AI interview for someone who has not signed in.
 *
 * <p>The whole thing runs in this one component and in memory: a guest has no
 * account to come back to, so the flow is deliberately short — start, answer,
 * see the result, and then an invitation to keep it by creating an account.
 */
export function GuestInterview({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const availability = useGetGuestInterviewAvailabilityQuery();
  const [startInterview, startState] = useStartGuestInterviewMutation();
  const [begin] = useBeginGuestInterviewMutation();

  const [session, setSession] = useState<AiInterviewSessionResponse | null>(null);
  const [result, setResult] = useState<AiInterviewResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"typing" | "speaking">("typing");

  if (availability.isLoading) {
    return <Waiting label="Checking whether practice interviews are open…" />;
  }

  // Nothing to offer, and no button that would only fail.
  if (availability.data && !availability.data.enabled) return null;

  async function onStart() {
    setError(null);

    try {
      const started = await startInterview(jobId).unwrap();
      writeGuestToken(started.guestToken);
      const ready = await begin(started.session.id).unwrap();
      setSession(ready);
    } catch (caught) {
      setError(readError(caught));
    }
  }

  if (result) {
    return <Result result={result} jobTitle={jobTitle} />;
  }

  if (session) {
    return mode === "speaking" ? (
      <Speaking
        session={session}
        jobTitle={jobTitle}
        onSwitchToTyping={() => setMode("typing")}
        onResult={setResult}
      />
    ) : (
      <Questions
        session={session}
        onSession={setSession}
        onResult={setResult}
      />
    );
  }

  const blocked = availability.data?.blockedReason ?? null;
  const remaining = availability.data
    ? Math.max(0, availability.data.attemptsAllowed - availability.data.attemptsUsed)
    : 0;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-heading">
        <Sparkles aria-hidden="true" className="size-5 text-brand" />
        Try the AI interview
      </h2>
      <p className="mt-2 text-sm leading-6 text-body">
        Sit a real interview for <strong>{jobTitle}</strong> and get scored on
        it — no account needed. Type your answers or speak them out loud, then
        see your score, feedback on every answer, and what a strong answer
        sounds like.
      </p>

      {blocked ? (
        <p className="mt-4 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-body">
          {blocked}{" "}
          <Link href="/register" className="font-semibold text-brand underline">
            Create an account
          </Link>
          .
        </p>
      ) : (
        <>
          {isVapiConfigured ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <ModeButton
                active={mode === "typing"}
                onClick={() => setMode("typing")}
                icon={<Type aria-hidden="true" className="size-4" />}
                label="Type my answers"
              />
              <ModeButton
                active={mode === "speaking"}
                onClick={() => setMode("speaking")}
                icon={<Mic aria-hidden="true" className="size-4" />}
                label="Speak out loud"
              />
            </div>
          ) : null}

          <p className="mt-3 text-xs text-muted-fg">
            {remaining === 1
              ? "1 practice interview left."
              : `${remaining} practice interviews left.`}
          </p>
          <button
            type="button"
            onClick={() => void onStart()}
            disabled={startState.isLoading}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {startState.isLoading ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Writing your questions…
              </>
            ) : (
              "Start the interview"
            )}
          </button>
        </>
      )}

      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function Speaking({
  session,
  jobTitle,
  onSwitchToTyping,
  onResult,
}: {
  session: AiInterviewSessionResponse;
  jobTitle: string;
  onSwitchToTyping: () => void;
  onResult: (result: AiInterviewResultResponse) => void;
}) {
  const [bindCall] = useBindGuestVoiceCallMutation();
  const [submitTranscript] = useSubmitGuestVoiceTranscriptMutation();
  const [complete] = useCompleteGuestInterviewMutation();

  const unanswered = [...session.questions]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .filter((question) => !question.answered);

  return (
    <VoiceInterviewPanel
      sessionId={session.id}
      questions={unanswered}
      candidateName="there"
      jobTitle={jobTitle}
      onSwitchToTyping={onSwitchToTyping}
      bindCall={(callId) => bindCall({ sessionId: session.id, callId }).unwrap()}
      submitTurns={(turns) =>
        submitTranscript({ sessionId: session.id, turns }).unwrap()
      }
      onScored={() => {
        void complete(session.id)
          .unwrap()
          .then(onResult)
          .catch(() => {
            // The panel already reports submission failures; this only means
            // fetching the scored result failed after submit.
          });
      }}
    />
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border text-body hover:border-brand/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/** One question at a time: a wall of ten inputs reads like a form, not an interview. */
function Questions({
  session,
  onSession,
  onResult,
}: {
  session: AiInterviewSessionResponse;
  onSession: (session: AiInterviewSessionResponse) => void;
  onResult: (result: AiInterviewResultResponse) => void;
}) {
  const [answer, { isLoading: isSaving }] = useAnswerGuestInterviewMutation();
  const [complete, { isLoading: isScoring }] = useCompleteGuestInterviewMutation();

  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const questions = [...session.questions].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const question = questions[index];
  const isLast = index === questions.length - 1;

  if (!question) return null;

  async function submit() {
    if (!draft.trim()) {
      setError("Write an answer first.");
      return;
    }

    setError(null);

    try {
      const updated = await answer({
        sessionId: session.id,
        questionId: question.id,
        answerText: draft.trim(),
      }).unwrap();

      onSession(updated);
      setDraft("");

      if (isLast) {
        onResult(await complete(session.id).unwrap());
      } else {
        setIndex(index + 1);
      }
    } catch (caught) {
      setError(readError(caught));
    }
  }

  if (isScoring) return <Waiting label="Scoring your interview…" />;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
        Question {index + 1} of {questions.length}
      </p>
      <h2 className="mt-2 text-lg font-semibold leading-7 text-heading">
        {question.questionText}
      </h2>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={7}
        placeholder="Answer as you would out loud."
        className="mt-4 w-full resize-none rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm leading-6 text-body outline-none focus:border-brand"
      />

      {error ? (
        <p className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={isSaving}
        className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSaving ? "Saving…" : isLast ? "Finish and score me" : "Next question"}
      </button>
    </section>
  );
}

function Result({
  result,
  jobTitle,
}: {
  result: AiInterviewResultResponse;
  jobTitle: string;
}) {
  const questions = [...result.session.questions].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-heading">
        Your interview for {jobTitle}
      </h2>
      <p className="mt-1 text-3xl font-bold text-brand">
        {result.session.totalScore ?? "—"}
        <span className="ml-1 text-base font-medium text-muted-fg">/ 10</span>
      </p>

      {result.feedback ? (
        <dl className="mt-4 space-y-3 text-sm leading-6">
          <Detail label="Strengths" value={result.feedback.strengths} />
          <Detail label="Where to improve" value={result.feedback.weaknesses} />
          <Detail label="Recommendation" value={result.feedback.recommendation} />
        </dl>
      ) : null}

      <ol className="mt-6 space-y-4">
        {questions.map((question, position) => (
          <li key={question.id} className="rounded-2xl bg-surface-2 p-4">
            <p className="text-sm font-semibold text-heading">
              {position + 1}. {question.questionText}
            </p>
            {question.answer ? (
              <>
                <p className="mt-2 text-sm text-body">
                  <span className="font-semibold">Your answer: </span>
                  {question.answer.answerText}
                </p>
                {question.answer.feedback ? (
                  <p className="mt-1 text-sm text-body">
                    <span className="font-semibold">Feedback: </span>
                    {question.answer.feedback}
                  </p>
                ) : null}
                {question.answer.modelAnswer ? (
                  <p className="mt-1 text-sm text-muted-fg">
                    <span className="font-semibold">A strong answer: </span>
                    {question.answer.modelAnswer}
                  </p>
                ) : null}
              </>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl bg-surface-2 px-4 py-4">
        <p className="text-sm font-semibold text-heading">
          Keep this result and apply for the job
        </p>
        <p className="mt-1 text-sm text-body">
          A free account saves your interviews, and lets you apply with them
          attached.
        </p>
        <Link
          href="/register"
          className="mt-3 inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white"
        >
          Create an account
        </Link>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
        {label}
      </dt>
      <dd className="mt-0.5 text-body">{value}</dd>
    </div>
  );
}

function Waiting({ label }: { label: string }) {
  return (
    <section className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-6 text-sm text-body">
      <Loader2 aria-hidden="true" className="size-4 animate-spin text-brand" />
      {label}
    </section>
  );
}

/** The server's own words when it has any; a generic line otherwise. */
function readError(caught: unknown): string {
  if (
    caught &&
    typeof caught === "object" &&
    "data" in caught &&
    caught.data &&
    typeof caught.data === "object" &&
    "message" in caught.data &&
    typeof caught.data.message === "string"
  ) {
    return caught.data.message;
  }

  return "Something went wrong. Please try again.";
}
