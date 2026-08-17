"use client";

import { Check } from "lucide-react";
import { PORTFOLIO_ACCENTS, PORTFOLIO_TEMPLATES, type PortfolioTemplate } from "@/components/job-seeker/portfolio-templates";

/** Template and accent chooser for portfolios, matching the resume builder's. */
export function PortfolioTemplatePicker({
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
        {PORTFOLIO_TEMPLATES.map((template) => {
          const active = template.id === templateId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateChange(template.id)}
              aria-pressed={active}
              className={`rounded-2xl border p-2.5 text-left transition ${
                active ? "border-primary bg-chip-soft ring-2 ring-primary/10" : "border-ws-line bg-ws-card hover:bg-ws-card-hover"
              }`}
            >
              <div className={`relative aspect-4/3 w-full overflow-hidden rounded-lg shadow-sm ${template.layout === "dark" ? "bg-[#0b0b0f]" : "bg-white"}`}>
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
          {PORTFOLIO_ACCENTS.map((preset) => (
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

function Thumbnail({ layout, accent }: { layout: PortfolioTemplate["layout"]; accent: string }) {
  if (layout === "grid") {
    return (
      <div className="flex size-full flex-col">
        <div className="space-y-1 p-2.5" style={{ background: `${accent}1f` }}>
          <span className="block h-1.5 w-1/2 rounded-full bg-slate-700" />
          <span className="block h-1 w-1/3 rounded-full" style={{ background: accent }} />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-1.5 p-2.5">
          {[0, 1, 2, 3].map((cell) => (
            <span key={cell} className="rounded" style={{ background: `${accent}26` }} />
          ))}
        </div>
      </div>
    );
  }

  if (layout === "rows") {
    return (
      <div className="flex size-full flex-col gap-1.5 p-2.5">
        <span className="block h-2 w-2/3 rounded-full bg-slate-700" />
        <span className="block h-px w-full bg-slate-300" />
        <div className="flex flex-1 gap-1.5">
          <span className="w-1/2 rounded" style={{ background: `${accent}26` }} />
          <span className="flex-1 space-y-1 py-1">
            <span className="block h-1 w-3/4 rounded-full bg-slate-400" />
            <span className="block h-1 rounded-full bg-slate-200" />
            <span className="block h-1 w-5/6 rounded-full bg-slate-200" />
          </span>
        </div>
        <div className="flex flex-1 flex-row-reverse gap-1.5">
          <span className="w-1/2 rounded" style={{ background: `${accent}26` }} />
          <span className="flex-1 space-y-1 py-1">
            <span className="block h-1 w-3/4 rounded-full bg-slate-400" />
            <span className="block h-1 rounded-full bg-slate-200" />
          </span>
        </div>
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="size-full space-y-2 p-3">
        <span className="block h-1.5 w-1/2 rounded-full bg-slate-700" />
        <span className="block h-1 w-1/3 rounded-full bg-slate-300" />
        {[0, 1, 2].map((row) => (
          <span key={row} className="flex gap-1.5 border-t border-slate-100 pt-1.5">
            <span className="size-5 shrink-0 rounded" style={{ background: `${accent}26` }} />
            <span className="flex-1 space-y-1 pt-0.5">
              <span className="block h-1 w-2/3 rounded-full bg-slate-400" />
              <span className="block h-1 rounded-full bg-slate-200" />
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col">
      <div className="space-y-1 p-2.5">
        <span className="block h-1.5 w-1/2 rounded-full bg-white/90" />
        <span className="block h-1 w-1/3 rounded-full" style={{ background: accent }} />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-1.5 p-2.5 pt-0">
        {[0, 1].map((cell) => (
          <span key={cell} className="rounded bg-white/10 ring-1 ring-white/15" />
        ))}
      </div>
    </div>
  );
}
