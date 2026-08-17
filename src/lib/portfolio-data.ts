/**
 * Presentation settings for a portfolio.
 *
 * The content itself — title, summary, projects — lives in real backend columns.
 * Only the choices about *how* it is presented live here, stored as free-form
 * JSON in the `portfolioData` column added in migration V9, so new options can
 * be added without another schema change.
 */

export type PortfolioTheme = {
  templateId: string;
  accent: string;
  /** Optional line under the title, e.g. "Frontend developer · Phnom Penh". */
  tagline: string;
  /** Whether the cover section shows the owner's photo. */
  showPhoto: boolean;
  photoUrl: string;
};

export const DEFAULT_PORTFOLIO_TEMPLATE_ID = "showcase";
export const DEFAULT_PORTFOLIO_ACCENT = "#059669";

export function emptyPortfolioTheme(): PortfolioTheme {
  return {
    templateId: DEFAULT_PORTFOLIO_TEMPLATE_ID,
    accent: DEFAULT_PORTFOLIO_ACCENT,
    tagline: "",
    showPhoto: false,
    photoUrl: "",
  };
}

/** Reads whatever is stored in `portfolioData`, filling in every default. */
export function normalizePortfolioTheme(raw: Record<string, unknown> | null | undefined): PortfolioTheme {
  const source = raw ?? {};
  return {
    templateId: text(source.templateId) || DEFAULT_PORTFOLIO_TEMPLATE_ID,
    accent: text(source.accent) || DEFAULT_PORTFOLIO_ACCENT,
    tagline: text(source.tagline),
    showPhoto: source.showPhoto === true,
    photoUrl: text(source.photoUrl),
  };
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Splits the comma-separated `techStack` field into individual tags. */
export function parseTechStack(techStack: string | null | undefined): string[] {
  return (techStack ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
