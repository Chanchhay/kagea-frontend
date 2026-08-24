import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/resume-data";
import { Description, Photo, Sheet, type ResumeTemplateProps } from "./shared";

/**
 * The original layout: photo header over an accent rule, contact and skills in
 * a narrow left column, profile and experience on the right.
 */
export function ClassicTemplate({ data, fallbackName }: ResumeTemplateProps) {
  const name = data.fullName.trim() || fallbackName;
  const accent = data.accent;

  return (
    <Sheet className="px-14 py-12">
      <header className="flex items-center gap-7 border-b-2 pb-8" style={{ borderColor: accent }}>
        <Photo url={data.profilePhotoUrl} name={name} size={104} className="rounded-full" style={{ boxShadow: `0 0 0 4px ${accent}1a` }} />
        <div className="min-w-0">
          <h1 className="text-[34px] font-bold leading-tight tracking-tight text-slate-950">{name}</h1>
          {data.professionalTitle ? (
            <p className="mt-1 text-[16px] font-medium" style={{ color: accent }}>
              {data.professionalTitle}
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[0.68fr_1.32fr] gap-9 pt-8">
        <aside className="space-y-7 border-r border-slate-200 pr-8">
          <Section title="Contact" accent={accent}>
            <div className="space-y-2.5 text-[12px]">
              <ContactRow icon={Mail} text={data.email} accent={accent} />
              <ContactRow icon={Phone} text={data.phone} accent={accent} />
              <ContactRow icon={MapPin} text={data.location} accent={accent} />
            </div>
          </Section>

          {data.links.length ? (
            <Section title="Links" accent={accent}>
              <ul className="space-y-1.5 text-[12px]">
                {data.links.map((link) => (
                  <li key={link.id} className="break-all">
                    <span className="font-medium text-slate-700">{link.label || "Link"}</span>
                    <span className="block text-slate-500">{link.url}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {data.skills.length ? (
            <Section title="Skills" accent={accent}>
              <ul className="space-y-1.5 text-[12px]">
                {data.skills.map((skill) => (
                  <li key={skill} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
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
        </aside>

        <main className="space-y-7">
          {data.summary ? (
            <Section title="Profile" accent={accent}>
              <p className="whitespace-pre-line text-slate-600">{data.summary}</p>
            </Section>
          ) : null}

          {data.experience.length ? (
            <Section title="Experience" accent={accent}>
              <div className="space-y-5">
                {data.experience.map((entry) => (
                  <div key={entry.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-semibold text-slate-900">{entry.role}</p>
                      <p className="shrink-0 text-[11px] text-slate-500">{formatDateRange(entry.start, entry.end, entry.current)}</p>
                    </div>
                    {entry.company || entry.location ? (
                      <p className="text-[12px] font-medium" style={{ color: accent }}>
                        {[entry.company, entry.location].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
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
      </div>
    </Sheet>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-slate-950">
        {title}
        <span className="mt-1.5 block h-0.5 w-8" style={{ background: accent }} />
      </h2>
      {children}
    </section>
  );
}

function ContactRow({ icon: Icon, text, accent }: { icon: typeof Mail; text: string; accent: string }) {
  if (!text) return null;
  return (
    <p className="flex items-start gap-2 text-slate-600">
      <Icon className="mt-0.5 size-3.5 shrink-0" style={{ color: accent }} />
      <span className="break-all">{text}</span>
    </p>
  );
}
