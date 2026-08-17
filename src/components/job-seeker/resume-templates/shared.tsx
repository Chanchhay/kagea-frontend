import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { resolveFileUrl } from "@/lib/file-url";
import { toBullets, type ResumeData } from "@/lib/resume-data";

/** A4 at 96dpi, so the document prints 1:1 and previews scale by width alone. */
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

export type ResumeTemplateProps = {
  /** Fully normalized resume content. */
  data: ResumeData;
  /** Falls back to the resume title when no full name was given. */
  fallbackName: string;
};

/** The white sheet every template renders onto. */
export function Sheet({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div
      style={{ width: A4_WIDTH, minHeight: A4_HEIGHT, ...style }}
      className={`flex flex-col bg-white text-[13px] leading-relaxed text-slate-700 ${className}`}
    >
      {children}
    </div>
  );
}

export function Photo({ url, name, size, className = "", style }: { url: string; name: string; size: number; className?: string; style?: CSSProperties }) {
  const src = resolveFileUrl(url);
  if (src) {
    return (
      <Image
        src={src}
        alt={`${name} profile`}
        width={size}
        height={size}
        unoptimized
        style={{ width: size, height: size, ...style }}
        className={`shrink-0 object-cover ${className}`}
      />
    );
  }
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36, ...style }}
      className={`flex shrink-0 items-center justify-center bg-slate-100 font-bold text-slate-500 ${className}`}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

/** Renders a description textarea as bullets, or as a paragraph if it is one line. */
export function Description({ text, className = "" }: { text: string; className?: string }) {
  const bullets = toBullets(text);
  if (!bullets.length) return null;
  if (bullets.length === 1) return <p className={`whitespace-pre-line ${className}`}>{bullets[0]}</p>;
  return (
    <ul className={`list-disc space-y-1 pl-4 ${className}`}>
      {bullets.map((bullet, index) => (
        <li key={index}>{bullet}</li>
      ))}
    </ul>
  );
}

/** Contact lines, in the order every template shows them. */
export function contactLines(data: ResumeData): string[] {
  return [data.email, data.phone, data.location].map((value) => value.trim()).filter(Boolean);
}

export function hasAny<T>(items: T[]): boolean {
  return items.length > 0;
}
