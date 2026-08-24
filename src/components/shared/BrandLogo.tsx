import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Kagea brand assets ship as a light/dark pair rather than a single
 * recolourable mark: the wordmark is green on light backgrounds and white on
 * dark ones, while the icon keeps its green/amber palette in both. Both files
 * are pre-trimmed and transparent, so a height plus `w-auto` is all the layout
 * they need.
 *
 * The swap is done with CSS (`dark:hidden` / `hidden dark:block`) instead of
 * `useTheme()` so the logo renders correctly in server components and never
 * flashes the wrong variant during hydration.
 */

const WORDMARK = {
  light: "/images/brand/logo-light.png",
  dark: "/images/brand/logo-dark.png",
  ratio: 1259 / 363,
} as const;

const MARK = {
  light: "/images/brand/icon-light.png",
  dark: "/images/brand/icon-dark.png",
  ratio: 612 / 657,
} as const;

type BrandImageProps = {
  /** Rendered height in pixels; width follows the asset's aspect ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
  /** Empty string marks the image decorative (a nearby text label names it). */
  alt?: string;
};

function ThemedImage({
  asset,
  height,
  className,
  priority,
  alt = "Kagea",
}: Omit<BrandImageProps, "height"> & {
  asset: typeof WORDMARK | typeof MARK;
  height: number;
}) {
  const width = Math.round(height * asset.ratio);
  const shared = "w-auto object-contain object-left";

  return (
    <>
      <Image
        src={asset.light}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(shared, "dark:hidden", className)}
        style={{ height, width: "auto" }}
      />
      <Image
        src={asset.dark}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        priority={priority}
        className={cn(shared, "hidden dark:block", className)}
        style={{ height, width: "auto" }}
      />
    </>
  );
}

/** Icon + wordmark lock-up. Use wherever there is horizontal room. */
export function BrandLogo({ height = 36, ...props }: BrandImageProps) {
  return <ThemedImage asset={WORDMARK} height={height} {...props} />;
}

/** Icon only. Use in rails, avatars, and other square slots. */
export function BrandMark({ height = 32, ...props }: BrandImageProps) {
  return <ThemedImage asset={MARK} height={height} {...props} />;
}
