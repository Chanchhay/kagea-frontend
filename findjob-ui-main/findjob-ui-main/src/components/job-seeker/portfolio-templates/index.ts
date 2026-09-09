import type { ComponentType } from "react";
import { DEFAULT_PORTFOLIO_TEMPLATE_ID } from "@/lib/portfolio-data";
import { EditorialTemplate } from "./EditorialTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ShowcaseTemplate } from "./ShowcaseTemplate";
import { SpotlightTemplate } from "./SpotlightTemplate";
import type { PortfolioTemplateProps } from "./shared";

export type PortfolioTemplate = {
  id: string;
  name: string;
  description: string;
  /** Drives the schematic drawn on the picker card. */
  layout: "grid" | "rows" | "list" | "dark";
  component: ComponentType<PortfolioTemplateProps>;
};

export const PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
  {
    id: "showcase",
    name: "Showcase",
    description: "Hero header over a grid of image-led project cards.",
    layout: "grid",
    component: ShowcaseTemplate,
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Serif magazine rows — best for a few strong projects.",
    layout: "rows",
    component: EditorialTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Compact list with thumbnails; handles many projects.",
    layout: "list",
    component: MinimalTemplate,
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "Dark and high contrast, so cover images stand out.",
    layout: "dark",
    component: SpotlightTemplate,
  },
];

export const PORTFOLIO_ACCENTS = [
  { value: "#059669", label: "Emerald" },
  { value: "#2563eb", label: "Blue" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#db2777", label: "Rose" },
  { value: "#ea580c", label: "Orange" },
  { value: "#0f172a", label: "Slate" },
];

export function getPortfolioTemplate(templateId: string): PortfolioTemplate {
  return (
    PORTFOLIO_TEMPLATES.find((template) => template.id === templateId) ??
    PORTFOLIO_TEMPLATES.find((template) => template.id === DEFAULT_PORTFOLIO_TEMPLATE_ID) ??
    PORTFOLIO_TEMPLATES[0]
  );
}

export type { PortfolioTemplateProps };
