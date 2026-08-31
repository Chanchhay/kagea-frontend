"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ScoopCorner =
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

const cornerClass: Record<ScoopCorner, string> = {
  "top-left": "ws-scoop-tl",
  "top-right": "ws-scoop-tr",
  "bottom-left": "ws-scoop-bl",
  "bottom-right": "ws-scoop-br",
};

/**
 * A card with one corner bitten away by a concave arc rather than rounded
 * outward — the scoop is a radial-gradient mask centred on the corner point,
 * so the bite reveals the real background instead of a fill that has to be
 * kept in step with it.
 *
 * Two of these facing each other across a gap read as one continuous curve,
 * which is the effect in the reference. That only holds while both cards sit
 * on the same backdrop: over a pattern, or over a neighbour on a different
 * fill, the bite reads as a hole rather than a cut.
 *
 * The mask clips children as well as the fill, so keep content clear of the
 * scooped corner — there is no overflow to spill into, and a ring or shadow on
 * this element is masked away with everything else.
 */
export function ScoopCard({
  corner = "bottom-right",
  /** How far the bite reaches in from the corner. */
  size = "2.5rem",
  /** The ordinary outward rounding on the other three corners. */
  radius = "2rem",
  className,
  style,
  children,
}: {
  corner?: ScoopCorner;
  size?: string;
  radius?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("ws-scoop", cornerClass[corner], className)}
      style={
        {
          "--scoop": size,
          borderRadius: radius,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
