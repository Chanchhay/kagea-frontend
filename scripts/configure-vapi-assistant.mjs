/**
 * Applies this project's Vapi assistant configuration.
 *
 * Most of what the interview depends on is sent from the browser as
 * `assistantOverrides` on every call (see src/components/job-seeker/useVapiInterview.ts).
 * The few settings that cannot be — the system prompt, which would require
 * overriding the model and with it the provider, and the transcriber, which the
 * overrides only restate — live on the assistant record, and this script is how
 * they get there. Running it twice is harmless.
 *
 * The private key is read from the environment and never written to a file: it
 * grants full account access, unlike the public key the browser ships with.
 *
 *   VAPI_PRIVATE_KEY=... \
 *   NEXT_PUBLIC_VAPI_ASSISTANT_ID=... \
 *   node scripts/configure-vapi-assistant.mjs
 *
 * Optionally point Vapi's end-of-call webhook at a reachable backend. Without
 * it the browser still submits the transcript itself, so voice interviews work
 * — this only adds the path that covers a candidate closing the tab mid-call:
 *
 *   VAPI_SERVER_URL=https://<host>/api/v1/integrations/vapi/webhook \
 *   VAPI_WEBHOOK_SECRET=<same value as the backend> \
 *   node scripts/configure-vapi-assistant.mjs
 */

const API = "https://api.vapi.ai";

const privateKey = process.env.VAPI_PRIVATE_KEY;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const serverUrl = process.env.VAPI_SERVER_URL;
const webhookSecret = process.env.VAPI_WEBHOOK_SECRET;

if (!privateKey || !assistantId) {
  console.error(
    "VAPI_PRIVATE_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID are both required.",
  );
  process.exit(1);
}

/**
 * The interview is scored on the answers to these questions and no others, so
 * the prompt's job is to stop the model behaving like a conversationalist. It
 * states the length up front, forbids anything off the list, and tells it how to
 * take "I don't know" for an answer — improvising a follow-up or re-asking a
 * question the candidate already declined is what makes an interview feel out of
 * control, and it corrupts which speech belongs to which question.
 */
const SYSTEM_PROMPT = `You are conducting a structured job interview for the
{{jobTitle}} position with {{candidateName}}.

You will ask exactly {{questionCount}} questions. They are listed below, and this
list is the entire interview. There is nothing after it.

{{questions}}

RULES:

1. Ask the questions in the order listed, one per turn, using their wording.
2. Never say anything that is not on that list. No follow-up questions, no
   clarifying questions, no rephrasing, no "can you tell me more", and no
   questions of your own invention. The list is complete.
3. When the candidate finishes, acknowledge in at most four words and ask the
   next question in the same turn.
4. If the candidate says they do not know, cannot answer, or wants to skip,
   accept it immediately and move to the next question. Do not offer hints,
   encouragement, or another chance. Their answer is theirs to give.
5. Never re-ask a question you have already asked, however short or unclear the
   answer was.
6. Never reveal expected answers, scores, or how the candidate is doing.
7. Keep every one of your turns under 30 words. This is a spoken conversation.
8. After the candidate has responded to question {{questionCount}}, say exactly:
   "Your interview is complete. Thank you for your time." Then call the endCall
   tool. Say nothing after that.`;

async function vapi(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `${init.method ?? "GET"} ${path} failed (${response.status}): ${JSON.stringify(body)}`,
    );
  }
  return body;
}

const assistant = await vapi(`/assistant/${assistantId}`);
console.log(`Configuring "${assistant.name}" (${assistantId})`);

// The assistant must be able to hang up on its own, or every interview ends
// only when the candidate thinks to press End.
const tools = await vapi("/tool");
let endCallToolId = (assistant.model?.toolIds ?? []).find((id) =>
  tools.some((tool) => tool.id === id && tool.type === "endCall"),
);

if (!endCallToolId) {
  const existing = tools.find((tool) => tool.type === "endCall");
  endCallToolId =
    existing?.id ??
    (await vapi("/tool", {
      method: "POST",
      body: JSON.stringify({ type: "endCall" }),
    })).id;
  console.log(`  attached endCall tool ${endCallToolId}`);
}

const update = {
  model: {
    // Provider and model are the account's billing choice: read them back
    // rather than imposing one, and change only the prompt.
    provider: assistant.model?.provider ?? "openai",
    model: assistant.model?.model ?? "gpt-4.1",
    toolIds: [
      ...new Set([...(assistant.model?.toolIds ?? []), endCallToolId]),
    ],
    messages: [{ role: "system", content: SYSTEM_PROMPT }],
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-3",
    language: "en",
    smartFormat: true,
  },
  // Candidates think mid sentence. Vapi's defaults are tuned for phone support,
  // where a pause means "your turn", and cut interview answers in half.
  startSpeakingPlan: {
    waitSeconds: 2,
    transcriptionEndpointingPlan: {
      onPunctuationSeconds: 1.5,
      onNoPunctuationSeconds: 3,
      onNumberSeconds: 1.5,
    },
  },
};

if (serverUrl) {
  update.server = {
    url: serverUrl,
    ...(webhookSecret ? { secret: webhookSecret } : {}),
  };
  update.serverMessages = ["end-of-call-report", "status-update"];
  console.log(`  webhook → ${serverUrl}`);
} else {
  console.log("  webhook unchanged (set VAPI_SERVER_URL to configure it)");
}

await vapi(`/assistant/${assistantId}`, {
  method: "PATCH",
  body: JSON.stringify(update),
});

console.log("Done.");
