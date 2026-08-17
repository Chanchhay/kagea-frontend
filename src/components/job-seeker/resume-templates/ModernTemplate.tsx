import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/resume-data";
import { Description, Photo, Sheet, contactLines, type ResumeTemplateProps } from "./shared";

/**
 * Full-bleed accent header with the photo, then a two-column body: experience
 * and projects lead, with skills and education kept to the right rail.
 */
export function ModernTemplate({ data, fallbackName }: ResumeTemplateProps) {
  const name = data.fullName.trim() || fallbackName;
  const accent = data.accent;
  const contacts = contactLines(data);

  return (
    <Sheet>
      <header className="flex items-center gap-7 px-14 py-10 text-white" style={{ background: accent }}>
        <Photo url={data.profilePhotoUrl} name={name} size={96} className="rounded-2xl" style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.35)" }} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight">{name}</h1>
          {data.professionalTitle ? <p className="mt-1 text-[15px] text-white/85">{data.professionalTitle}</p> : null}
          {contacts.length ? (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-white/85">
              {contacts.map((item) => (
                <span key={item} className="break-all">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[1.35fr_0.65fr]">
        <main className="space-y-7 px-12 py-10">
          {data.summary ? (
            <Section title="About me" accent={accent}>
              <p className="whitespace-pre-line text-slate-600">{data.summary}</p>
            </Section>
          ) : null}

          {data.experience.length ? (
            <Section title="Experience" accent={accent}>
              <div className="space-y-5 border-l-2 pl-5" style={{ borderColor: `${accent}33` }}>
                {data.experience.map((entry) => (
                  <div key={entry.id} className="relative">
                    <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full" style={{ background: accent }} />
                    <p className="font-semibold text-slate-900">{entry.role}</p>
                    <p className="text-[11.5px] text-slate-500">
                      {[entry.company, entry.location, formatDateRange(entry.start, entry.end, entry.current)].filter(Boolean).join(" · ")}
                    </p>
                    <Description text={entry.description} className="mt-1.5 text-[12px] text-slate-600" />
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {data.projects.length ? (
            <Section title="Projects" accent={accent}>
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    {project.url ? <p className="break-all text-[11px] text-slate-500">{project.url}</p> : null}
                    <Description text={project.description} className="mt-1 text-[12px] text-slate-600" />
                  </div>
                ))}
              </div>
            </Section>
          ) : null}
        </main>

        <aside className="space-y-7 bg-slate-50 px-8 py-10">
          {data.skills.length ? (
            <Section title="Skills" accent={accent}>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill) => (
                  <span key={skill} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: `${accent}1a`, color: accent }}>
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          ) : null}

          {data.education.length ? (
            <Section title="Education" accent={accent}>
              <div className="space-y-4 text-[12px]">
                {data.education.map((entry) => (
                  <div key={entry.id}>
                    <p className="font-semibold text-slate-800">{entry.degree}</p>
                    {entry.school ? <p className="text-slate-600">{entry.school}</p> : null}
                    {entry.year ? <p className="text-slate-500">{entry.year}</p> : null}
                    <Description text={entry.description} className="mt-1 text-slate-600" />
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {data.links.length ? (
            <Section title="Links" accent={accent}>
              <ul className="space-y-2 text-[11.5px]">
                {data.links.map((link) => (
                  <li key={link.id} className="break-all">
                    <span className="block font-medium text-slate-700">{link.label || "Link"}</span>
                    <span className="text-slate-500">{link.url}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </aside>
      </div>
    </Sheet>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
