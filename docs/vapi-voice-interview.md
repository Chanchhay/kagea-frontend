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

**Almost all of it is set from code**, in `vapi.start()`'s `assistantOverrides`,
so the dashboard assistant is a shell and the behaviour the interview depends on
is versioned alongside the code that depends on it:

| Setting | Value | Why |
| --- | --- | --- |
| `transcriber` | Deepgram `nova-3`, `en`, smart formatting | The newest model; the old default is what produced "I'm already let's go" |
| `transcriber.keyterm` | extracted from the questions | Lifts recall on the jargon the answers are scored on |
| `startSpeakingPlan` | see the endpointing table below | Stops the interviewer cutting candidates off |
| `firstMessage` | greeting naming candidate, role, question count | |
| `backgroundSound` | `off` | Silence is a candidate thinking, not dead air to fill |
| `maxDurationSeconds` | 1800 | An abandoned call should not bill forever |

**Model and voice are deliberately not overridden** — those are the account's
billing choices, and forcing a provider from the client could break a call.

### The assistant record

What cannot be sent per call — the system prompt, because overriding it means
overriding `model` and with it the provider — lives on the assistant. Applied by
script rather than by hand, so it is reproducible and diffable:

```bash
VAPI_PRIVATE_KEY=... \
NEXT_PUBLIC_VAPI_ASSISTANT_ID=... \
node scripts/configure-vapi-assistant.mjs
```

It is idempotent: it reads the assistant, keeps the model provider and voice as
they are, ensures an `endCall` tool is attached, and writes the prompt,
transcriber and endpointing. Optionally point Vapi's webhook at a reachable
backend in the same run:

```bash
VAPI_SERVER_URL=https://<host>/api/v1/integrations/vapi/webhook \
VAPI_WEBHOOK_SECRET=<same value as the backend> \
node scripts/configure-vapi-assistant.mjs
```

The **private** key is read from the environment and never written to a file or
committed — unlike the public key, it grants full account access.

The prompt's job is to stop the model behaving like a conversationalist. It is
given the interview length as `{{questionCount}}` and told the question list *is*
the whole interview, because an interviewer that improvises follow-ups asks more
questions than exist, and muddies which speech belongs to which question.

The rule worth knowing about: **"I don't know" ends a question.** The interviewer
accepts it and moves on rather than offering hints or another chance, and the
segmenter records it verbatim as the answer. Treating a refusal as no-answer
would silently reopen a question the candidate had already dealt with — that is
what left questions apparently unsaved after an interview.

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

The first message is overridden from code, so the dashboard's own first message
is unused and can be left as anything.

The webhook subscribes to `end-of-call-report` and `status-update`. Per-turn
`transcript` events are deliberately not enabled — the end-of-call report repeats
them in full, and the browser already renders the live ones.

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

## Relation to adrianhajdin/ai_mock_interviews

The call UI follows that project's `Agent.tsx`: the two participant cards, the
speaking pulse on the interviewer, a single fading caption line, and one
call/end button. Its transcript treatment is the better one — showing only the
line currently being spoken, with the history out of the way.

Two things from it are deliberately **not** adopted.

### The workflow

That project uses a Vapi **workflow** for one screen only: the voice agent that
asks a visitor which role, level and tech stack they want, then calls an API to
generate an interview. Its actual interview runs on an assistant, not a
workflow.

This app generates questions in Spring Boot from a real job posting, keyed to an
application. Replacing that with a voice agent interrogating the candidate about
what they would like to be asked would be a downgrade, so there is nothing here
for a workflow to do.

The SDK signature did change, which is worth knowing if that project is used as a
reference. `@vapi-ai/web@2.6.2` declares:

```ts
start(assistant?, assistantOverrides?, squad?, workflow?, workflowOverrides?, options?)
```

So `vapi.start(workflowId, { variableValues })` — as the reference repo writes
it, on SDK 2.2 — now passes a workflow id into the *assistant* slot. The current
form is `vapi.start(undefined, undefined, undefined, workflowId, { variableValues })`.

### The inline assistant

That project defines the whole assistant in code and passes the object to
`start()`. Tempting — one source of truth, no dashboard drift — but an inline
assistant is transient, so there is no assistant record to hang a webhook on.
Receiving `end-of-call-report` would mean putting `server: { url, secret }` in
the object, and that object ships to the browser: the webhook secret would be
public.

So the assistant id stays, and everything that can be varies per call through
`assistantOverrides` instead. The secret lives on the assistant record at Vapi,
where the browser never sees it. (Vapi's organisation-level Server URL would be
the way to combine an inline assistant with a webhook, if that trade ever looks
worth making.)

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

Vapi also emits into a transport that no longer exists: its internal speaking
timeout fires `speech-end` *after* the call is torn down, and muting a destroyed
call throws `Call object is not available` out of Daily. Every call that reaches
through to Daily is gated on `callActiveRef` for that reason.

### Ending a call is reported as an error

A normal, successful hangup produces this sequence:

```
Meeting ended due to ejection: Meeting has ended     ← error fires first
Vapi error: { type: "daily-error" }
status-update  endedReason: "customer-ended-call"    ← ending reported after
                             (or "assistant-ended-call")
```

The `error` event is teardown, not a fault — and note the order. It arrives
*before* `call-end`, so "is the call still up?" cannot tell a teardown error from
a real one; at that moment the call still looks live. Two guards instead:

- `stop()` marks the call down before asking Vapi to stop, which covers the
  candidate pressing End (`customer-ended-call`).
- `isTeardownError()` matches the message — Daily ejects participants when a
  meeting ends — which covers the assistant hanging up on its own
  (`assistant-ended-call`), where nothing local initiated the stop.

Anything that is not recognisably teardown still raises the toast, and an
`Error` instance serialises to `{}`, so real faults fail toward being reported.

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
