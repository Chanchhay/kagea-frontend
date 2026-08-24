"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { normalizeResumeData, type ResumeData } from "@/lib/resume-data";
import { getTemplate } from "./resume-templates";
import { A4_WIDTH } from "./resume-templates/shared";

type ResumeSource = Record<string, unknown> | ResumeData | null | undefined;

/**
 * Renders a resume at its true A4 size (794px wide) using whichever template the
 * resume selected. Callers that need it smaller wrap it in `ResumePreview`,
 * which scales the whole sheet rather than restyling it — so what the user sees
 * in a thumbnail, in the live preview and on paper are the same document.
 */
export function ResumeDocument({ title, data }: { title: string; data: ResumeSource }) {
  const resume = normalizeResumeData(data as Record<string, unknown> | null);
  const Template = getTemplate(resume.templateId).component;
  return <Template data={resume} fallbackName={title} />;
}

/**
 * Scales a `ResumeDocument` down to the width of its container, keeping the page
 * proportions intact. Height follows the rendered document, so resumes longer
 * than one page still show in full.
 */
export function ResumePreview({ title, data, className = "" }: { title: string; data: ResumeSource; className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet) return;

    const measure = () => {
      setScale(frame.clientWidth / A4_WIDTH);
      setSheetHeight(sheet.scrollHeight);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(sheet);
    return () => observer.disconnect();
    // The observer keeps both numbers current as the container resizes and as
    // the document grows with new sections, so this only needs to run once.
  }, []);

  return (
    <div ref={frameRef} className={className}>
      <div
        className="relative w-full overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
        style={{ height: sheetHeight * scale || undefined }}
      >
        <div
          ref={sheetRef}
          style={{ width: A4_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="absolute left-0 top-0"
        >
          <ResumeDocument title={title} data={data} />
        </div>
      </div>
    </div>
  );
}
