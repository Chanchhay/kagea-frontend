"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BriefcaseBusiness,
  Eye,
  FileText,
  FolderGit2,
  GraduationCap,
  LayoutTemplate,
  Link2,
  Loader2,
  PencilLine,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ResumePreview } from "@/components/job-seeker/ResumeDocument";
import {
  AddEntryButton,
  BuilderSection,
  EntryCard,
  Field,
  SkillsInput,
  TextAreaField,
  TextField,
  moveItem,
} from "@/components/job-seeker/builder/BuilderFields";
import { TemplatePicker } from "@/components/job-seeker/builder/TemplatePicker";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/upload-file";
import {
  blankEducation,
  blankExperience,
  blankLink,
  blankProject,
  normalizeResumeData,
  type ResumeData,
} from "@/lib/resume-data";

type ResumeBuilderProps = {
  initialTitle?: string;
  initialData?: Record<string, unknown> | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: { title: string; resumeData: Record<string, unknown> }) => Promise<void>;
  onCancel?: () => void;
};

/**
 * Form on the left, live A4 preview on the right. Every keystroke re-renders the
 * selected template, so the document the user sees while editing is exactly the
 * one that gets saved, printed and sent to recruiters.
 */
export function ResumeBuilder({
  initialTitle = "",
  initialData = null,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: ResumeBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [data, setData] = useState<ResumeData>(() => normalizeResumeData(initialData));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pane, setPane] = useState<"edit" | "preview">("edit");

  // The staged photo has not been uploaded yet, so the preview reads it straight
  // from the browser until save replaces it with the stored URL.
  const stagedPhotoUrl = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : ""), [photoFile]);
  useEffect(() => () => {
    if (stagedPhotoUrl) URL.revokeObjectURL(stagedPhotoUrl);
  }, [stagedPhotoUrl]);

  const previewData: ResumeData = stagedPhotoUrl ? { ...data, profilePhotoUrl: stagedPhotoUrl } : data;
  const previewTitle = title.trim() || "Your name";

  const set = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Give your resume a name so you can find it later.");
      setPane("edit");
      return;
    }
    if (!data.fullName.trim()) {
      setError("Add your full name before saving.");
      setPane("edit");
      return;
    }
    setError(null);

    let resumeData = data;
    if (photoFile) {
      try {
        setIsUploading(true);
        const profilePhotoUrl = await uploadFile(photoFile, "public");
        resumeData = { ...data, profilePhotoUrl };
        setData(resumeData);
        setPhotoFile(null);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    await onSubmit({ title: cleanTitle, resumeData: resumeData as unknown as Record<string, unknown> });
  }

  const busy = Boolean(isSubmitting) || isUploading;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-ws-card p-1 lg:hidden">
        <PaneTab active={pane === "edit"} icon={PencilLine} label="Edit" onClick={() => setPane("edit")} />
        <PaneTab active={pane === "preview"} icon={Eye} label="Preview" onClick={() => setPane("preview")} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className={`space-y-5 ${pane === "edit" ? "" : "hidden lg:block"}`}>
          <BuilderSection icon={LayoutTemplate} title="Template" description="Pick a layout and accent color. You can switch at any time without losing your content.">
            <TemplatePicker
              templateId={data.templateId}
              accent={data.accent}
              onTemplateChange={(templateId) => set("templateId", templateId)}
              onAccentChange={(accent) => set("accent", accent)}
            />
          </BuilderSection>

          <BuilderSection icon={FileText} title="Resume name" description="Only you see this — use it to tell your resumes apart.">
            <Field label="Resume name" required>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Product Designer — 2026"
                autoFocus
              />
            </Field>
          </BuilderSection>

          <BuilderSection icon={UserRound} title="Personal information" description="Help recruiters know who you are and how to reach you.">
            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-ws-fg">Profile photo</p>
              <FileDropzone
                value={data.profilePhotoUrl}
                file={photoFile}
                onFileChange={setPhotoFile}
                onClear={() => set("profilePhotoUrl", "")}
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                hint="PNG, JPG or WebP up to 5 MB. The Minimal template does not show a photo."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" required value={data.fullName} onChange={(value) => set("fullName", value)} placeholder="Your full name" />
              <TextField label="Professional title" value={data.professionalTitle} onChange={(value) => set("professionalTitle", value)} placeholder="e.g. Frontend Developer" />
              <TextField label="Email address" type="email" value={data.email} onChange={(value) => set("email", value)} placeholder="you@example.com" />
              <TextField label="Phone number" type="tel" value={data.phone} onChange={(value) => set("phone", value)} placeholder="+855 12 345 678" />
              <TextField label="Location" className="sm:col-span-2" value={data.location} onChange={(value) => set("location", value)} placeholder="City, country" />
            </div>
          </BuilderSection>

          <BuilderSection icon={Sparkles} title="Professional summary" description="A short introduction focused on your value and goals.">
            <TextAreaField
              label="Summary"
              value={data.summary}
              onChange={(value) => set("summary", value)}
              placeholder="Describe your experience, strengths, and the opportunity you are looking for…"
              maxLength={800}
              className="min-h-32"
            />
          </BuilderSection>

          <BuilderSection icon={BriefcaseBusiness} title="Work experience" description="Most recent role first. Put each achievement on its own line to get bullets.">
            <div className="space-y-4">
              {data.experience.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  index={index}
                  total={data.experience.length}
                  title={entry.role || entry.company || `Role ${index + 1}`}
                  onMove={(from, to) => set("experience", moveItem(data.experience, from, to))}
                  onRemove={() => set("experience", data.experience.filter((item) => item.id !== entry.id))}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Job title" value={entry.role} onChange={(value) => updateEntry("experience", entry.id, { role: value })} placeholder="Frontend Developer" />
                    <TextField label="Company" value={entry.company} onChange={(value) => updateEntry("experience", entry.id, { company: value })} placeholder="Acme Inc." />
                    <TextField label="Location" value={entry.location} onChange={(value) => updateEntry("experience", entry.id, { location: value })} placeholder="Phnom Penh" />
                    <div className="grid grid-cols-2 gap-3">
                      <TextField label="Start" value={entry.start} onChange={(value) => updateEntry("experience", entry.id, { start: value })} placeholder="Jan 2024" />
                      <TextField label="End" value={entry.current ? "" : entry.end} onChange={(value) => updateEntry("experience", entry.id, { end: value })} placeholder={entry.current ? "Present" : "Mar 2026"} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2.5 text-sm text-ws-fg">
                    <input
                      type="checkbox"
                      checked={entry.current}
                      onChange={(event) => updateEntry("experience", entry.id, { current: event.target.checked })}
                      className="size-4 accent-[var(--primary)]"
                    />
                    I currently work here
                  </label>
                  <TextAreaField
                    label="What you did"
                    value={entry.description}
                    onChange={(value) => updateEntry("experience", entry.id, { description: value })}
                    placeholder={"Led the redesign of the checkout flow\nCut page load time by 40%"}
                    hint="One achievement per line."
                  />
                </EntryCard>
              ))}
            </div>
            <AddEntryButton label="Add work experience" onClick={() => set("experience", [...data.experience, blankExperience()])} />
          </BuilderSection>

          <BuilderSection icon={GraduationCap} title="Education" description="Degrees, courses and certifications.">
            <div className="space-y-4">
              {data.education.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  index={index}
                  total={data.education.length}
                  title={entry.degree || entry.school || `Education ${index + 1}`}
                  onMove={(from, to) => set("education", moveItem(data.education, from, to))}
                  onRemove={() => set("education", data.education.filter((item) => item.id !== entry.id))}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Qualification" value={entry.degree} onChange={(value) => updateEntry("education", entry.id, { degree: value })} placeholder="BSc Computer Science" />
                    <TextField label="School" value={entry.school} onChange={(value) => updateEntry("education", entry.id, { school: value })} placeholder="Royal University of Phnom Penh" />
                    <TextField label="Year" className="sm:col-span-2" value={entry.year} onChange={(value) => updateEntry("education", entry.id, { year: value })} placeholder="2022 — 2026" />
                  </div>
                  <TextAreaField
                    label="Details (optional)"
                    value={entry.description}
                    onChange={(value) => updateEntry("education", entry.id, { description: value })}
                    placeholder="Honours, thesis, relevant coursework…"
                    className="min-h-20"
                  />
                </EntryCard>
              ))}
            </div>
            <AddEntryButton label="Add education" onClick={() => set("education", [...data.education, blankEducation()])} />
          </BuilderSection>

          <BuilderSection icon={Sparkles} title="Skills" description="The tools, languages and strengths you want recruiters to notice.">
            <SkillsInput skills={data.skills} onChange={(skills) => set("skills", skills)} />
          </BuilderSection>

          <BuilderSection icon={FolderGit2} title="Projects" description="Optional. Good for portfolios, side projects and open source.">
            <div className="space-y-4">
              {data.projects.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  index={index}
                  total={data.projects.length}
                  title={entry.name || `Project ${index + 1}`}
                  onMove={(from, to) => set("projects", moveItem(data.projects, from, to))}
                  onRemove={() => set("projects", data.projects.filter((item) => item.id !== entry.id))}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Project name" value={entry.name} onChange={(value) => updateEntry("projects", entry.id, { name: value })} placeholder="Job board redesign" />
                    <TextField label="Link" value={entry.url} onChange={(value) => updateEntry("projects", entry.id, { url: value })} placeholder="github.com/you/project" />
                  </div>
                  <TextAreaField
                    label="Description"
                    value={entry.description}
                    onChange={(value) => updateEntry("projects", entry.id, { description: value })}
                    placeholder="What it does and what you built."
                    className="min-h-20"
                  />
                </EntryCard>
              ))}
            </div>
            <AddEntryButton label="Add project" onClick={() => set("projects", [...data.projects, blankProject()])} />
          </BuilderSection>

          <BuilderSection icon={Link2} title="Links" description="Optional. Portfolio, LinkedIn, GitHub — anything worth a click.">
            <div className="space-y-4">
              {data.links.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  index={index}
                  total={data.links.length}
                  title={entry.label || `Link ${index + 1}`}
                  onMove={(from, to) => set("links", moveItem(data.links, from, to))}
                  onRemove={() => set("links", data.links.filter((item) => item.id !== entry.id))}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Label" value={entry.label} onChange={(value) => updateEntry("links", entry.id, { label: value })} placeholder="LinkedIn" />
                    <TextField label="URL" value={entry.url} onChange={(value) => updateEntry("links", entry.id, { url: value })} placeholder="linkedin.com/in/you" />
                  </div>
                </EntryCard>
              ))}
            </div>
            <AddEntryButton label="Add link" onClick={() => set("links", [...data.links, blankLink()])} />
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
              <ResumePreview title={previewTitle} data={previewData as unknown as Record<string, unknown>} />
            </div>
            <p className="mt-3 text-xs leading-5 text-ws-muted">
              This is the real document at A4 size. Save it, then use “View resume” to print or export a PDF.
            </p>
          </div>
        </div>
      </div>
    </form>
  );

  /** Patches one entry inside a repeatable section, leaving the rest untouched. */
  function updateEntry<K extends "experience" | "education" | "projects" | "links">(
    section: K,
    id: string,
    patch: Partial<ResumeData[K][number]>,
  ) {
    setData((current) => ({
      ...current,
      [section]: current[section].map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    }));
  }
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
