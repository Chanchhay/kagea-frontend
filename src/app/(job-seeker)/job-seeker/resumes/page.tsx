"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, FilePlus2, FileText, Globe2, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ResumeResponse } from "@/contracts";
import { UploadResumeButton } from "@/components/job-seeker/UploadResumeButton";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { KeycloakLoginButton } from "@/components/auth/AuthActions";
import { resolveFileUrl } from "@/lib/file-url";
import { hasResumeContent, normalizeResumeData } from "@/lib/resume-data";
import { useDeleteResumeMutation, useGetResumesQuery, useSetDefaultResumeMutation } from "@/services/jobSeekerApi";

type Filter = "ALL" | "DEFAULT" | "HAS_FILE" | "DRAFT";

export default function ResumesPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [newestFirst, setNewestFirst] = useState(true);
  const query = useGetResumesQuery();
  const [setDefault, defaultState] = useSetDefaultResumeMutation();
  const [deleteResume, deleteState] = useDeleteResumeMutation();
  const resumes = useMemo(() => query.data ?? [], [query.data]);
  const visible = useMemo(() => resumes.filter((resume) => {
    if (filter === "DEFAULT") return resume.isDefault;
    if (filter === "HAS_FILE") return Boolean(resume.resumeFileUrl);
    if (filter === "DRAFT") return !resume.resumeFileUrl && !hasContent(resume);
    return true;
  }).sort((a, b) => (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) * (newestFirst ? 1 : -1)), [filter, newestFirst, resumes]);

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) {
    const status =
      query.error && "status" in query.error ? query.error.status : undefined;
    const detail = getQueryErrorMessage(query.error);

    if (status === 401) {
      return (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-ws-line px-6 py-10 text-center">
          <FileText className="size-8 text-ws-faint" />
          <div>
            <h2 className="font-semibold text-ws-fg">Your session has expired</h2>
            <p className="mt-1 text-sm text-ws-muted">
              Sign in again to load your resumes.
            </p>
          </div>
          <KeycloakLoginButton>Sign in again</KeycloakLoginButton>
        </div>
      );
    }

    return (
      <ErrorState
        message={
          status === 403
            ? "Your account does not have access to job-seeker resumes."
            : `Unable to load resumes${typeof status === "number" ? ` (HTTP ${status})` : ""}. ${detail}`
        }
        onRetry={() => void query.refetch()}
      />
    );
  }

  async function makeDefault(resume: ResumeResponse) {
    if (resume.isDefault) return;
    try { await setDefault(resume.id).unwrap(); toast.success(`“${resume.title}” is now your default resume`); } catch { toast.error("Could not update your default resume."); }
  }
  async function remove(resume: ResumeResponse) {
    if (!window.confirm(`Delete “${resume.title}”? This cannot be undone.`)) return;
    try { await deleteResume(resume.id).unwrap(); toast.success("Resume deleted"); } catch { toast.error("Could not delete this resume."); }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageIntro title="Resumes" description="Create, organize, and share a resume for every opportunity." />

      <section className="overflow-hidden rounded-[28px] border border-ws-line bg-ws-panel shadow-[0_18px_60px_-42px_rgba(15,23,42,.45)]">
        <div className="flex flex-col gap-5 border-b border-ws-line bg-linear-to-r from-primary/8 via-transparent to-transparent px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Career documents</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-ws-fg">Your resume library</h2>
            <p className="mt-1 text-sm text-ws-muted">{resumes.length} {resumes.length === 1 ? "resume" : "resumes"} ready to manage</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <UploadResumeButton />
            <Link href="/job-seeker/resumes/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_var(--color-primary)] transition hover:-translate-y-0.5 hover:bg-brand-hover">
              <FilePlus2 className="size-4.5" /> Create new resume
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-ws-line px-5 py-4 sm:px-7 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-ws-card p-1">
            {(["ALL", "DEFAULT", "HAS_FILE", "DRAFT"] as Filter[]).map((item) => (
              <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${filter === item ? "bg-ws-panel text-primary shadow-sm ring-1 ring-ws-line" : "text-ws-muted hover:text-ws-fg"}`}>
                {filterLabel(item)}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-sm text-ws-muted">
            Sort by
            <select value={newestFirst ? "newest" : "oldest"} onChange={(event) => setNewestFirst(event.target.value === "newest")} className="h-10 rounded-xl border border-ws-line bg-ws-panel px-3 font-semibold text-ws-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        <div className="p-5 sm:p-7">
          {visible.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((resume) => {
                const complete = Boolean(resume.resumeFileUrl) || hasContent(resume);
                const photo = getResumePhoto(resume);
                return (
                  <article key={resume.id} className={`group relative overflow-hidden rounded-[22px] border bg-ws-panel p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,.45)] ${resume.isDefault ? "border-primary/50 ring-2 ring-primary/10" : "border-ws-line"}`}>
                    <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${resume.isDefault ? "bg-primary" : "bg-linear-to-r from-primary/50 to-primary/0"}`} />
                    <div className="flex min-h-7 items-center justify-between gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${complete ? "bg-chip-soft text-chip-soft-fg" : "bg-chip-quiet text-chip-quiet-fg"}`}>{complete ? "Complete" : "Draft"}</span>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {resume.visibility === "PUBLIC" ? <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary"><Globe2 className="size-3" /> Public</span> : null}
                        {resume.isDefault ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300"><Star className="size-3 fill-current" /> Default</span> : null}
                      </div>
                    </div>

                    <Link href={`/job-seeker/resumes/${resume.id}`} className="mt-5 flex items-center gap-4 rounded-2xl bg-linear-to-br from-primary/10 via-chip-soft/50 to-ws-card-hover p-4 transition group-hover:from-primary/15">
                      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-ws-panel text-primary shadow-sm">
                        {photo ? <Image src={photo} alt={`${resume.title} profile`} fill unoptimized sizes="64px" className="object-cover" /> : <FileText className="size-7" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Resume profile</p>
                        <h3 className="mt-1 truncate text-lg font-bold tracking-tight text-ws-fg">{resume.title}</h3>
                        <p className="mt-1.5 flex items-center gap-2 text-xs text-ws-muted"><span className={`size-2 rounded-full ${complete ? "bg-primary" : "bg-warning"}`} />{resume.resumeFileUrl ? "PDF attached" : complete ? "Profile completed" : "Needs content"}</p>
                      </div>
                    </Link>

                    <p className="mt-4 flex items-center gap-2 text-xs text-ws-muted"><CalendarDays className="size-3.5" /> Updated {formatDate(resume.updatedAt)}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ws-line pt-4">
                      <Link href={`/job-seeker/resumes/${resume.id}`} aria-label={`Edit ${resume.title}`} title="Edit resume" className="flex h-10 items-center justify-center gap-2 rounded-xl bg-ws-card text-xs font-semibold text-ws-muted transition hover:bg-primary/10 hover:text-primary"><Pencil className="size-4" /><span className="hidden sm:inline">Edit</span></Link>
                      <button type="button" onClick={() => void remove(resume)} disabled={deleteState.isLoading} aria-label={`Delete ${resume.title}`} title="Delete resume" className="flex h-10 items-center justify-center rounded-xl bg-ws-card text-ws-muted transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"><Trash2 className="size-4" /></button>
                      <button type="button" onClick={() => void makeDefault(resume)} disabled={resume.isDefault || defaultState.isLoading} aria-label={resume.isDefault ? "Default resume" : `Make ${resume.title} default`} title={resume.isDefault ? "Default resume" : "Make default"} className={`flex h-10 items-center justify-center rounded-xl transition disabled:opacity-60 ${resume.isDefault ? "bg-primary/10 text-primary" : "bg-ws-card text-ws-muted hover:bg-amber-400/15 hover:text-amber-600"}`}><Star className={`size-4 ${resume.isDefault ? "fill-current" : ""}`} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ws-line bg-ws-card px-6 py-16 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FileText className="size-7" /></span>
              <h2 className="mt-4 font-semibold text-ws-fg">No resumes in this view</h2>
              <p className="mt-2 text-sm text-ws-muted">Choose another filter or create a new resume.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function hasContent(resume: ResumeResponse) { return hasResumeContent(resume.resumeData); }
function getResumePhoto(resume: ResumeResponse) {
  return resolveFileUrl(normalizeResumeData(resume.resumeData).profilePhotoUrl);
}
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
function filterLabel(filter: Filter) { return filter === "HAS_FILE" ? "Has file" : filter.charAt(0) + filter.slice(1).toLowerCase(); }

function getQueryErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return "Please try again.";

  if ("data" in error) {
    const data = error.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string" && message.trim()) return message;
    }
  }

  if ("error" in error && typeof error.error === "string") {
    return error.error;
  }

  return "Please check the API gateway and try again.";
}
