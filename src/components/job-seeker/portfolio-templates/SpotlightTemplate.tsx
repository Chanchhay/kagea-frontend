"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { Code2 as Github, ExternalLink } from "lucide-react";
import { Cover, EmptyProjects, Page, ProjectImage, TechTags, displayUrl, type PortfolioTemplateProps } from "./shared";

/** Dark, high-contrast presentation where cover images do the talking. */
export function SpotlightTemplate({ title, summary, publicUrl, projects, theme }: PortfolioTemplateProps) {
  const tx = useWorkspaceTranslation();
  const accent = theme.accent;

  return (
    <Page className="bg-[#0b0b0f] text-slate-300">
      <header className="relative overflow-hidden px-16 pb-14 pt-16">
        <span
          aria-hidden="true"
          className="absolute -left-20 -top-32 size-96 rounded-full blur-3xl"
          style={{ background: `${accent}40` }}
        />
        <div className="relative flex items-start gap-8">
          {theme.showPhoto ? <Cover url={theme.photoUrl} name={title} size={104} rounded="rounded-2xl" accent={accent} /> : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white">{title}</h1>
            {theme.tagline ? <p className="mt-2 text-lg font-medium" style={{ color: accent }}>{theme.tagline}</p> : null}
            {summary ? <p className="mt-5 max-w-[640px] whitespace-pre-line text-lg leading-7 text-slate-400">{summary}</p> : null}
            {publicUrl ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold text-white" style={{ background: accent }}>
                <ExternalLink className="size-4" /> {displayUrl(publicUrl)}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <main className="px-16 pb-16">
        <h2 className="mb-7 text-lg font-semibold uppercase tracking-[0.24em] text-slate-500">{tx("Work")}</h2>
        {projects.length ? (
          <div className="grid grid-cols-2 gap-6">
            {projects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                <ProjectImage url={project.imageUrl} alt={tx(project.title)} accent={accent} className="h-44 w-full" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <TechTags techStack={project.techStack} accent={accent} muted className="mt-3" />
                  {project.description ? (
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-lg leading-6 text-slate-400">{tx(project.description)}</p>
                  ) : null}
                  {project.projectUrl || project.githubUrl ? (
                    <div className="mt-5 flex gap-5 border-t border-white/10 pt-4 text-lg font-semibold">
                      {project.projectUrl ? (
                        <span className="inline-flex items-center gap-1.5" style={{ color: accent }}>
                          <ExternalLink className="size-4" /> {tx(" Live project")}</span>
                      ) : null}
                      {project.githubUrl ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                          <Github className="size-4" /> {tx(" Source")}</span>
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
