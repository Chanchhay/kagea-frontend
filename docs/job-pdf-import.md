# Starting a job post from a PDF

A recruiter can upload the job description they already have instead of retyping
it. The upload fills the job form; it never creates a job post. The recruiter
reviews every field and saves through the normal create/publish flow.

One thing is written before they save: any skill the document names that our
shared list was missing. That is deliberate, and said plainly in the UI — see
"Skills come from the document".

## The round trip

`POST /api/v1/recruiter/jobs/parse-document` (multipart, `file`) does the whole
job in one call:

1. Rejects anything that is not `application/pdf`. The shared uploader also
   takes images; an image has no text layer, so accepting one here would only
   fail later and slower.
2. Extracts text with PDFBox. No OCR — a scanned page has no selectable text and
   is refused with a 422 rather than parsed into nothing. Text is capped at
   20,000 characters before it reaches the model.
3. Sends the text to Gemini through the same `geminiChatClient` and structured
   output the interview features use.
4. Resolves the names the model returned against the database, creating the
   skills the shared list is missing.
5. Stores the PDF **last**, privately, and returns its `sourceFileUrl`.

The order in step 5 is the point: every rejection above happens before the file
is stored, so a bad upload leaves no orphaned object in MinIO. A recruiter who
parses a PDF and then abandons the form does leave one — the file is uploaded at
pick time because reading it is the whole purpose.

`sourceFileUrl` rides along on the eventual `JobPostRequest` and is stored on
`job_posts.source_file_url`. It is returned on the recruiter's own job responses
and deliberately absent from `PublicJobResponse`: a source JD often carries
internal notes or salary bands the recruiter did not choose to publish.

## The recruiter sees the whole readout

Extraction is a guess dressed as data, so `JobImportSummary` lists all of it
rather than leaving the recruiter to diff the form against their own document:
every field filled and its value, every field the document did not state, every
section heading found, and every skill attached — split into the ones we already
had and the ones the import created, each with its type. A skill with no type
says "no type" rather than showing nothing, and the card says plainly that new
skills are already stored while the job itself is not.

## What the model is and isn't trusted with

The model returns free text and names only, never database ids, and the service
pins its answers to things the form can render:

- `jobType`, `workMode` and `experienceLevel` are matched against the same
  vocabularies the selects offer (`src/lib/job-options.ts`). Anything else
  becomes null rather than an option that cannot be displayed.
- `categoryName` is matched case-insensitively against existing categories. No
  match means no category.
- Skill names are resolved against the skills table, and the ones it is missing
  are **created as part of the import** — see "Skills come from the document"
  below. The model's `skillType` guess is constrained to LANGUAGE, FRAMEWORK,
  LIBRARY, TOOL, PLATFORM, DATABASE, METHODOLOGY or DOMAIN; anything else
  becomes null rather than seeding the table with a one-off label.
- Salaries are dropped when zero or negative, and swapped when a range comes
  back the wrong way round.
- `expiredAt` is not extracted at all. An "apply by" date printed in a JD is
  usually stale by the time the post goes up.
- Sections are deduplicated to one per type and ordered by the enum, so the form
  lays them out the same way regardless of how the PDF was arranged.

Any field the document did not state comes back null, and `applyParsed` in
`JobForm` leaves the recruiter's existing value alone for every null. Importing
into a half-filled form adds to it and never erases it.

## Sections and skills now round-trip

Saving replaces a job's whole section and skill lists. The form previously sent
only the requirements section and no skills at all, so editing a job silently
dropped everything else. It now carries every section as an editable block and
every attached skill as a chip, removable, with a text input for adding more.

## Skills come from the document

The skills table was curated by admins alone, and the first real import showed
what that costs: every one of "JavaScript, React, Next.js, Tailwind CSS…" was
missing, so the job would have gone up with no skills at all.

So the import does not ask. Every skill the PDF names is attached, and the ones
the shared list lacks are created on the spot, attributed to the recruiter who
uploaded the document. Recruiters can also add one by hand through the same
path, `POST /api/v1/recruiter/skills`.

Both routes go through `findOrCreateAll`, which is **find-or-create, not
create**: an existing skill with the same name in any casing is reused, so
"react" / "React" / "REACT" cannot become three rows; duplicates within one
document collapse; inner whitespace is normalized so "React   Native" cannot
shadow "React Native"; and a lost race against another recruiter reads back the
winner's row instead of failing. A skill that already exists keeps the name and
type it is stored under — attaching one is not reclassifying it. A skill typed
by hand is created with no type at all.

Inserts run through `SkillCreator` with `REQUIRES_NEW`. A unique-index violation
marks its transaction rollback-only, and recovering means reading the winner's
row afterwards — impossible in a transaction the violation already poisoned. An
isolated insert leaves the caller's transaction usable.

**Parsing therefore writes to the shared skills list**, and does so before the
recruiter has saved anything. A recruiter who imports a PDF and then abandons
the form still leaves the skills it named behind. That is the deliberate trade
for jobs that carry the technologies they ask for; the attribution below is what
makes it reviewable.

### Admins can see what came from a recruiter

`skills.created_by_recruiter_profile_id` (migration `V12`) records who added a
skill; null means an admin did, which is every row that predates the column.
`SkillResponse` exposes it as `createdByRecruiterProfileId` plus
`createdByCompanyName` — the company rather than the person, since identity
lives in Keycloak and "Acme Ltd" tells a reviewing admin more than a user id.
`GET /api/v1/admin/skills` resolves those names in one batched query rather than
one per row.

There is no admin UI in this repository, so the marker is on the API only. A
frontend that lists skills for moderators can show it without further backend
work.

## Sections are free-form

Beyond the dedicated requirements editor, a recruiter adds as many sections as
they like and writes each heading themselves — "Our stack", "How we hire",
anything. Order is theirs too, and becomes `displayOrder`.

The API still wants one of six `JobPostSectionType` values per section, but
nothing in the app renders by type: both the public and recruiter job pages show
`title` verbatim, sorted by `displayOrder`. So the type is never asked for.
Sections loaded from the API or a parsed PDF keep the type they came with; ones
the recruiter wrote get a type derived from their heading at save time
(`deriveSectionType` in `src/lib/job-options.ts`), falling back to the neutral
`ABOUT_ROLE`.

Two sections may therefore share a type. That is fine: `job_post_sections` is
created by `ddl-auto: update` with `section_type` as a plain varchar and no
unique constraint, and `replaceSections` clears and re-inserts the list whole.
