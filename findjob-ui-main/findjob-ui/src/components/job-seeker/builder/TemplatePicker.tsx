"use client";

import { Check } from "lucide-react";
import { ACCENT_PRESETS, RESUME_TEMPLATES, type ResumeTemplate } from "@/components/job-seeker/resume-templates";

/**
 * Template and accent chooser. The thumbnails are schematics rather than real
 * renders — they stay readable at this size and cost nothing to draw, and the
 * live preview beside the form already shows the real thing.
 */
export function TemplatePicker({
  templateId,
  accent,
  onTemplateChange,
  onAccentChange,
}: {
  templateId: string;
  accent: string;
  onTemplateChange: (templateId: string) => void;
  onAccentChange: (accent: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RESUME_TEMPLATES.map((template) => {
          const active = template.id === templateId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateChange(template.id)}
              aria-pressed={active}
              className={`group rounded-2xl border p-2.5 text-left transition ${
                active ? "border-primary bg-chip-soft ring-2 ring-primary/10" : "border-ws-line bg-ws-card hover:bg-ws-card-hover"
              }`}
            >
              <div className="relative aspect-[0.75] w-full overflow-hidden rounded-lg bg-white shadow-sm">
                <Thumbnail layout={template.layout} accent={accent} />
                {active ? (
                  <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                ) : null}
              </div>
              <p className="mt-2.5 text-sm font-semibold text-ws-fg">{template.name}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-ws-muted">{template.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-ws-fg">Accent color</span>
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onAccentChange(preset.value)}
              aria-label={preset.label}
              aria-pressed={accent === preset.value}
              className={`size-8 rounded-full transition ${accent === preset.value ? "ring-2 ring-primary ring-offset-2 ring-offset-ws-panel" : "hover:scale-110"}`}
              style={{ background: preset.value }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Thumbnail({ layout, accent }: { layout: ResumeTemplate["layout"]; accent: string }) {
  const line = "block rounded-full bg-slate-200";

  if (layout === "sidebar") {
    return (
      <div className="flex size-full flex-col p-2">
        <div className="flex items-center gap-1.5 border-b-2 pb-1.5" style={{ borderColor: accent }}>
          <span className="size-4 rounded-full" style={{ background: `${accent}33` }} />
          <span className="flex-1 space-y-1">
            <span className="block h-1.5 w-3/4 rounded-full bg-slate-700" />
            <span className="block h-1 w-1/2 rounded-full" style={{ background: accent }} />
          </span>
        </div>
        <div className="mt-1.5 grid flex-1 grid-cols-[0.6fr_1.4fr] gap-1.5">
          <div className="space-y-1 border-r border-slate-200 pr-1.5">
            <span className={`${line} h-1 w-2/3`} style={{ background: accent }} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1 w-5/6`} />
          </div>
          <div className="space-y-1">
            <span className={`${line} h-1 w-1/2`} style={{ background: accent }} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1 w-4/5`} />
            <span className={`${line} mt-2 h-1 w-1/2`} style={{ background: accent }} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1 w-3/4`} />
          </div>
        </div>
      </div>
    );
  }

  if (layout === "single") {
    return (
      <div className="size-full space-y-1.5 p-2.5">
        <span className="block h-1.5 w-2/3 rounded-full bg-slate-700" />
        <span className="block h-1 w-1/2 rounded-full bg-slate-300" />
        <span className="mt-2 block h-px w-full" style={{ background: accent }} />
        <span className={`${line} h-1`} />
        <span className={`${line} h-1 w-5/6`} />
        <span className="mt-2 block h-px w-full" style={{ background: accent }} />
        <span className={`${line} h-1`} />
        <span className={`${line} h-1`} />
        <span className={`${line} h-1 w-2/3`} />
      </div>
    );
  }

  if (layout === "header") {
    return (
      <div className="flex size-full flex-col">
        <div className="flex items-center gap-1.5 p-2" style={{ background: accent }}>
          <span className="size-4 rounded bg-white/40" />
          <span className="flex-1 space-y-1">
            <span className="block h-1.5 w-3/4 rounded-full bg-white/90" />
            <span className="block h-1 w-1/2 rounded-full bg-white/50" />
          </span>
        </div>
        <div className="grid flex-1 grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-1 p-2">
            <span className={`${line} h-1 w-1/2`} style={{ background: accent }} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1 w-4/5`} />
          </div>
          <div className="space-y-1 bg-slate-50 p-2">
            <span className={`${line} h-1 w-2/3`} style={{ background: accent }} />
            <span className={`${line} h-1`} />
            <span className={`${line} h-1 w-3/4`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col items-center space-y-1.5 p-2.5">
      <span className="block h-1.5 w-3/5 rounded-full bg-slate-700" />
      <span className="block h-1 w-2/5 rounded-full" style={{ background: accent }} />
      <span className="block h-px w-4/5" style={{ background: `${accent}66` }} />
      <span className={`${line} h-1 w-full`} />
      <span className={`${line} h-1 w-5/6`} />
      <span className="mt-1.5 block h-1 w-1/3 rounded-full bg-slate-400" />
      <span className={`${line} h-1 w-full`} />
      <span className={`${line} h-1 w-2/3`} />
    </div>
  );
}
