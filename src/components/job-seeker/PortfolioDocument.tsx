"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { normalizePortfolioTheme } from "@/lib/portfolio-data";
import { getPortfolioTemplate } from "./portfolio-templates";
import { PAGE_WIDTH, type PortfolioProjectLike } from "./portfolio-templates/shared";

export type PortfolioDocumentProps = {
  title: string;
  summary: string;
  publicUrl: string;
  projects: PortfolioProjectLike[];
  /** Raw `portfolioData` from the API, or an already-normalized theme. */
  theme: Record<string, unknown> | null | undefined;
};

/**
 * Renders a portfolio at its design width using the template it selected.
 * Callers that need it smaller wrap it in `PortfolioPreview`, which scales the
 * whole page rather than restyling it.
 */
export function PortfolioDocument({ title, summary, publicUrl, projects, theme }: PortfolioDocumentProps) {
  const resolved = normalizePortfolioTheme(theme);
  const Template = getPortfolioTemplate(resolved.templateId).component;
  return <Template title={title || "Untitled portfolio"} summary={summary} publicUrl={publicUrl} projects={projects} theme={resolved} />;
}

/** Scales a `PortfolioDocument` down to the width of its container. */
export function PortfolioPreview({ className = "", ...props }: PortfolioDocumentProps & { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const page = pageRef.current;
    if (!frame || !page) return;

    const measure = () => {
      setScale(frame.clientWidth / PAGE_WIDTH);
      setPageHeight(page.scrollHeight);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(page);
    return () => observer.disconnect();
    // The observer keeps both numbers current as the container resizes and as
    // projects are added, so this only needs to run once.
  }, []);

  return (
    <div ref={frameRef} className={className}>
      <div className="relative w-full overflow-hidden rounded-xl shadow-[0_18px_50px_rgba(0,0,0,0.12)]" style={{ height: pageHeight * scale || undefined }}>
        <div ref={pageRef} style={{ width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }} className="absolute left-0 top-0">
          <PortfolioDocument {...props} />
        </div>
      </div>
    </div>
  );
}
