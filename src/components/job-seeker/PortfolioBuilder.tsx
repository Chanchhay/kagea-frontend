"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, FolderKanban, Image as ImageIcon, LayoutTemplate, Layers3, Loader2, PencilLine, Save, UserRound } from "lucide-react";
import { PortfolioPreview } from "@/components/job-seeker/PortfolioDocument";
import {
  AddEntryButton,
  BuilderSection,
  EntryCard,
  Field,
  TextAreaField,
  TextField,
  moveItem,
} from "@/components/job-seeker/builder/BuilderFields";
import { PortfolioTemplatePicker } from "@/components/job-seeker/builder/PortfolioTemplatePicker";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/upload-file";
import { normalizePortfolioTheme, type PortfolioTheme } from "@/lib/portfolio-data";
import type { PortfolioProjectResponse } from "@/contracts";

/** A project being edited. `id` is set only once it exists on the server. */
export type DraftProject = {
  key: string;
  id?: number;
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  techStack: string;
  coverFile: File | null;
};

export type PortfolioBuilderSubmit = {
  title: string;
  summary: string;
  publicUrl: string;
  portfolioData: Record<string, unknown>;
  /** In display order; entries without an `id` are new. */
  projects: DraftProject[];
  /** Ids of saved projects the user removed. */
  removedProjectIds: number[];
};

type PortfolioBuilderProps = {
  initialTitle?: string;
  initialSummary?: string;
  initialPublicUrl?: string;
  initialTheme?: Record<string, unknown> | null;
  initialProjects?: PortfolioProjectResponse[];
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: PortfolioBuilderSubmit) => Promise<void>;
  onCancel?: () => void;
};

export function PortfolioBuilder({
  initialTitle = "",
  initialSummary = "",
  initialPublicUrl = "",
  initialTheme = null,
  initialProjects = [],
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: PortfolioBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [publicUrl, setPublicUrl] = useState(initialPublicUrl);
  const [theme, setTheme] = useState<PortfolioTheme>(() => normalizePortfolioTheme(initialTheme));
  const [projects, setProjects] = useState<DraftProject[]>(() => initialProjects.map(toDraft));
  const [removedProjectIds, setRemovedProjectIds] = useState<number[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pane, setPane] = useState<"edit" | "preview">("edit");

  // Staged files have not been uploaded yet, so the preview reads them straight
  // from the browser until save replaces them with stored URLs.
  const stagedPhotoUrl = useObjectUrl(photoFile);
  const stagedCovers = useObjectUrls(projects);

  const previewTheme: PortfolioTheme = stagedPhotoUrl ? { ...theme, photoUrl: stagedPhotoUrl } : theme;
  const previewProjects = projects.map((project) => ({
    ...project,
    id: project.key,
    imageUrl: stagedCovers[project.key] || project.imageUrl,
  }));

  const setThemeField = <K extends keyof PortfolioTheme>(key: K, value: PortfolioTheme[K]) =>
    setTheme((current) => ({ ...current, [key]: value }));

  const updateProject = (key: string, patch: Partial<DraftProject>) =>
    setProjects((current) => current.map((project) => (project.key === key ? { ...project, ...patch } : project)));

  const removeProject = (project: DraftProject) => {
    if (project.id) setRemovedProjectIds((current) => [...current, project.id as number]);
    setProjects((current) => current.filter((item) => item.key !== project.key));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Give your portfolio a title.");
      setPane("edit");
      return;
    }
    if (projects.some((project) => !project.title.trim())) {
      setError("Every project needs a title.");
      setPane("edit");
      return;
    }
    setError(null);

    // Upload staged images first so the API only ever receives stored URLs.
    let nextTheme = theme;
    let nextProjects = projects;
    try {
      setIsUploading(true);
      if (photoFile) {
        nextTheme = { ...theme, photoUrl: await uploadFile(photoFile, "public") };
        setTheme(nextTheme);
        setPhotoFile(null);
      }
      nextProjects = await Promise.all(
        projects.map(async (project) =>
          project.coverFile
            ? { ...project, imageUrl: await uploadFile(project.coverFile, "public"), coverFile: null }
            : project,
        ),
      );
      setProjects(nextProjects);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      return;
    } finally {
      setIsUploading(false);
    }

    await onSubmit({
      title: cleanTitle,
      summary: summary.trim(),
      publicUrl: publicUrl.trim(),
      portfolioData: nextTheme as unknown as Record<string, unknown>,
      projects: nextProjects,
      removedProjectIds,
    });
  }

  const busy = Boolean(isSubmitting) || isUploading;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-ws-card p-1 lg:hidden">
        <PaneTab active={pane === "edit"} icon={PencilLine} label="Edit" onClick={() => setPane("edit")} />
        <PaneTab active={pane === "preview"} icon={Eye} label="Preview" onClick={() => setPane("preview")} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
        <div className={`space-y-5 ${pane === "edit" ? "" : "hidden lg:block"}`}>
          <BuilderSection icon={LayoutTemplate} title="Template" description="Pick a layout and accent color. Switching keeps all your content.">
            <PortfolioTemplatePicker
              templateId={theme.templateId}
              accent={theme.accent}
              onTemplateChange={(templateId) => setThemeField("templateId", templateId)}
              onAccentChange={(accent) => setThemeField("accent", accent)}
            />
          </BuilderSection>

          <BuilderSection icon={FolderKanban} title="Portfolio details" description="The headline visitors read before they look at your work.">
            <div className="space-y-4">
              <Field label="Portfolio title" required>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Product design portfolio" maxLength={150} autoFocus />
              </Field>
              <TextField label="Tagline" value={theme.tagline} onChange={(value) => setThemeField("tagline", value)} placeholder="Frontend developer · Phnom Penh" />
              <TextAreaField
                label="About this portfolio"
                value={summary}
                onChange={setSummary}
                placeholder="Tell visitors what you do and what this collection represents…"
                maxLength={5000}
                className="min-h-32"
              />
              <Field label="Public website">
                <Input type="url" value={publicUrl} onChange={(event) => setPublicUrl(event.target.value)} placeholder="https://yourportfolio.com" maxLength={500} />
                <span className="mt-1.5 block text-xs text-ws-muted">Optional. Shown as a link on your portfolio page.</span>
              </Field>
            </div>
          </BuilderSection>

          <BuilderSection icon={UserRound} title="Portrait" description="Optional photo shown in the header of your portfolio.">
            <label className="mb-4 flex items-center gap-2.5 text-sm text-ws-fg">
              <input
                type="checkbox"
                checked={theme.showPhoto}
                onChange={(event) => setThemeField("showPhoto", event.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Show a photo in the header
            </label>
            {theme.showPhoto ? (
              <FileDropzone
                value={theme.photoUrl}
                file={photoFile}
                onFileChange={setPhotoFile}
                onClear={() => setThemeField("photoUrl", "")}
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                hint="PNG, JPG or WebP up to 5 MB."
              />
            ) : null}
          </BuilderSection>

          <BuilderSection icon={Layers3} title="Projects" description="Reorder them to control what a visitor sees first.">
            <div className="space-y-4">
              {projects.map((project, index) => (
                <EntryCard
                  key={project.key}
                  index={index}
                  total={projects.length}
                  title={project.title || `Project ${index + 1}`}
                  onMove={(from, to) => setProjects(moveItem(projects, from, to))}
                  onRemove={() => removeProject(project)}
                >
                  <Field label="Cover image">
                    <FileDropzone
                      value={project.imageUrl}
                      file={project.coverFile}
                      onFileChange={(file) => updateProject(project.key, { coverFile: file })}
                      onClear={() => updateProject(project.key, { imageUrl: "" })}
                      accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                      hint="PNG, JPG or WebP up to 5 MB."
                    />
                  </Field>
                  <TextField label="Project title" required value={project.title} onChange={(value) => updateProject(project.key, { title: value })} placeholder="Project name" />
                  <TextAreaField
                    label="Description"
                    value={project.description}
                    onChange={(value) => updateProject(project.key, { description: value })}
                    placeholder="Explain the problem, your approach, and the outcome…"
                    maxLength={5000}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Live project URL" value={project.projectUrl} onChange={(value) => updateProject(project.key, { projectUrl: value })} placeholder="https://project.com" />
                    <TextField label="GitHub URL" value={project.githubUrl} onChange={(value) => updateProject(project.key, { githubUrl: value })} placeholder="https://github.com/…" />
                  </div>
                  <TextField label="Tech stack" value={project.techStack} onChange={(value) => updateProject(project.key, { techStack: value })} placeholder="Next.js, TypeScript, PostgreSQL" />
                </EntryCard>
              ))}
            </div>
            <AddEntryButton label="Add project" onClick={() => setProjects([...projects, blankProject()])} />
          </BuilderSection>

          {error ? <p role="alert" className="text-sm font-medium text-destructive">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 border-t border-ws-line pt-5 sm:flex-row sm:justify-end">
            {onCancel ? (
              <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={busy} className="h-11 rounded-xl px-5">
              {busy ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
              {isUploading ? "Uploading…" : isSubmitting ? "Saving…" : submitLabel}
            </Button>
          </div>
        </div>

        <div className={`lg:sticky lg:top-6 ${pane === "preview" ? "" : "hidden lg:block"}`}>
          <div className="rounded-2xl border border-ws-line bg-ws-card p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ws-muted">
              <Eye className="size-3.5" /> Live preview
            </div>
            <div className="max-h-[calc(100vh-11rem)] overflow-y-auto rounded-xl bg-ws-card-hover p-3">
              <PortfolioPreview
                title={title || "Untitled portfolio"}
                summary={summary}
                publicUrl={publicUrl}
                projects={previewProjects}
                theme={previewTheme as unknown as Record<string, unknown>}
              />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs leading-5 text-ws-muted">
              <ImageIcon className="size-3.5 shrink-0" />
              Images you pick appear here before they are uploaded on save.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

function toDraft(project: PortfolioProjectResponse): DraftProject {
  return {
    key: `saved-${project.id}`,
    id: project.id,
    title: project.title ?? "",
    description: project.description ?? "",
    projectUrl: project.projectUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    imageUrl: project.imageUrl ?? "",
    techStack: project.techStack ?? "",
    coverFile: null,
  };
}

function blankProject(): DraftProject {
  const key = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `draft-${Date.now()}`;
  return { key, title: "", description: "", projectUrl: "", githubUrl: "", imageUrl: "", techStack: "", coverFile: null };
}

/** Browser-local URL for one staged file, revoked when it changes. */
function useObjectUrl(file: File | null): string {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  return url;
}

/** Browser-local URLs for every staged project cover, keyed by draft key. */
function useObjectUrls(projects: DraftProject[]): Record<string, string> {
  // Identifies the staged files without holding them in a dep array, whose
  // length would otherwise change as projects are added and removed.
  const signature = projects
    .map((project) => (project.coverFile ? `${project.key}:${project.coverFile.name}:${project.coverFile.size}:${project.coverFile.lastModified}` : ""))
    .join("|");

  const urls = useMemo(
    () =>
      Object.fromEntries(
        projects.flatMap((project) => (project.coverFile ? [[project.key, URL.createObjectURL(project.coverFile)]] : [])),
      ) as Record<string, string>,
    // Rebuilt only when the staged files change, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature],
  );

  useEffect(() => () => {
    Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
  }, [urls]);

  return urls;
}

function PaneTab({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Eye; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
        active ? "bg-ws-panel text-ws-fg shadow-sm" : "text-ws-muted"
      }`}
    >
      <Icon className="size-4" /> {label}
    </button>
  );
}
