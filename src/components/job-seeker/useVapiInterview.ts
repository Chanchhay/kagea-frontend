"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import type { AiInterviewQuestionResponse } from "@/contracts";
import {
  VAPI_ASSISTANT_ID,
  VAPI_PUBLIC_KEY,
  formatQuestionList,
  matchQuestionIndex,
} from "@/lib/vapi";
import {
  useBindAiInterviewVapiCallMutation,
  useSubmitAiInterviewTranscriptMutation,
} from "@/services/jobSeekerApi";

export type VoiceStatus = "idle" | "connecting" | "live" | "ending" | "scoring";

/** One completed turn of the call, kept so the candidate can re-read it. */
export type ConversationTurn = {
  id: number;
  role: "interviewer" | "candidate";
  text: string;
};

type TranscriptMessage = {
  type?: string;
  role?: string;
  transcript?: string;
  transcriptType?: string;
};

type UseVapiInterviewArgs = {
  sessionId: number;
  /** Unanswered questions in display order. */
  questions: AiInterviewQuestionResponse[];
  candidateName: string;
  jobTitle: string;
};

/** Mic levels below this are silence, not speech. */
const MIC_SIGNAL_THRESHOLD = 0.02;
/** How long a live call may see no mic signal before we warn the candidate. */
const MIC_SILENCE_GRACE_MS = 8000;
/**
 * Longest the microphone may stay closed for one interviewer turn.
 *
 * `speech-end` is Vapi's signal that the interviewer has stopped, and it is the
 * only thing that reopens the microphone. If it is ever missed the candidate is
 * muted for the rest of the call with no way to tell — so the mute releases
 * itself rather than trusting a single event to arrive.
 */
const MAX_MUTE_MS = 12000;

/**
 * How patient the interviewer is before deciding the candidate has finished.
 *
 * Vapi's defaults are tuned for phone support, where turns are short and a pause
 * means "your turn". An interview answer is the opposite: candidates think mid
 * sentence, and being cut off costs them the rest of their answer. Every value
 * here is raised well above the default, and `onNoPunctuationSeconds` sits at
 * the maximum the API allows.
 *
 * Note: `transcriptionEndpointingPlan` is ignored when the assistant has a
 * smart endpointing plan configured in the dashboard — `waitSeconds` still
 * applies either way.
 */
const PATIENT_ENDPOINTING = {
  /** Silence before the interviewer may speak at all. Default 0.4, max 5. */
  waitSeconds: 2,
  transcriptionEndpointingPlan: {
    /** After a sentence ends cleanly. Default 0.1, max 3. */
    onPunctuationSeconds: 1.5,
    /** After a trailing-off pause. Default 1.5, max 3. */
    onNoPunctuationSeconds: 3,
    /** After a number, which transcribers punctuate early. Default 0.5, max 3. */
    onNumberSeconds: 1.5,
  },
} as const;

export function useVapiInterview({
  sessionId,
  questions,
  candidateName,
  jobTitle,
}: UseVapiInterviewArgs) {
  const [bindVapiCall] = useBindAiInterviewVapiCallMutation();
  const [submitTranscript] = useSubmitAiInterviewTranscriptMutation();

  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [micLevel, setMicLevel] = useState(0);
  const [micSilent, setMicSilent] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  /** What the interviewer is saying right now, streamed as it speaks. */
  const [assistantTranscript, setAssistantTranscript] = useState("");
  /** The candidate's sentence in flight, before the transcriber finalises it. */
  const [candidatePartial, setCandidatePartial] = useState("");
  /** Everything said so far, so a candidate can re-read the question they are on. */
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  /**
   * Which question the call appears to be on.
   *
   * Display only. Answers are no longer derived from this — the backend splits
   * the finished transcript — so a wrong guess here costs a heading, not data.
   */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitFailed, setSubmitFailed] = useState(false);

  const vapiRef = useRef<Vapi | null>(null);
  // Listeners are bound once per Vapi instance but read these on every event, so
  // call state lives in refs rather than in the closures captured at bind time.
  const questionsRef = useRef(questions);
  const turnsRef = useRef<ConversationTurn[]>([]);
  const turnIdRef = useRef(0);
  const micPeakRef = useRef(0);
  const micTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const muteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  /**
   * Hands the whole call to the backend, which splits it into answers and scores
   * it. Vapi's webhook submits the same transcript; whichever lands first wins.
   */
  const sendTranscript = useCallback(async () => {
    const collected = turnsRef.current;
    if (collected.length === 0) {
      setStatus("idle");
      return;
    }

    setStatus("scoring");
    setSubmitFailed(false);

    try {
      await submitTranscript({
        sessionId,
        body: {
          turns: collected.map((turn) => ({ role: turn.role, text: turn.text })),
        },
      }).unwrap();
    } catch (error) {
      console.error("Submitting the interview transcript failed:", error);
      setSubmitFailed(true);
      toast.error("Your interview could not be submitted. Retry below.");
    } finally {
      setStatus("idle");
    }
  }, [sessionId, submitTranscript]);

  // Bound listeners must always call the newest submit, but rebinding them would
  // mean rebuilding the Vapi instance mid-call, so it goes through a ref.
  const sendTranscriptRef = useRef(sendTranscript);
  useEffect(() => {
    sendTranscriptRef.current = sendTranscript;
  }, [sendTranscript]);

  const clearMicTimer = useCallback(() => {
    if (micTimerRef.current) clearTimeout(micTimerRef.current);
    micTimerRef.current = null;
  }, []);

  /**
   * Creates the Vapi client on first use.
   *
   * Built lazily rather than in a mount effect: Daily (Vapi's transport) rejects
   * duplicate call objects, and React's development double-mount would otherwise
   * leave a second, mic-less instance behind the first.
   */
  const getVapi = useCallback((): Vapi | null => {
    if (vapiRef.current) return vapiRef.current;
    if (!VAPI_PUBLIC_KEY) return null;

    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    const recordTurn = (role: ConversationTurn["role"], text: string) => {
      turnIdRef.current += 1;
      const turn = { id: turnIdRef.current, role, text };
      turnsRef.current = [...turnsRef.current, turn];
      setTurns(turnsRef.current);
    };

    /**
     * Watches for a candidate turn that produces no microphone signal at all.
     *
     * Armed only while the floor is the candidate's. Running it during the
     * interviewer's turn would report every muted question as a dead mic.
     */
    const armMicSilenceWatch = () => {
      clearMicTimer();
      micPeakRef.current = 0;
      micTimerRef.current = setTimeout(() => {
        if (micPeakRef.current < MIC_SIGNAL_THRESHOLD) setMicSilent(true);
      }, MIC_SILENCE_GRACE_MS);
    };

    vapi.on("call-start", () => {
      setStatus("live");
      setMicSilent(false);
      micPeakRef.current = 0;
      // Start from a known state: a previous call may have ended mid-mute.
      vapi.setMuted(false);
      setMicMuted(false);
      // Vapi exposes the local mic level precisely so a dead input can be
      // surfaced instead of looking like a candidate who never answers.
      void vapi.startLocalAudioLevelObserver(200);
    });

    vapi.on("call-end", () => {
      clearMicTimer();
      if (muteTimerRef.current) clearTimeout(muteTimerRef.current);
      muteTimerRef.current = null;
      setAssistantSpeaking(false);
      setMicMuted(false);
      setVolume(0);
      setMicLevel(0);
      setCandidatePartial("");
      void sendTranscriptRef.current();
    });

    // Half duplex: only one party holds the floor. The candidate's microphone is
    // closed for as long as the interviewer is talking, so its voice can never
    // be captured and transcribed as an answer, and opened the moment it stops.
    const openMic = () => {
      if (muteTimerRef.current) clearTimeout(muteTimerRef.current);
      muteTimerRef.current = null;
      vapi.setMuted(false);
      setMicMuted(false);
      setAssistantSpeaking(false);
      armMicSilenceWatch();
    };

    vapi.on("speech-start", () => {
      setAssistantSpeaking(true);
      vapi.setMuted(true);
      setMicMuted(true);
      clearMicTimer();
      setMicSilent(false);

      if (muteTimerRef.current) clearTimeout(muteTimerRef.current);
      muteTimerRef.current = setTimeout(() => {
        console.warn("Vapi speech-end never arrived; reopening the microphone");
        openMic();
      }, MAX_MUTE_MS);
    });

    vapi.on("speech-end", openMic);

    vapi.on("volume-level", (level) => setVolume(level));

    vapi.on("local-volume-level", (level) => {
      setMicLevel(level);
      if (level > micPeakRef.current) micPeakRef.current = level;
      if (level >= MIC_SIGNAL_THRESHOLD) setMicSilent(false);
    });

    vapi.on("local-audio-level-observer-error", (error) => {
      console.error("Vapi mic observer error:", error);
    });

    vapi.on("message", (message: TranscriptMessage) => {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[vapi message]", message);
      }
      if (message?.type !== "transcript") return;
      const text = String(message.transcript ?? "").trim();
      if (!text) return;

      if (message.role === "user") {
        setMicSilent(false);
        if (message.transcriptType === "final") {
          setCandidatePartial("");
          recordTurn("candidate", text);
        } else {
          setCandidatePartial(text);
        }
        return;
      }

      if (message.role !== "assistant") return;

      // Partials stream in while the interviewer is still talking, which is what
      // lets the caption keep pace with the voice rather than appearing after it.
      setAssistantTranscript(text);

      if (message.transcriptType === "final") {
        recordTurn("interviewer", text);
        const matched = matchQuestionIndex(text, questionsRef.current);
        if (matched >= 0) setCurrentIndex(matched);
      }
    });

    vapi.on("call-start-failed", (event) => {
      console.error("Vapi call start failed:", event);
      toast.error("The voice interview could not connect.");
      setStatus("idle");
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      toast.error("The voice connection dropped. You can restart or type instead.");
      clearMicTimer();
      setStatus("idle");
    });

    return vapi;
  }, [clearMicTimer]);

  useEffect(
    () => () => {
      clearMicTimer();
      if (muteTimerRef.current) clearTimeout(muteTimerRef.current);
      muteTimerRef.current = null;
      const vapi = vapiRef.current;
      if (!vapi) return;
      vapi.removeAllListeners();
      void vapi.stop();
      vapiRef.current = null;
    },
    [clearMicTimer],
  );

  const start = useCallback(async () => {
    if (!VAPI_ASSISTANT_ID || status !== "idle") return;

    const pending = questionsRef.current;
    if (pending.length === 0) return;

    // Ask for the mic before dialling so a denied permission is reported as a
    // permission problem rather than as a call that connects but hears nothing.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Microphone permission denied:", error);
      toast.error(
        "Microphone access is blocked. Allow it in your browser, or type your answers.",
      );
      return;
    }

    const vapi = getVapi();
    if (!vapi) return;

    setCurrentIndex(0);
    turnsRef.current = [];
    turnIdRef.current = 0;
    setTurns([]);
    setCandidatePartial("");
    setAssistantTranscript("");
    setSubmitFailed(false);
    setMicSilent(false);
    setStatus("connecting");

    try {
      const call = await vapi.start(VAPI_ASSISTANT_ID, {
        startSpeakingPlan: PATIENT_ENDPOINTING,
        variableValues: {
          candidateName,
          jobTitle,
          sessionId: String(sessionId),
          questionCount: String(pending.length),
          questions: formatQuestionList(pending),
        },
      });

      // Hand the call id to the backend so Vapi's end-of-call webhook can resolve
      // this session. Not fatal if it fails: the browser submits the same
      // transcript itself when the call ends.
      if (call?.id) {
        try {
          await bindVapiCall({ sessionId, body: { callId: call.id } }).unwrap();
        } catch (bindError) {
          console.error("Could not bind the Vapi call to the session:", bindError);
        }
      }
    } catch (error) {
      console.error("Vapi start failed:", error);
      toast.error("Could not start the voice interview. Check your microphone.");
      setStatus("idle");
    }
  }, [bindVapiCall, candidateName, getVapi, jobTitle, sessionId, status]);

  const stop = useCallback(async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    setStatus("ending");
    await vapi.stop();
  }, []);

  return {
    status,
    assistantSpeaking,
    volume,
    micLevel,
    micSilent,
    micMuted,
    assistantTranscript,
    candidatePartial,
    turns,
    currentIndex,
    submitFailed,
    retrySubmit: sendTranscript,
    start,
    stop,
  };
}
