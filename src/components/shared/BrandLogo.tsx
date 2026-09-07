import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Kagea brand assets ship as a light/dark pair rather than a single
 * recolourable mark: the wordmark is green on light backgrounds and white on
 * dark ones, while the icon keeps its green/amber palette in both. The
 * wordmark PNGs include large transparent margins, so their measured artwork
 * bounds are cropped by the wrapper to make the requested height meaningful.
 *
 * The swap is done with CSS (`dark:hidden` / `hidden dark:block`) instead of
 * `useTheme()` so the logo renders correctly in server components and never
 * flashes the wrong variant during hydration.
 */

const WORDMARK = {
  light: "/images/brand/logo1-light.png",
  dark: "/images/brand/logo1-dark.png",
  ratio: 1237 / 397,
  sourceWidth: 1672,
  sourceHeight: 941,
  trim: { x: 238, y: 272, width: 1237, height: 397 },
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
  const trimmed = "trim" in asset;
  const scale = trimmed ? height / asset.trim.height : 1;
  const imageStyle = trimmed
    ? {
        width: asset.sourceWidth * scale,
        height: asset.sourceHeight * scale,
        left: -asset.trim.x * scale,
        top: -asset.trim.y * scale,
      }
    : undefined;
  const shared = trimmed
    ? "absolute max-w-none object-fill"
    : "absolute inset-0 size-full object-contain object-left";

  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-hidden", className)}
      style={{ width, height }}
    >
      <Image
        src={asset.light}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={imageStyle}
        className={cn(shared, "dark:hidden")}
      />
      <Image
        src={asset.dark}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        priority={priority}
        style={imageStyle}
        className={cn(shared, "hidden dark:block")}
      />
    </span>
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
