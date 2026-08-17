import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { resolveFileUrl } from "@/lib/file-url";
import { parseTechStack, type PortfolioTheme } from "@/lib/portfolio-data";

/** Design width of the portfolio page; previews scale this down to fit. */
export const PAGE_WIDTH = 1024;

/** The project fields a template needs, shared by saved and unsaved projects. */
export type PortfolioProjectLike = {
  id: string | number;
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  techStack: string;
};

export type PortfolioTemplateProps = {
  title: string;
  summary: string;
  publicUrl: string;
  projects: PortfolioProjectLike[];
  theme: PortfolioTheme;
};

/** The page every portfolio template renders onto. */
export function Page({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div style={{ width: PAGE_WIDTH, ...style }} className={`flex flex-col text-[15px] leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

export function Cover({ url, name, size, rounded = "rounded-full", accent }: { url: string; name: string; size: number; rounded?: string; accent: string }) {
  const src = resolveFileUrl(url);
  if (src) {
    return (
      <Image src={src} alt={`${name} portrait`} width={size} height={size} unoptimized style={{ width: size, height: size }} className={`shrink-0 object-cover ${rounded}`} />
    );
  }
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.34, background: `${accent}1f`, color: accent }}
      className={`flex shrink-0 items-center justify-center font-bold ${rounded}`}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

/** A project's cover image, or a neutral placeholder keeping the same box. */
export function ProjectImage({ url, alt, className = "", accent }: { url: string; alt: string; className?: string; accent: string }) {
  const src = resolveFileUrl(url);
  return (
    <div className={`relative overflow-hidden ${className}`} style={src ? undefined : { background: `${accent}14` }}>
      {src ? (
        <Image src={src} alt={alt} fill unoptimized className="object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-medium" style={{ color: `${accent}99` }}>
          No cover image
        </span>
      )}
    </div>
  );
}

export function TechTags({ techStack, accent, className = "", muted = false }: { techStack: string; accent: string; className?: string; muted?: boolean }) {
  const tags = parseTechStack(techStack);
  if (!tags.length) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full px-2.5 py-1 text-[12px] font-medium"
          style={muted ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" } : { background: `${accent}1a`, color: accent }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Trims a URL down to something readable in a link label. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function EmptyProjects({ accent }: { accent: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed p-12 text-center" style={{ borderColor: `${accent}33` }}>
      <p className="font-semibold" style={{ color: accent }}>No projects yet</p>
      <p className="mt-1.5 text-[14px] text-slate-500">Add your first project and it appears here straight away.</p>
    </div>
  );
}
