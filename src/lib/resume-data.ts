/**
 * The shape of a built (as opposed to uploaded) resume.
 *
 * The backend stores `resumeData` as free-form JSON, so the structure below is
 * owned entirely by the frontend. Anything read back from the API therefore
 * goes through `normalizeResumeData`, which also migrates the older flat shape
 * (where experience, education and skills were single blobs of text).
 */

export type ResumeEntryId = string;

export type ResumeExperience = {
  id: ResumeEntryId;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

export type ResumeEducation = {
  id: ResumeEntryId;
  degree: string;
  school: string;
  year: string;
  description: string;
};

export type ResumeProject = {
  id: ResumeEntryId;
  name: string;
  url: string;
  description: string;
};

export type ResumeLink = {
  id: ResumeEntryId;
  label: string;
  url: string;
};

export type ResumeData = {
  templateId: string;
  accent: string;
  profilePhotoUrl: string;
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  links: ResumeLink[];
};

export const DEFAULT_TEMPLATE_ID = "classic";
export const DEFAULT_ACCENT = "#059669";

export function emptyResumeData(): ResumeData {
  return {
    templateId: DEFAULT_TEMPLATE_ID,
    accent: DEFAULT_ACCENT,
    profilePhotoUrl: "",
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    links: [],
  };
}

/**
 * Reads whatever the API returned into a `ResumeData`. Missing fields fall back
 * to empty, and the legacy string-per-section shape is converted into a single
 * entry so resumes written by the earlier builder still open and still render.
 */
export function normalizeResumeData(raw: Record<string, unknown> | null | undefined): ResumeData {
  const source = raw ?? {};
  return {
    templateId: text(source.templateId) || DEFAULT_TEMPLATE_ID,
    accent: text(source.accent) || DEFAULT_ACCENT,
    profilePhotoUrl: text(source.profilePhotoUrl),
    fullName: text(source.fullName),
    professionalTitle: text(source.professionalTitle),
    email: text(source.email),
    phone: text(source.phone),
    location: text(source.location),
    summary: text(source.summary),
    skills: normalizeSkills(source.skills),
    experience: normalizeExperience(source.experience),
    education: normalizeEducation(source.education),
    projects: normalizeProjects(source.projects),
    links: normalizeLinks(source.links),
  };
}

/** True when the resume carries something worth rendering as a document. */
export function hasResumeContent(raw: Record<string, unknown> | null | undefined): boolean {
  const data = normalizeResumeData(raw);
  return Boolean(
    data.fullName.trim() ||
      data.professionalTitle.trim() ||
      data.email.trim() ||
      data.phone.trim() ||
      data.location.trim() ||
      data.summary.trim() ||
      data.skills.length ||
      data.experience.length ||
      data.education.length ||
      data.projects.length ||
      data.links.length,
  );
}

export function newEntryId(): ResumeEntryId {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function blankExperience(): ResumeExperience {
  return { id: newEntryId(), role: "", company: "", location: "", start: "", end: "", current: false, description: "" };
}

export function blankEducation(): ResumeEducation {
  return { id: newEntryId(), degree: "", school: "", year: "", description: "" };
}

export function blankProject(): ResumeProject {
  return { id: newEntryId(), name: "", url: "", description: "" };
}

export function blankLink(): ResumeLink {
  return { id: newEntryId(), label: "", url: "" };
}

/** "Jan 2024 — Present", or whatever half of it the user filled in. */
export function formatDateRange(start: string, end: string, current?: boolean): string {
  const to = current ? "Present" : end.trim();
  const from = start.trim();
  if (from && to) return `${from} — ${to}`;
  return from || to;
}

/** Splits a description textarea into bullet lines, dropping list markers. */
export function toBullets(description: string): string[] {
  return description
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeSkills(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(text).map((skill) => skill.trim()).filter(Boolean);
  // Legacy: a single comma or newline separated string.
  return text(value)
    .split(/[,\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function normalizeExperience(value: unknown): ResumeExperience[] {
  if (Array.isArray(value)) {
    return value
      .filter(isRecord)
      .map((entry, index) => ({
        id: text(entry.id) || `experience-${index}`,
        role: text(entry.role),
        company: text(entry.company),
        location: text(entry.location),
        start: text(entry.start),
        end: text(entry.end),
        current: entry.current === true,
        description: text(entry.description),
      }));
  }
  const legacy = text(value).trim();
  if (!legacy) return [];
  return [{ id: "experience-0", role: "", company: "", location: "", start: "", end: "", current: false, description: legacy }];
}

function normalizeEducation(value: unknown): ResumeEducation[] {
  if (Array.isArray(value)) {
    return value
      .filter(isRecord)
      .map((entry, index) => ({
        id: text(entry.id) || `education-${index}`,
        degree: text(entry.degree),
        school: text(entry.school),
        year: text(entry.year),
        description: text(entry.description),
      }));
  }
  const legacy = text(value).trim();
  if (!legacy) return [];
  return [{ id: "education-0", degree: "", school: "", year: "", description: legacy }];
}

function normalizeProjects(value: unknown): ResumeProject[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((entry, index) => ({
      id: text(entry.id) || `project-${index}`,
      name: text(entry.name),
      url: text(entry.url),
      description: text(entry.description),
    }));
}

function normalizeLinks(value: unknown): ResumeLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((entry, index) => ({
      id: text(entry.id) || `link-${index}`,
      label: text(entry.label),
      url: text(entry.url),
    }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
