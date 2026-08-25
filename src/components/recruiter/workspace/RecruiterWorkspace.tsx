"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  Building2,
  FileText,
  Flag,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  Chip,
  FileCard,
  GhostChip,
  IconAction,
  FolderTabs,
  NotchedPanel,
  Panel,
  PipelineTrack,
  TimelineRow,
  toneFill,
  type Tone,
} from "@/components/workspace/primitives";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { FileGlyph } from "@/components/workspace/FileGlyph";
import { cn } from "@/lib/utils";
import type { CurrentUserResponse } from "@/contracts/api/auth";
import type {
  CompanyDocumentResponse,
  CompanyResponse,
  ForwardedApplicationResponse,
  JobPostResponse,
} from "@/contracts/api/recruiter";

type RecruiterWorkspaceProps = {
  user?: CurrentUserResponse;
  company: CompanyResponse;
  jobs: JobPostResponse[];
  candidates: ForwardedApplicationResponse[];
  documents: CompanyDocumentResponse[];
};

export function RecruiterWorkspace({
  user,
  company,
  jobs,
  candidates,
  documents,
}: RecruiterWorkspaceProps) {
  useSetPageHeading(company.name);

  const byStatus = (...statuses: JobPostResponse["status"][]) =>
    jobs.filter((job) => statuses.includes(job.status));

  const published = byStatus("PUBLISHED");
  const paused = byStatus("PAUSED");
  const drafts = byStatus("DRAFT", "PENDING");
  const retired = byStatus("CLOSED", "EXPIRED", "REJECTED");

  return (
    <div className="flex flex-col gap-5">
      <Hero
        company={company}
        candidates={candidates}
        published={published.length}
      />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-ws-muted">Job pipeline</span>
        <GhostChip>
          <Flag aria-hidden="true" className="size-3.5" />
          {today()}
        </GhostChip>
      </div>

      <PipelineTrack
        segments={[
          { label: "Published", count: published.length, tone: "solid" },
          { label: "Paused", count: paused.length, tone: "soft" },
          { label: "Drafts", count: drafts.length, tone: "quiet" },
        ]}
        restLabel={`${retired.length} closed`}
      />

      {/* The notch spends ~5.75rem of the left column on the cut, so that column
          is wider than a plain card would need — otherwise the title strip ends
          up shorter than the title it carries. */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,18.5rem)_minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex flex-col gap-5">
          <CompanyNote company={company} user={user} />
          <VerificationNote company={company} documents={documents} />
        </div>

        <ActivityStream
          jobs={jobs}
          candidates={candidates}
          documents={documents}
        />

        <CandidateFilesColumn candidates={candidates} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero({
  company,
  candidates,
  published,
}: {
  company: CompanyResponse;
  candidates: ForwardedApplicationResponse[];
  published: number;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ws-muted">
            {company.name}
          </span>
          {company.industryName ? (
            <Chip tone="soft">{company.industryName}</Chip>
          ) : null}
        </div>

        {/* The page's single anchor, sized like the balance in the reference. */}
        <p className="mt-1 flex items-baseline gap-2 text-ws-fg">
          <span className="text-5xl font-semibold tracking-tight tabular-nums lg:text-6xl">
            {candidates.length}
          </span>
          <span className="text-xl font-medium text-ws-faint lg:text-2xl">
            candidates forwarded
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/recruiter/jobs/new"
          className="flex items-center gap-2 rounded-full bg-ws-card px-5 py-3 text-sm font-medium text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
        >
          <Plus aria-hidden="true" className="size-4" />
          Post a job
        </Link>
        {/* The reference pairs two filled pills here. Both are counts worth
            acting on, so both link — a grey chip beside a green one read as a
            disabled control rather than as the second half of a pair. */}
        <Link href="/recruiter/jobs" className={heroPill("solid")}>
          {published} live
        </Link>
        <Link
          href="/recruiter/forwarded-candidates"
          className={heroPill("soft")}
        >
          {candidates.length} in review
        </Link>
        <IconAction label="More actions" className="bg-ws-card">
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </IconAction>
      </div>
    </div>
  );
}

/** Hero pills reuse the tone fills so they match the track below them. */
function heroPill(tone: Tone) {
  return `rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03] ${toneFill[tone]}`;
}

/* ---------------------------------------------------------------- notes --- */

function CompanyNote({
  company,
  user,
}: {
  company: CompanyResponse;
  user?: CurrentUserResponse;
}) {
  const rows = [
    { icon: Building2, label: "Company", value: company.name },
    { icon: UserRound, label: "Recruiter", value: user?.fullName ?? "—" },
    { icon: Mail, label: "Email", value: company.contactEmail || "Not set" },
    { icon: Phone, label: "Phone", value: company.contactPhone || "Not set" },
    { icon: MapPin, label: "Address", value: company.address || "Not set" },
  ];

  const shortcuts = [
    {
      icon: Briefcase,
      label: "Jobs",
      href: "/recruiter/jobs",
      fill: "bg-ws-panel text-ws-fg",
    },
    {
      icon: UsersRound,
      label: "Talent",
      href: "/recruiter/talent",
      fill: "bg-ws-panel text-ws-fg",
    },
    {
      icon: FileText,
      label: "Documents",
      href: "/recruiter/company/documents",
      fill: "bg-ws-panel text-ws-fg",
    },
    {
      icon: Globe,
      label: "Company",
      href: "/recruiter/company",
      fill: "bg-ws-panel text-ws-fg",
    },
  ];

  return (
    <NotchedPanel
      fill="warm"
      title="Details"
      icon={<Building2 aria-hidden="true" className="size-4" />}
      actions={
        <>
          <IconAction
            label="Edit company"
            href="/recruiter/company"
            className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <Pencil aria-hidden="true" className="size-4" />
          </IconAction>
          <IconAction
            label="More company actions"
            className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <MoreHorizontal aria-hidden="true" className="size-4" />
          </IconAction>
        </>
      }
    >
      <NoteRows rows={rows} />

      {/*
       * The reference closes this card with a tight row of small coloured
       * discs. Theirs are brand marks; ours are shortcuts, so the colours come
       * from the workspace tones — an ink-on-ink tint disappears against the
       * yellow, which is why these carry their own fill.
       */}
      <div className="mt-4 flex items-center gap-1.5">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.label}
            href={shortcut.href}
            aria-label={shortcut.label}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-transform hover:scale-110",
              shortcut.fill,
            )}
          >
            <shortcut.icon aria-hidden="true" className="size-3.5" />
          </Link>
        ))}
      </div>
    </NotchedPanel>
  );
}

function VerificationNote({
  company,
  documents,
}: {
  company: CompanyResponse;
  documents: CompanyDocumentResponse[];
}) {
  const pending = documents.filter((document) => document.status === "PENDING");
  const approved = company.verificationStatus === "APPROVED";

  return (
    <NotchedPanel
      fill="cool"
      title="Verification"
      icon={<ShieldCheck aria-hidden="true" className="size-4" />}
      actions={
        <>
          <IconAction
            label="Manage documents"
            href="/recruiter/company/documents"
            className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <Pencil aria-hidden="true" className="size-4" />
          </IconAction>
          <IconAction
            label="More verification actions"
            className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <MoreHorizontal aria-hidden="true" className="size-4" />
          </IconAction>
        </>
      }
    >
      <NoteRows
        rows={[
          {
            icon: ShieldCheck,
            label: "Status",
            value: humanize(company.verificationStatus),
          },
          {
            icon: FileText,
            label: "Documents",
            value: pending.length
              ? `${pending.length} awaiting review`
              : `${documents.length} on file`,
          },
          {
            icon: Building2,
            label: "Industry",
            value: company.industryName || "Not set",
          },
          {
            icon: Briefcase,
            label: "Registration",
            value: company.businessRegistrationNo || "Not set",
          },
        ]}
      />

      {/* Mirrors the yellow card's disc row, so the pair share a rhythm. */}
      <div className="mt-4 flex items-center gap-1.5">
        <Chip
          tone={approved ? "solid" : "soft"}
          className="px-2.5 py-1 text-[11px]"
        >
          {approved ? "Verified" : "Awaiting review"}
        </Chip>
        <span className="inline-flex items-center rounded-full bg-ws-panel px-2.5 py-1 text-[11px] font-semibold text-ws-muted">
          {pending.length ? `${pending.length} pending` : "Docs clear"}
        </span>
      </div>
    </NotchedPanel>
  );
}

/**
 * The label/value rhythm both note cards share: a muted caption with the value
 * set tight underneath it, and a small icon in the gutter. Sentence case, not
 * uppercase — the reference's captions are quiet, and letterspaced caps read
 * as headings competing with the card title.
 */
function NoteRows({
  rows,
}: {
  rows: { icon: LucideIcon; label: string; value: string }[];
}) {
  return (
    <dl className="flex flex-col gap-2.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-2.5">
          <row.icon
            aria-hidden="true"
            className="mt-px size-3.5 shrink-0 opacity-45"
          />
          <div className="min-w-0">
            <dt className="text-[11px] font-medium leading-4 opacity-55">
              {row.label}
            </dt>
            <dd className="truncate text-[13px] font-semibold leading-4">
              {row.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------ activity stream --- */

const streamTabs = ["Candidates", "Jobs", "Documents"] as const;
type StreamTab = (typeof streamTabs)[number];

type Row = {
  key: string;
  href: string;
  date: string;
  icon: React.ReactNode;
  iconTone: Tone;
  title: string;
  meta: string;
  chip: string;
  chipTone: Tone;
  done: boolean;
};

function ActivityStream({
  jobs,
  candidates,
  documents,
}: {
  jobs: JobPostResponse[];
  candidates: ForwardedApplicationResponse[];
  documents: CompanyDocumentResponse[];
}) {
  const [tab, setTab] = useState<StreamTab>("Candidates");

  const rows =
    tab === "Jobs"
      ? jobs.map(jobRow)
      : tab === "Documents"
        ? documents.map(documentRow)
        : candidates.map(candidateRow);

  const sections = [
    { heading: "In progress", rows: rows.filter((row) => !row.done) },
    { heading: "Done", rows: rows.filter((row) => row.done) },
  ];

  return (
    <div className="flex min-h-104 flex-col">
      {/* The tabs are cut from the card below them, not floated above it. */}
      <FolderTabs
        tabs={streamTabs}
        value={tab}
        onChange={setTab}
        aside={`${rows.length} total`}
      />

      <Panel className="flex flex-1 flex-col rounded-tl-[28px] p-0 pt-3">
        <div className="ws-scroll flex-1 overflow-y-auto px-3 pb-4">
          {sections.map((section) =>
            section.rows.length ? (
              <div key={section.heading} className="mb-2">
                <h3 className="px-2 py-3 text-lg font-medium text-ws-fg">
                  {section.heading}
                </h3>
                <ul className="flex flex-col">
                  {section.rows.map((row, index) => (
                    <TimelineRow
                      key={row.key}
                      href={row.href}
                      date={row.date}
                      icon={row.icon}
                      iconTone={row.iconTone}
                      title={row.title}
                      meta={row.meta}
                      chip={row.chip}
                      chipTone={row.chipTone}
                      done={row.done}
                      last={index === section.rows.length - 1}
                    />
                  ))}
                </ul>
              </div>
            ) : null,
          )}

          {rows.length ? null : (
            <p className="px-2 py-10 text-center text-sm text-ws-faint">
              Nothing in this stream yet.
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
}

function candidateRow(item: ForwardedApplicationResponse): Row {
  const status = item.application.status;
  const done = status === "HIRED" || status === "REJECTED";

  return {
    key: `candidate-${item.application.id}`,
    href: `/recruiter/forwarded-candidates/${item.application.id}`,
    date: shortDate(item.forwardedAt),
    icon: <UsersRound aria-hidden="true" className="size-4" />,
    iconTone: done ? "quiet" : "solid",
    title:
      item.candidate.headline || item.candidate.currentPosition || "Candidate",
    meta: `${item.application.jobTitle} • ${item.submittedResume?.title || "No resume"}`,
    chip: humanize(status),
    chipTone: status === "REJECTED" ? "alert" : done ? "quiet" : "soft",
    done,
  };
}

function jobRow(job: JobPostResponse): Row {
  const done = ["CLOSED", "EXPIRED", "REJECTED"].includes(job.status);

  return {
    key: `job-${job.id}`,
    href: `/recruiter/jobs/${job.id}`,
    date: shortDate(job.publishedAt),
    icon: <Briefcase aria-hidden="true" className="size-4" />,
    iconTone: job.status === "PUBLISHED" ? "solid" : "soft",
    title: job.title,
    meta: [job.location, humanize(job.workMode), humanize(job.jobType)]
      .filter(Boolean)
      .join(" • "),
    chip: humanize(job.status),
    chipTone: job.status === "PUBLISHED" ? "solid" : done ? "quiet" : "soft",
    done,
  };
}

function documentRow(document: CompanyDocumentResponse): Row {
  const done = document.status === "ACTIVE";

  return {
    key: `document-${document.id}`,
    href: "/recruiter/company/documents",
    date: shortDate(document.createdAt),
    icon: <MessageSquare aria-hidden="true" className="size-4" />,
    iconTone: done ? "quiet" : "soft",
    title: humanize(document.documentType),
    meta: document.documentUrl || "No file attached",
    chip: humanize(document.status),
    chipTone: done ? "solid" : "soft",
    done,
  };
}

/* ---------------------------------------------------------------- files --- */

/**
 * The files a recruiter actually opens are the candidate's, not the company's:
 * every resume that arrived with a forwarded application, newest first. Company
 * paperwork lives on the documents page and stays out of this column.
 */
function CandidateFilesColumn({
  candidates,
}: {
  candidates: ForwardedApplicationResponse[];
}) {
  const files = [...candidates]
    .sort((a, b) => time(b.forwardedAt) - time(a.forwardedAt))
    .filter((item) => item.submittedResume);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-medium text-ws-fg">Candidate files</h2>
        <Link
          href="/recruiter/forwarded-candidates"
          aria-label="See all forwarded candidates"
          className="flex size-9 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
        >
          <UsersRound aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {files.map((item) => {
        const resume = item.submittedResume;
        const shared = resume.visibility === "PUBLIC";

        return (
          <FileCard
            key={`resume-${item.application.id}`}
            href={`/recruiter/forwarded-candidates/${item.application.id}`}
            eyebrow={`Forwarded ${shortDate(item.forwardedAt)}`}
            title={resume.title || "Submitted resume"}
            meta={
              item.candidate.headline ||
              item.candidate.currentPosition ||
              item.application.jobTitle
            }
            /* `visibility` is the resume's own — a public resume, not a
               portfolio, which never comes across on a forwarded application. */
            badge={shared ? "Public" : undefined}
            icon={<FileText aria-hidden="true" className="size-5" />}
            preview={<FileGlyph kind="resume" />}
          />
        );
      })}

      {files.length ? null : (
        <Panel className="text-sm text-ws-faint">
          No candidate files yet. Resumes and portfolios appear here as soon as
          candidates are forwarded to{" "}
          <Link
            href="/recruiter/jobs"
            className="font-semibold text-ws-fg underline"
          >
            your open jobs
          </Link>
          .
        </Panel>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- helpers --- */

function humanize(value: string) {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

function time(value: string) {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function shortDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function today() {
  return new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
