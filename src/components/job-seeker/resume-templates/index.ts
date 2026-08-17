import type { ComponentType } from "react";
import { DEFAULT_TEMPLATE_ID } from "@/lib/resume-data";
import { ClassicTemplate } from "./ClassicTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ModernTemplate } from "./ModernTemplate";
import type { ResumeTemplateProps } from "./shared";

export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  /** Shown on the picker card so the layout is recognisable before selecting. */
  layout: "sidebar" | "single" | "header" | "centered";
  component: ComponentType<ResumeTemplateProps>;
};

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Photo header with a contact and skills sidebar.",
    layout: "sidebar",
    component: ClassicTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "One column, no photo — the safest for resume scanners.",
    layout: "single",
    component: MinimalTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Colored header band with a timeline of your experience.",
    layout: "header",
    component: ModernTemplate,
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Serif type and a centered masthead for a formal look.",
    layout: "centered",
    component: ElegantTemplate,
  },
];

export const ACCENT_PRESETS = [
  { value: "#059669", label: "Emerald" },
  { value: "#2563eb", label: "Blue" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#db2777", label: "Rose" },
  { value: "#ea580c", label: "Orange" },
  { value: "#0f172a", label: "Slate" },
];

export function getTemplate(templateId: string): ResumeTemplate {
  return (
    RESUME_TEMPLATES.find((template) => template.id === templateId) ??
    RESUME_TEMPLATES.find((template) => template.id === DEFAULT_TEMPLATE_ID) ??
    RESUME_TEMPLATES[0]
  );
}

export type { ResumeTemplateProps };
