import { Code2 as Github, ExternalLink } from "lucide-react";
import { Cover, EmptyProjects, Page, ProjectImage, TechTags, displayUrl, type PortfolioTemplateProps } from "./shared";

/**
 * Magazine layout: each project gets a full-width row with the cover alternating
 * sides, so a small number of strong projects carries the page.
 */
export function EditorialTemplate({ title, summary, publicUrl, projects, theme }: PortfolioTemplateProps) {
  const accent = theme.accent;

  return (
    <Page className="bg-[#faf9f7] text-slate-700">
      <header className="border-b border-slate-300 px-16 py-14">
        <div className="flex items-end justify-between gap-10">
          <div className="min-w-0">
            <h1 className="font-serif text-[46px] leading-tight tracking-tight text-slate-950">{title}</h1>
            {theme.tagline ? (
              <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.28em]" style={{ color: accent }}>{theme.tagline}</p>
            ) : null}
          </div>
          {theme.showPhoto ? <Cover url={theme.photoUrl} name={title} size={88} accent={accent} /> : null}
        </div>
        {summary ? <p className="mt-7 max-w-[700px] whitespace-pre-line font-serif text-[17px] leading-8 text-slate-600">{summary}</p> : null}
        {publicUrl ? (
          <p className="mt-6 inline-flex items-center gap-2 border-b pb-0.5 text-[13px] font-semibold" style={{ color: accent, borderColor: accent }}>
            <ExternalLink className="size-3.5" /> {displayUrl(publicUrl)}
          </p>
        ) : null}
      </header>

      <main className="px-16 py-12">
        {projects.length ? (
          <div className="space-y-14">
            {projects.map((project, index) => (
              <article key={project.id} className={`flex items-center gap-10 ${index % 2 ? "flex-row-reverse" : ""}`}>
                <ProjectImage url={project.imageUrl} alt={project.title} accent={accent} className="h-60 w-[420px] shrink-0 rounded-sm" />
                <div className="min-w-0 flex-1">
                  <span className="text-[12px] font-bold tracking-[0.24em]" style={{ color: accent }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-serif text-[28px] leading-tight text-slate-950">{project.title}</h3>
                  {project.description ? (
                    <p className="mt-3 line-clamp-5 whitespace-pre-line text-[14.5px] leading-7 text-slate-600">{project.description}</p>
                  ) : null}
                  <TechTags techStack={project.techStack} accent={accent} className="mt-4" />
                  {project.projectUrl || project.githubUrl ? (
                    <div className="mt-5 flex gap-6 text-[13px] font-semibold">
                      {project.projectUrl ? (
                        <span className="inline-flex items-center gap-1.5" style={{ color: accent }}>
                          <ExternalLink className="size-4" /> {displayUrl(project.projectUrl)}
                        </span>
                      ) : null}
                      {project.githubUrl ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-500">
                          <Github className="size-4" /> Source
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyProjects accent={accent} />
        )}
      </main>
    </Page>
  );
}
