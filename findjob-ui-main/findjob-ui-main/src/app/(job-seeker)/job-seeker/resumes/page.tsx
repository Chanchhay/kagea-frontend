"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, FilePlus2, FileText, Globe2, LockKeyhole, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ResumeResponse } from "@/contracts";
import { UploadResumeButton } from "@/components/job-seeker/UploadResumeButton";
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
    if (filter === "HAS_FILE") return hasFile(resume);
    if (filter === "DRAFT") return !hasFile(resume) && !hasContent(resume);
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

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "ALL", label: "All resumes", count: resumes.length },
    { value: "DEFAULT", label: "Default", count: resumes.filter((resume) => resume.isDefault).length },
    { value: "HAS_FILE", label: "Has file", count: resumes.filter(hasFile).length },
    { value: "DRAFT", label: "Draft", count: resumes.filter((resume) => !hasFile(resume) && !hasContent(resume)).length },
  ];
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-7">
      <header className="relative overflow-hidden rounded-3xl border border-ws-line bg-ws-panel p-4 sm:p-8">
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-primary sm:flex">
              <FileText aria-hidden="true" className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Resumes")}</h1>
              <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx("Manage and organize your resumes.")}</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <UploadResumeButton />
            <Link href="/job-seeker/resumes/new" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-hover ${focusRing}`}>
              <FilePlus2 aria-hidden="true" className="size-4 shrink-0" />{tx("Create new resume")}
            </Link>
          </div>
        </div>
      </header>

      <section aria-label={tx("All resumes")} className="space-y-5">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={tx("Resumes")} className="grid min-w-0 max-w-full grid-cols-2 gap-1 rounded-2xl border border-ws-line bg-ws-panel p-1.5 sm:flex sm:flex-wrap">
            {filters.map((item) => (
              <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2 sm:shrink-0 text-sm font-medium transition sm:px-4 ${focusRing} ${filter === item.value ? "bg-primary text-primary-foreground shadow-sm" : "text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg"}`}>
                <span className="min-w-0 [overflow-wrap:anywhere]">{tx(item.label)}</span>
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs tabular-nums ${filter === item.value ? "bg-primary-foreground/20" : "bg-ws-card"}`}>{item.count}</span>
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-3 text-sm text-ws-muted sm:shrink-0">
            <span>{tx("Sort by:")}</span>
            <Select value={newestFirst ? "newest" : "oldest"} onValueChange={(value) => setNewestFirst(value !== "oldest")}>
              <SelectTrigger aria-label={tx("Sort resumes")} className="h-11 w-36 rounded-xl bg-ws-panel font-medium text-ws-fg"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="newest">{tx("Newest")}</SelectItem><SelectItem value="oldest">{tx("Oldest")}</SelectItem></SelectContent>
            </Select>
          </div>
        </div>

        {visible.length ? (
          <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {visible.map((resume) => {
              const photo = getResumePhoto(resume);
              const attached = hasFile(resume);
              const populated = hasContent(resume);
              return (
                <article key={resume.id} className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ws-line bg-ws-panel shadow-xs transition duration-200 hover:border-ws-muted/40 hover:shadow-md ${resume.isDefault ? "ring-1 ring-primary/40 border-primary/40" : ""}`}>
                  <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-ws-line bg-ws-card/50 px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ws-fg">
                      {resume.visibility === "PUBLIC" ? <Globe2 aria-hidden="true" className="size-3.5 text-primary" /> : <LockKeyhole aria-hidden="true" className="size-3.5 text-ws-muted" />}
                      {tx(resume.visibility === "PUBLIC" ? "Public" : "Private")}
                    </span>
                    {resume.isDefault ? <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"><Star aria-hidden="true" className="size-3 fill-current" />{tx("Default")}</span> : null}
                  </div>
                  <Link href={`/job-seeker/resumes/${resume.id}`} className={`flex min-w-0 flex-1 items-start gap-3 p-4 sm:gap-4 sm:p-6 ${focusRing}`}>
                    <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ws-line bg-ws-card text-ws-fg">
                      {photo ? <Image src={photo} alt="" fill unoptimized sizes="56px" className="object-cover" /> : <FileText aria-hidden="true" className="size-6" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-ws-muted">{tx("Resume profile")}</p>
                      <h2 className="mt-1 [overflow-wrap:anywhere] text-lg font-semibold leading-snug tracking-tight text-ws-fg transition-colors group-hover:text-primary">{resume.title}</h2>
                      <p className="mt-3 flex items-center gap-2 text-xs text-ws-muted">
                        <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${attached || populated ? "bg-primary" : "bg-warning"}`} />
                        {tx(attached ? "Has file" : populated ? "Profile completed" : "Draft")}
                      </p>
                    </div>
                    <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-ws-faint transition-colors group-hover:text-primary" />
                  </Link>
                  <div className="flex items-center gap-2 px-5 pb-5 text-xs text-ws-muted sm:px-6">
                    <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
                    <span>{tx("Updated")} <time dateTime={resume.updatedAt}>{formatDate(resume.updatedAt)}</time></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-ws-line bg-ws-panel p-3 sm:flex-nowrap sm:p-4">
                    <Link href={`/job-seeker/resumes/${resume.id}`} aria-label={tx("Edit {0}", { 0: resume.title })} className={`inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-ws-line bg-ws-card px-2 py-2 text-center [overflow-wrap:anywhere] sm:px-3 text-sm font-semibold text-ws-fg shadow-xs transition hover:bg-ws-card-hover hover:border-ws-muted/30 ${focusRing}`}>
                      <Pencil aria-hidden="true" className="size-4 shrink-0" /><span className="min-w-0">{tx("Edit document")}</span>
                    </Link>
                    <button type="button" onClick={() => void makeDefault(resume)} disabled={resume.isDefault || defaultState.isLoading} title={tx(resume.isDefault ? "Default resume" : "Make {0} default", { 0: resume.title })} aria-label={tx(resume.isDefault ? "Default resume" : "Make {0} default", { 0: resume.title })} className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition disabled:cursor-default ${focusRing} ${resume.isDefault ? "border-primary bg-primary text-primary-foreground" : "border-ws-line bg-ws-card text-ws-muted hover:border-ws-muted/40 hover:text-ws-fg disabled:opacity-50"}`}>
                      <Star aria-hidden="true" className={`size-4 ${resume.isDefault ? "fill-current" : ""}`} />
                    </button>
                    <button type="button" onClick={() => void remove(resume)} disabled={deleteState.isLoading} title={tx("Delete {0}", { 0: resume.title })} aria-label={tx("Delete {0}", { 0: resume.title })} className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-card text-ws-muted transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 ${focusRing}`}>
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-ws-line bg-ws-panel px-6 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-chip-soft text-chip-soft-fg"><FileText aria-hidden="true" className="size-8" /></div>
            <h2 className="mt-5 text-lg font-semibold text-ws-fg">{tx("No resumes in this view")}</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ws-muted">{tx("Choose another filter or create a new resume.")}</p>
            {filter !== "ALL" ? (
              <button type="button" onClick={() => setFilter("ALL")} className={`mt-6 rounded-xl bg-chip-soft px-5 py-3 text-sm font-semibold text-chip-soft-fg ${focusRing}`}>{tx("All resumes")}</button>
            ) : (
              <Link href="/job-seeker/resumes/new" className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-hover ${focusRing}`}><FilePlus2 aria-hidden="true" className="size-4" />{tx("Create new resume")}</Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function hasContent(resume: ResumeResponse) { return hasResumeContent(resume.resumeData); }
function getResumePhoto(resume: ResumeResponse) {
  return resolveFileUrl(normalizeResumeData(resume.resumeData).profilePhotoUrl);
}
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
function hasFile(resume: ResumeResponse) { return resume.hasFile || Boolean(resume.resumeFileUrl); }

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
