import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/resume-data";
import { Description, Photo, Sheet, contactLines, type ResumeTemplateProps } from "./shared";

/**
 * Serif, centered masthead, generous white space — reads as a formal document
 * rather than a dashboard. Photo is optional and shown small above the name.
 */
export function ElegantTemplate({ data, fallbackName }: ResumeTemplateProps) {
  const name = data.fullName.trim() || fallbackName;
  const accent = data.accent;
  const contacts = [...contactLines(data), ...data.links.map((link) => link.url).filter(Boolean)];

  return (
    <Sheet className="px-16 py-14 font-serif text-[12.5px]">
      <header className="flex flex-col items-center border-b pb-7 text-center" style={{ borderColor: `${accent}66` }}>
        {data.profilePhotoUrl ? <Photo url={data.profilePhotoUrl} name={name} size={84} className="mb-4 rounded-full" /> : null}
        <h1 className="text-[32px] font-normal tracking-[0.06em] text-slate-950">{name}</h1>
        {data.professionalTitle ? (
          <p className="mt-2 text-[13px] uppercase tracking-[0.28em]" style={{ color: accent }}>
            {data.professionalTitle}
          </p>
        ) : null}
        {contacts.length ? (
          <p className="mt-4 max-w-[520px] text-[11px] leading-5 text-slate-500">{contacts.join("  ·  ")}</p>
        ) : null}
      </header>

      {data.summary ? (
        <section className="border-b border-slate-200 py-6 text-center">
          <p className="mx-auto max-w-[560px] whitespace-pre-line italic leading-6 text-slate-600">{data.summary}</p>
        </section>
      ) : null}

      {data.experience.length ? (
        <Section title="Experience" accent={accent}>
          <div className="space-y-5">
            {data.experience.map((entry) => (
              <div key={entry.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] text-slate-900">{entry.role}</p>
                  <p className="shrink-0 text-[11px] italic text-slate-500">{formatDateRange(entry.start, entry.end, entry.current)}</p>
                </div>
                {entry.company || entry.location ? (
                  <p className="text-[11.5px] uppercase tracking-[0.14em] text-slate-500">
                    {[entry.company, entry.location].filter(Boolean).join(" — ")}
                  </p>
                ) : null}
                <Description text={entry.description} className="mt-1.5 leading-6 text-slate-600" />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.education.length ? (
        <Section title="Education" accent={accent}>
          <div className="space-y-4">
            {data.education.map((entry) => (
              <div key={entry.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[14px] text-slate-900">{entry.degree}</p>
                  {entry.school ? <p className="text-[11.5px] uppercase tracking-[0.14em] text-slate-500">{entry.school}</p> : null}
                  <Description text={entry.description} className="mt-1 leading-6 text-slate-600" />
                </div>
                {entry.year ? <p className="shrink-0 text-[11px] italic text-slate-500">{entry.year}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.skills.length ? (
        <Section title="Skills" accent={accent}>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-slate-600">
            {data.skills.map((skill) => (
              <li key={skill} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full" style={{ background: accent }} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data.projects.length ? (
        <Section title="Projects" accent={accent}>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <p className="text-[14px] text-slate-900">{project.name}</p>
                {project.url ? <p className="break-all text-[11px] italic text-slate-500">{project.url}</p> : null}
                <Description text={project.description} className="mt-1 leading-6 text-slate-600" />
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
    <section className="py-6">
      <h2 className="mb-4 text-center text-[12px] uppercase tracking-[0.32em] text-slate-800">
        {title}
        <span className="mx-auto mt-2 block h-px w-16" style={{ background: accent }} />
      </h2>
      {children}
    </section>
  );
}
