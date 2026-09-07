"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const tx = useWorkspaceTranslation();
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
            <h2 className="font-semibold text-ws-fg">{tx("Your session has expired")}</h2>
            <p className="mt-1 text-sm text-ws-muted">
              {tx("Sign in again to load your resumes.")}</p>
          </div>
          <KeycloakLoginButton>{tx("Sign in again")}</KeycloakLoginButton>
        </div>
      );
    }

    return (
      <ErrorState
        message={tx(status === 403
            ? "Your account does not have access to job-seeker resumes."
            : `Unable to load resumes${typeof status === "number" ? ` (HTTP ${status})` : ""}. ${detail}`)}
        onRetry={() => void query.refetch()}
      />
    );
  }

  async function makeDefault(resume: ResumeResponse) {
    if (resume.isDefault) return;
    try { await setDefault(resume.id).unwrap(); toast.success(`“${resume.title}” is now your default resume`); } catch { toast.error(tx("Could not update your default resume.")); }
  }
  async function remove(resume: ResumeResponse) {
    if (!window.confirm(`Delete “${resume.title}”? This cannot be undone.`)) return;
    try { await deleteResume(resume.id).unwrap(); toast.success(tx("Resume deleted")); } catch { toast.error(tx("Could not delete this resume.")); }
  }

  return <div className="mx-auto max-w-6xl">
    <PageIntro title={tx("Resumes")} description={tx("Manage and organize your resumes.")} />

    <div className="mb-6 flex flex-wrap justify-end gap-3"><UploadResumeButton /><Link href="/job-seeker/resumes/new" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-brand-hover"><FilePlus2 className="size-5" /> {tx(" Create new resume")}</Link></div>

    <div className="mb-7 flex flex-col gap-4 border-b border-ws-line sm:flex-row sm:items-end sm:justify-between">
      <div className="flex gap-8 overflow-x-auto">{(["ALL", "DEFAULT", "HAS_FILE", "DRAFT"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`relative px-1 pb-4 text-sm font-semibold transition ${filter === item ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary" : "text-ws-muted hover:text-ws-fg"}`}>{item === "HAS_FILE" ? tx("Has file") : item.charAt(0) + item.slice(1).toLowerCase()}</button>)}</div>
      <label className="mb-3 flex items-center gap-3 text-sm text-ws-muted">{tx("Sort by:")}<Select value={newestFirst ? "newest" : "oldest"} onValueChange={(value) => setNewestFirst(value !== "oldest")}>
      <SelectTrigger size="sm" aria-label={tx("Sort resumes")} className="w-36 font-medium text-ws-fg"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="newest">{tx("Newest")}</SelectItem><SelectItem value="oldest">{tx("Oldest")}</SelectItem></SelectContent>
    </Select></label>
    </div>

    {visible.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((resume) => <article key={resume.id} className={`group rounded-[22px] border bg-ws-panel p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${resume.isDefault ? "border-primary ring-1 ring-primary/15" : "border-ws-line"}`}>
      {resume.visibility === "PUBLIC" || resume.isDefault ? <div className="mb-4 flex flex-wrap justify-end gap-1.5">
        {resume.visibility === "PUBLIC" ? <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[18px] font-semibold uppercase tracking-wide text-primary-foreground"><Globe2 className="size-3" /> {tx(" Public")}</span> : null}
        {resume.isDefault ? <span className="rounded-lg bg-chip-soft px-2.5 py-1.5 text-[18px] font-semibold uppercase tracking-wide text-chip-soft-fg">{tx("Default")}</span> : null}
      </div> : null}
      <Link href={`/job-seeker/resumes/${resume.id}`} className="flex items-center gap-4 rounded-2xl bg-linear-to-r from-chip-soft/70 to-ws-card-hover p-4 transition hover:from-chip-soft hover:to-ws-card">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-chip-soft text-chip-soft-fg shadow-sm ring-1 ring-chip-soft dark:border-ws-panel">
          {getResumePhoto(resume) ? <Image src={getResumePhoto(resume)!} alt={tx("{0} profile", { 0: resume.title })} fill unoptimized sizes="64px" className="object-cover" /> : <FileText className="size-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-semibold uppercase tracking-[0.14em] text-primary">{tx("Resume profile")}</p>
          <h2 className="mt-1 truncate text-base font-semibold text-ws-fg">{resume.title}</h2>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-ws-muted"><span className={`size-2 rounded-full ${resume.resumeFileUrl || hasContent(resume) ? "bg-primary" : "bg-warning"}`} /> {resume.resumeFileUrl ? tx("PDF attached") : hasContent(resume) ? tx("Profile completed") : tx("Draft")}</p>
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2 px-1"><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${resume.resumeFileUrl || hasContent(resume) ? "bg-chip-soft text-chip-soft-fg" : "bg-chip-quiet text-chip-quiet-fg"}`}>{resume.resumeFileUrl || hasContent(resume) ? tx("Complete") : tx("Draft")}</span><span className="text-xs text-ws-muted">{tx("Updated ")}{formatDate(resume.updatedAt)}</span></div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link href={`/job-seeker/resumes/${resume.id}`} aria-label={tx("Edit {0}", { 0: resume.title })} className="flex h-11 items-center justify-center rounded-xl border border-ws-line text-ws-muted hover:border-primary hover:text-primary"><Pencil className="size-4" /></Link>
        <button onClick={() => void remove(resume)} disabled={deleteState.isLoading} aria-label={tx("Delete {0}", { 0: resume.title })} className="flex h-11 items-center justify-center rounded-xl border border-ws-line text-ws-muted hover:border-destructive hover:text-destructive disabled:opacity-50"><Trash2 className="size-4" /></button>
        <button onClick={() => void makeDefault(resume)} disabled={resume.isDefault || defaultState.isLoading} aria-label={tx(resume.isDefault ? "Default resume" : `Make ${resume.title} default`)} className={`flex h-11 items-center justify-center rounded-xl border transition disabled:opacity-60 ${resume.isDefault ? "border-chip-soft bg-chip-soft text-chip-soft-fg" : "border-ws-line text-ws-muted hover:border-primary hover:text-primary"}`}><Star className={`size-4 ${resume.isDefault ? "fill-current" : ""}`} /></button>
      </div>
    </article>)}</div> : <div className="rounded-xl border border-dashed border-ws-line bg-ws-card px-6 py-16 text-center"><FileText className="mx-auto size-10 text-ws-faint" /><h2 className="mt-4 font-semibold text-ws-fg">{tx("No resumes in this view")}</h2><p className="mt-2 text-sm text-ws-muted">{tx("Choose another filter or create a new resume.")}</p></div>}
  </div>;
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
