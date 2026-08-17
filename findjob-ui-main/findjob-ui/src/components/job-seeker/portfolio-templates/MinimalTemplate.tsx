import { Code2 as Github, ExternalLink } from "lucide-react";
import { Cover, EmptyProjects, Page, ProjectImage, TechTags, displayUrl, type PortfolioTemplateProps } from "./shared";

/** Text-first list with small thumbnails — reads fast, works with many projects. */
export function MinimalTemplate({ title, summary, publicUrl, projects, theme }: PortfolioTemplateProps) {
  const accent = theme.accent;

  return (
    <Page className="bg-white text-slate-700">
      <header className="px-20 pb-10 pt-20">
        <div className="flex items-center gap-6">
          {theme.showPhoto ? <Cover url={theme.photoUrl} name={title} size={72} accent={accent} /> : null}
          <div className="min-w-0">
            <h1 className="text-[34px] font-semibold tracking-tight text-slate-950">{title}</h1>
            {theme.tagline ? <p className="mt-1.5 text-[15px] text-slate-500">{theme.tagline}</p> : null}
          </div>
        </div>
        {summary ? <p className="mt-8 max-w-[620px] whitespace-pre-line text-[15px] leading-7 text-slate-600">{summary}</p> : null}
        {publicUrl ? (
          <p className="mt-5 text-[13px] font-medium" style={{ color: accent }}>{displayUrl(publicUrl)}</p>
        ) : null}
      </header>

      <main className="px-20 pb-20">
        <h2 className="border-t border-slate-200 pt-8 text-[12px] font-bold uppercase tracking-[0.22em] text-slate-400">Projects</h2>
        {projects.length ? (
          <div className="mt-2 divide-y divide-slate-100">
            {projects.map((project) => (
              <article key={project.id} className="flex gap-7 py-7">
                <ProjectImage url={project.imageUrl} alt={project.title} accent={accent} className="h-24 w-32 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[18px] font-semibold text-slate-950">{project.title}</h3>
                    <div className="flex shrink-0 gap-4 text-[12.5px] font-semibold">
                      {project.projectUrl ? (
                        <span className="inline-flex items-center gap-1" style={{ color: accent }}>
                          <ExternalLink className="size-3.5" /> Live
                        </span>
                      ) : null}
                      {project.githubUrl ? (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Github className="size-3.5" /> Source
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {project.description ? (
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-[14px] leading-6 text-slate-600">{project.description}</p>
                  ) : null}
                  <TechTags techStack={project.techStack} accent={accent} className="mt-3" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8"><EmptyProjects accent={accent} /></div>
        )}
      </main>
    </Page>
  );
}
