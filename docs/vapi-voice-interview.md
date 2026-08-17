# Vapi voice interview

The AI interview can be answered by voice instead of typing. Vapi handles speech
only — questions, scoring and session state stay in Spring Boot.

**Nothing is written to the interview while the call is running.** The browser
records the conversation and displays it; when the call ends the whole transcript
goes to the backend, Gemini splits it into one answer per question, and the
existing evaluation scores it.

That is the second design. The first attributed answers as the call went, by
treating each interviewer turn as a question boundary. It produced this, from a
candidate who was answering the Flexbox question throughout:

| Question on record | What was stored |
| --- | --- |
| Flexbox vs Grid | "I'm already let's go." |
| Git workflow | "I'll make a different spacing. It's one-dimensional… Column." |
| Constructive feedback | "One is grid is— The system handling column." |

Speech recognition splits one answer across several turns, the interviewer
acknowledges mid-answer, and candidates pause to think. Every one of those looks
identical to "next question" from the browser's side. Deciding which question a
piece of speech addresses is a language problem, so it is given to the model
already scoring the interview rather than to a turn counter.

If the transcript leaves any question unanswered the session stays
`IN_PROGRESS`, so the candidate can finish by typing rather than be scored on an
interview they did not complete.

## Flow

```
POST /ai-interviews/{id}/start        → questions generated (unchanged)
        ↓
vapi.start(assistantId, { variableValues, startSpeakingPlan })
        ↓
PUT  /ai-interviews/{id}/vapi-call    → binds the call id to the session
        ↓
interviewer asks, candidate answers — browser only records and renders
        ↓
call ends
        ↓
   ┌────────────────────────────┬───────────────────────────────────┐
   │ browser                    │ Vapi                              │
   │ POST /{id}/transcript      │ POST /integrations/vapi/webhook   │
   └────────────────────────────┴───────────────────────────────────┘
        ↓  (whichever arrives first; the other finds it done)
Gemini splits the transcript → one answer per question
        ↓
existing Gemini evaluation → COMPLETED → MODERATOR_REVIEW_PENDING
```

## Frontend

| File | Role |
| --- | --- |
| [src/lib/vapi.ts](../src/lib/vapi.ts) | env keys, question formatting, question matching (display only) |
| [useVapiInterview.ts](../src/components/job-seeker/useVapiInterview.ts) | call lifecycle, transcript recording, mute, mic diagnostics |
| [VoiceInterviewPanel.tsx](../src/components/job-seeker/VoiceInterviewPanel.tsx) | mic UI, input meter, live transcript, submit retry |
| [AiInterviewRunner.tsx](../src/components/job-seeker/AiInterviewRunner.tsx) | voice / typing toggle |

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_...
NEXT_PUBLIC_VAPI_ASSISTANT_ID=...
```

Public key only — it is bundled into the browser. Never put a Vapi **private**
key behind a `NEXT_PUBLIC_` name. When either variable is missing the panel
hides itself and the typed form is used instead.

The Vapi client is built lazily on the first Start click rather than in a mount
effect: Daily, Vapi's transport, rejects duplicate call objects, and React's
development double-mount would otherwise leave a second, mic-less instance
behind the first.

## Backend

In `ai_interview_backend_api`:

| File | Role |
| --- | --- |
| `features/interview/vapi/VapiWebhookController.java` | `POST /api/v1/integrations/vapi/webhook` |
| `features/interview/vapi/service/VapiWebhookServiceImpl.java` | secret check, event dispatch, artifact parsing |
| `features/interview/vapi/service/AiInterviewTranscriptSegmenterImpl.java` | Gemini: transcript → one answer per question |
| `features/interview/ai/service/AiInterviewServiceImpl.java` | `bindVapiCall`, `completeFromVapiTranscript`, `submitVoiceTranscript` |
| `features/interview/ai/AiInterviewController.java` | `POST /ai-interviews/{id}/transcript` |
| `db/migration/V10__vapi_call_session_lookup.sql` | unique partial index on `call_session_id` |

No new columns were needed: `ai_interview_sessions` already had
`call_session_id` and `transcript`.

Scoring is two Gemini calls — segment, then evaluate — each run outside a
transaction with short transactions either side, matching how question
generation and evaluation already work.

```env
VAPI_WEBHOOK_SECRET=<long random value>
```

Unset means the webhook rejects every call — it fails closed. Voice interviews
still work: the browser's `POST /{id}/transcript` carries the same content.

### Why the webhook is `permitAll()`

Vapi is not a job seeker, moderator or recruiter, and must never hold a Keycloak
token. The route is open to the filter chain, and the handler authenticates it
with a shared secret compared in constant time before the body is acted on. The
secret is read from `X-Vapi-Secret` (Vapi's assistant server secret) or
`X-Vapi-Webhook-Secret` (a dashboard custom credential); either setup works.

It is deliberately **not** `Authorization: Bearer` — that header already means a
Keycloak JWT everywhere else, and the resource-server filter would try to decode
the secret as one.

### Idempotency

Two paths submit the same transcript, and Vapi retries any non-2xx response, so
the work must be safe to attempt repeatedly. An already-`COMPLETED` session is a
no-op whichever path arrives; the browser's request surfaces failures to the
candidate while the webhook swallows them, since a 500 only earns a retry of an
event that will fail identically. A
Gemini failure is logged and marks the session `FAILED` rather than propagating a
500, and the call id is uniquely indexed so it can never bind two interviews.

## Assistant configuration

The assistant must match the transcript mapping: **one question per turn, in
order, no clarifying questions.** A clarification exchange is indistinguishable
from a new question and would split one answer across two records.

First message:

```
Hello {{candidateName}}. Welcome to your interview for the {{jobTitle}}
position. I will ask you {{questionCount}} questions, one at a time. Answer
each one as clearly as you can.
```

System prompt:

```
You are a professional AI interviewer.

Candidate: {{candidateName}}
Position: {{jobTitle}}

Interview questions:

{{questions}}

RULES:

1. Ask exactly one interview question per turn, using the wording above.
2. Follow the questions in the given order. Never skip, merge or reorder them.
3. Wait for the candidate to finish before speaking again.
4. Do not ask clarifying or follow-up questions, and do not invent new ones.
5. Acknowledge an answer in at most four words, then ask the next question in
   the same turn.
6. Never reveal expected answers or scores.
7. After the last answer say: "Your interview is complete. Thank you for your
   time." then call the endCall tool.
```

Add the built-in **End Call** tool so rule 7 can hang up on its own.

Server URL, under Assistant → Advanced → Webhook Server:

```
https://<public-host>/api/v1/integrations/vapi/webhook
```

Enable at least `end-of-call-report` and `status-update`. Per-turn `transcript`
events are received but ignored — the end-of-call report repeats them in full.

## Testing locally

**No tunnel is needed.** The browser submits the transcript itself, so a full
interview can be run and scored against `localhost`:

```bash
npm run dev
```

The webhook is the belt to that braces — it covers the candidate who closes the
tab before the call ends. To exercise it, expose the backend and point the
assistant's Server URL at the tunnel:

```bash
ngrok http 8080
```

Set `VAPI_WEBHOOK_SECRET` to the same value on both sides.

Worth checking: deny microphone permission and confirm the panel says so rather
than connecting deaf; hang up mid-interview and confirm the session stays
`IN_PROGRESS` with the answered questions filled in and the rest left to type;
and finish every question, then watch the session reach `COMPLETED`.

## Why there is no WebSocket

The realtime channel already exists. `@vapi-ai/web` runs the call over WebRTC and
emits events on it as they happen — `transcript` messages arrive as **partials**
while a sentence is still being spoken, alongside `speech-start`/`speech-end` and
`volume-level`. The UI subscribes to those directly.

Adding a WebSocket to Spring Boot for this would make it slower, not faster:

```
today      Vapi ──WebRTC──▶ browser                 one hop
websocket  Vapi ──webhook─▶ Spring ──ws──▶ browser  two hops + a round trip
```

So the browser drives its own live UI, and the backend is told what happened
rather than asked. Two consequences worth knowing:

- **The current question comes from the live pointer, not the session.** The
  server only learns an answer landed after the round trip, so a UI driven by
  `session.questions` renders a question behind the voice the candidate is
  hearing. `currentIndex` in the hook leads it.
- **Polling is only for the webhook's completion**, not for conversation state —
  a 10s tick on the session page, purely so a server-side score appears on its
  own.

A WebSocket (or SSE) does become the right tool the moment a **second** viewer
needs the live call — a recruiter watching a candidate's interview in progress.
That viewer has no WebRTC session of their own, so the path would be Vapi's
`transcript` webhook events → Spring Boot → SSE to the observer. Nothing in the
current design blocks adding that later; it is a separate feature, not a rework.

## One party holds the floor at a time

The interview is **half duplex**: the candidate's microphone is muted for as long
as the interviewer is speaking, and opened the moment it stops.

```
speech-start → vapi.setMuted(true)    interviewer asks, mic closed
speech-end   → vapi.setMuted(false)   candidate answers, mic open
```

This exists because on laptop speakers the microphone otherwise picks up the
interviewer's own voice, Vapi transcribes it as the candidate, and the interview
races through every question storing the assistant's own sentences as answers —
"Thank you for your response." saved as an answer is the tell.

Muting is what makes that impossible, and it is the **only** thing that filters
audio — no transcript is ever discarded on content or timing. Two earlier
attempts at that were removed after both silently swallowed real answers: a
1.5s tail after `speech-end` (which ate any prompt reply) and a word-overlap
echo test (which ate answers reusing the question's terminology).

`speech-end` reopens the microphone, so a missed one would mute the candidate
for the rest of the call with nothing on screen to explain it. The mute
therefore releases itself after `MAX_MUTE_MS` (12s) and logs a warning, rather
than trusting a single event to arrive.

The trade-off is that the candidate cannot interrupt the interviewer. For a
scored interview that reads as correct behaviour rather than a limitation.

### The interviewer must not interrupt either

Vapi's endpointing defaults are tuned for phone support, where a pause means
"your turn". An interview answer is the opposite — candidates think mid sentence,
and being cut off costs them the rest of the answer *and* files the fragment as
their response. `PATIENT_ENDPOINTING` in the hook raises every threshold and is
passed as `startSpeakingPlan` on `vapi.start()`:

| Setting | Vapi default | Here | Max |
| --- | --- | --- | --- |
| `waitSeconds` | 0.4 | 2 | 5 |
| `onPunctuationSeconds` | 0.1 | 1.5 | 3 |
| `onNoPunctuationSeconds` | 1.5 | 3 | 3 |
| `onNumberSeconds` | 0.5 | 1.5 | 3 |

Tune these first if the interviewer still jumps in. One caveat:
`transcriptionEndpointingPlan` is ignored when the assistant has a **smart
endpointing plan** set in the dashboard — `waitSeconds` applies either way, so
if raising the table above changes nothing, turn smart endpointing off (or tune
it) on the assistant.

The panel shows whose turn it is: the mic icon greys out, the input meter drops
to zero, and the caption switches between "Your turn — speak your answer" and
"Your microphone is muted until it finishes".

A session already polluted by echo cannot be repaired from the transcript — its
stored answers are the assistant's own words. Start a fresh interview.

## Microphone troubleshooting

If the interviewer speaks but nothing you say registers, the panel now tells you
which half is broken:

- **Input meter flat while you talk** — the browser is not receiving audio.
  Wrong input device, muted at the OS level, or another app holding the mic. The
  panel raises a "we can't hear your microphone" warning after eight seconds of
  silence *on your turn*; the watch is disarmed while the interviewer speaks, so
  a muted question never reads as a dead microphone.
- **Meter moves but no transcript** — audio reaches the browser but not Vapi's
  transcriber. Check the assistant has a transcriber configured, and watch the
  `[vapi message]` entries logged to the console in development.
- **Never gets that far** — permission is requested explicitly before dialling,
  so a blocked mic reports as a permission error instead of a silent call.

Serve over `localhost` or HTTPS. On a plain-HTTP LAN address browsers refuse
microphone access outright.
