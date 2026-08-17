import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/resume-data";
import { Description, Sheet, contactLines, type ResumeTemplateProps } from "./shared";

/**
 * Single column, no photo, no color blocks — the shape resume parsers read most
 * reliably. Accent is used only for the section rules.
 */
export function MinimalTemplate({ data, fallbackName }: ResumeTemplateProps) {
  const name = data.fullName.trim() || fallbackName;
  const accent = data.accent;
  const contacts = [...contactLines(data), ...data.links.map((link) => link.url).filter(Boolean)];

  return (
    <Sheet className="px-16 py-14 text-[12.5px]">
      <header className="pb-6">
        <h1 className="text-[30px] font-semibold uppercase tracking-[0.12em] text-slate-950">{name}</h1>
        {data.professionalTitle ? <p className="mt-1.5 text-[14px] text-slate-600">{data.professionalTitle}</p> : null}
        {contacts.length ? (
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
            {contacts.map((item, index) => (
              <span key={`${item}-${index}`} className="break-all">
                {index > 0 ? <span className="mr-3 text-slate-300">|</span> : null}
                {item}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      {data.summary ? (
        <Section title="Summary" accent={accent}>
          <p className="whitespace-pre-line text-slate-600">{data.summary}</p>
        </Section>
      ) : null}

      {data.experience.length ? (
        <Section title="Experience" accent={accent}>
          <div className="space-y-5">
            {data.experience.map((entry) => (
              <div key={entry.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-semibold text-slate-900">
                    {entry.role}
                    {entry.company ? <span className="font-normal text-slate-600">{entry.role ? ", " : ""}{entry.company}</span> : null}
                  </p>
                  <p className="shrink-0 text-[11px] text-slate-500">{formatDateRange(entry.start, entry.end, entry.current)}</p>
                </div>
                {entry.location ? <p className="text-[11px] text-slate-500">{entry.location}</p> : null}
                <Description text={entry.description} className="mt-1.5 text-slate-600" />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.education.length ? (
        <Section title="Education" accent={accent}>
          <div className="space-y-3">
            {data.education.map((entry) => (
              <div key={entry.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{entry.degree}</p>
                  {entry.school ? <p className="text-slate-600">{entry.school}</p> : null}
                  <Description text={entry.description} className="mt-1 text-slate-600" />
                </div>
                {entry.year ? <p className="shrink-0 text-[11px] text-slate-500">{entry.year}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.skills.length ? (
        <Section title="Skills" accent={accent}>
          <p className="text-slate-600">{data.skills.join(" · ")}</p>
        </Section>
      ) : null}

      {data.projects.length ? (
        <Section title="Projects" accent={accent}>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <p className="font-semibold text-slate-900">
                  {project.name}
                  {project.url ? <span className="ml-2 break-all text-[11px] font-normal text-slate-500">{project.url}</span> : null}
                </p>
                <Description text={project.description} className="mt-1 text-slate-600" />
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </Sheet>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <section className="border-t pt-4 pb-5 last:pb-0" style={{ borderColor: `${accent}59` }}>
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
