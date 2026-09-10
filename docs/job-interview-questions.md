# Written interview questions on the job board

An administrator can write the questions a job's interview asks. This note
covers how a visitor gets to see them before they sit the interview.

## Who writes them

Moderators and SUPER_ADMIN, through
`GET|PUT /api/v1/admin/jobs/{jobId}/interview-questions`. Not recruiters — the
questions decide whether a candidate passes, and the company doing the hiring is
not a neutral party to that.

A job's `manualQuestionMode` decides what the AI then does:

- `MANUAL_ONLY` — the interview is exactly the written questions.
- `MANUAL_PLUS_AI` (default) — the written questions come first, then the AI
  fills the rest of the configured question count.

A job with no written questions is generated in full, whatever the mode says.
`InterviewQuestionComposer` applies this for both the signed-in and the guest
flow, so the two cannot drift apart.

## The public preview

```
GET /api/v1/public/jobs/{jobId}/interview-questions   # one job
GET /api/v1/public/job-interview-questions?jobIds=a,b # a page of the board
```

The batch route answers in the order the ids were given and silently drops any
that are no longer public, so match results on `jobId` rather than by position.
It caps at 50 ids. It lives at its own path so `interview-questions` can never
be mistaken for a job id by the `/jobs/{jobId}` route.

Both are open to anyone — a GET under `/api/v1/public/**`, which the security config
already permits. Returns `ApiResponse<PublicJobInterviewPreviewResponse>`:

```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "jobTitle": "Senior Backend Engineer",
    "questionCount": 10,
    "estimatedMinutes": 20,
    "questions": [
      {
        "id": "uuid",
        "displayOrder": 1,
        "questionType": "TECHNICAL",
        "questionText": "Walk me through how you would…",
        "maxScore": 10
      }
    ]
  }
}
```

Two things the frontend depends on:

- **`questionCount` is the real length of the interview**; `questions` holds
  only the written ones. In `MANUAL_PLUS_AI` the list is shorter than the count,
  and the difference is the AI's half — not withheld, just not written yet. The
  UI says so rather than letting someone count the list and be surprised.
- **`expectedAnswer` is never served here.** It is the scoring rubric. The admin
  DTO carries it; `PublicJobInterviewQuestionResponse` deliberately does not.

Only published jobs, via the same `findPublicJobById` test the job listing uses —
an expired posting, or one whose company was suspended, 404s along with the job
itself.

`estimatedMinutes` is `questionCount * 2`, a rough number for the practice page.
There is no configured interview duration to read it from.

## Frontend

- `PublicJobInterviewPreviewResponse` in `src/contracts/api/public.ts`
- `useGetPublicJobInterviewQuestionsQuery` in `src/services/publicApi.ts`
- `src/components/public/JobInterviewQuestions.tsx` — the panel; renders `null`
  when a job has no written questions, which is the common case. Pass
  `className` to reskin its shell for the surface it sits on.

- `src/components/public/JobListInterviewQuestions.tsx` — the section under the
  job board, one block per job with an "Interview now" action

Where it appears:

- `/jobs`, below the card grid **and its pagination** — it describes the page's
  jobs, so it sits after the control that changes them. Follows the filters and
  the current page; jobs with nothing written are left out, and the section
  disappears when that is all of them
- bottom of the main column on `/jobs/{jobId}`, after the role's own sections
- above the interview on `/practice-interview/{jobId}`

An "Interview now" action on every find-job card leads to the practice page, and
`/jobs/{jobId}` carries a "Back to jobs" link at every width.

## Writing them

The editor lives in the **admin console**, not this app:
`admin-ai-career` → `/companies/{companyId}/jobs/{jobId}`, the
`JobInterviewQuestionsPanel` on the job's page. It writes the whole set in one
PUT and sets the job's `MANUAL_ONLY` / `MANUAL_PLUS_AI` mode.

A job with no questions saved there shows no panel on the job board — that is
the default state, and most postings stay in it.
