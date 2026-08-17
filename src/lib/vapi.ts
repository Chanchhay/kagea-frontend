import type { AiInterviewQuestionResponse } from "@/contracts";

// Read as literal member access so Next can inline the values at build time.
export const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
export const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

export const isVapiConfigured = Boolean(VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID);

/** The numbered list handed to the assistant through `{{questions}}`. */
export function formatQuestionList(
  questions: AiInterviewQuestionResponse[],
): string {
  return questions
    .map((question, index) => `${index + 1}. ${question.questionText}`)
    .join("\n");
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "did", "do",
  "does", "for", "from", "had", "has", "have", "how", "in", "is", "it", "me",
  "of", "on", "or", "tell", "that", "the", "to", "us", "was", "what", "when",
  "where", "which", "who", "why", "with", "you", "your",
]);

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Finds which question an assistant utterance is reading out.
 *
 * **Display only.** Answers are no longer attributed by this: the backend gives
 * the finished transcript to Gemini, which reads what was actually said. This
 * only drives the "question on record" heading during the call, where guessing
 * wrong costs a heading rather than a candidate's answer.
 */
export function matchQuestionIndex(
  utterance: string,
  questions: AiInterviewQuestionResponse[],
): number {
  const spoken = new Set(significantWords(utterance));
  if (spoken.size === 0) return -1;

  let bestIndex = -1;
  let bestRatio = 0;

  questions.forEach((question, index) => {
    const words = significantWords(question.questionText);
    if (words.length === 0) return;
    const hits = words.filter((word) => spoken.has(word)).length;
    const ratio = hits / words.length;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestIndex = index;
    }
  });

  return bestRatio >= 0.6 ? bestIndex : -1;
}

/** Deepgram accepts up to 100; well short of it keeps the boost focused. */
const MAX_KEYTERMS = 50;

/**
 * Pulls the vocabulary this interview is likely to contain out of its questions.
 *
 * Handed to Deepgram as keyterms, which lifts recall on exactly the words a
 * general model mishears — "Flexbox", "endpointing", a framework name — and
 * which are also the words the answer is scored on. The questions are the only
 * preview of that vocabulary available before the candidate speaks.
 */
export function extractKeyterms(
  questions: AiInterviewQuestionResponse[],
): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];

  for (const question of questions) {
    // Matched against the source text rather than a lowercased copy: capitals
    // and internal punctuation are what mark "CSS", "Node.js" or "C#" as jargon.
    const candidates = question.questionText.match(/[A-Za-z][A-Za-z0-9.+#-]{2,}/g) ?? [];

    for (const candidate of candidates) {
      const term = candidate.replace(/[.,-]+$/, "");
      if (term.length < 3) continue;

      const isJargon = /[A-Z0-9.+#]/.test(term.slice(1)) || term.length > 6;
      const key = term.toLowerCase();
      if (!isJargon || STOP_WORDS.has(key) || seen.has(key)) continue;

      seen.add(key);
      terms.push(term);

      if (terms.length >= MAX_KEYTERMS) return terms;
    }
  }

  return terms;
}
