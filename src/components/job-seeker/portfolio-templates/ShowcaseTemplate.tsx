import { Code2 as Github, ExternalLink } from "lucide-react";
import { Cover, EmptyProjects, Page, ProjectImage, TechTags, displayUrl, type PortfolioTemplateProps } from "./shared";

/** Light hero over a two-column grid of image-led project cards. */
export function ShowcaseTemplate({ title, summary, publicUrl, projects, theme }: PortfolioTemplateProps) {
  const accent = theme.accent;

  return (
    <Page className="bg-white text-slate-700">
      <header className="px-16 pb-12 pt-16" style={{ background: `linear-gradient(160deg, ${accent}1f, transparent 70%)` }}>
        <div className="flex items-start gap-8">
          {theme.showPhoto ? <Cover url={theme.photoUrl} name={title} size={104} accent={accent} /> : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-[42px] font-bold leading-tight tracking-tight text-slate-950">{title}</h1>
            {theme.tagline ? <p className="mt-2 text-[17px] font-medium" style={{ color: accent }}>{theme.tagline}</p> : null}
            {summary ? <p className="mt-5 max-w-[640px] whitespace-pre-line text-[15px] leading-7 text-slate-600">{summary}</p> : null}
            {publicUrl ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-sm" style={{ color: accent }}>
                <ExternalLink className="size-4" /> {displayUrl(publicUrl)}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <main className="px-16 pb-16">
        <div className="mb-8 flex items-baseline justify-between border-b border-slate-200 pb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-950">Selected work</h2>
          <span className="text-[13px] text-slate-400">{projects.length} {projects.length === 1 ? "project" : "projects"}</span>
        </div>

        {projects.length ? (
          <div className="grid grid-cols-2 gap-7">
            {projects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <ProjectImage url={project.imageUrl} alt={project.title} accent={accent} className="h-45 w-full" />
                <div className="p-6">
                  <h3 className="text-[19px] font-semibold text-slate-950">{project.title}</h3>
                  <TechTags techStack={project.techStack} accent={accent} className="mt-3" />
                  {project.description ? (
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-[14px] leading-6 text-slate-600">{project.description}</p>
                  ) : null}
                  {project.projectUrl || project.githubUrl ? (
                    <div className="mt-5 flex gap-5 border-t border-slate-100 pt-4 text-[13px] font-semibold">
                      {project.projectUrl ? (
                        <span className="inline-flex items-center gap-1.5" style={{ color: accent }}>
                          <ExternalLink className="size-4" /> Live project
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
