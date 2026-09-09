import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Kagea brand assets ship as a light/dark pair rather than a single
 * recolourable mark: the wordmark is green on light backgrounds and white on
 * dark ones, while the icon keeps its green/amber palette in both.
 *
 * The swap is done with CSS (`dark:hidden` / `hidden dark:block`) instead of
 * `useTheme()` so the logo renders correctly in server components and never
 * flashes the wrong variant during hydration.
 *
 * <p>Both wordmark PNGs are cropped to their artwork, so the `height` asked
 * for here is the height that is drawn and `next/image` optimises for the size
 * actually painted. They used to ship as 1672x941 with the mark occupying only
 * the middle 1237x397, which this component cropped in CSS — scaling the whole
 * bitmap up and clipping it with `overflow-hidden`. That told `next/image` the
 * visible box (112px wide at height 36) while painting 152px of bitmap, so
 * every logo in the app was served about a third fewer pixels than it needed
 * and looked soft on HiDPI screens. Cropping the files removed the reason for
 * the trick, so the trick is gone too.
 *
 * <p>`unoptimized`, the same as the admin console does, because the optimiser
 * is the remaining source of softness. At height 36 the mark is 112px wide, so
 * Next re-encodes it to a 256px WebP and the browser scales THAT down — two
 * lossy resamples of a flat-colour mark with thin strokes. Serving the PNG
 * whole lets the browser downsample 1239px straight to 112px in one high
 * quality step, which is why the console's logo is crisp and this one was not.
 * The file is 193KB and cached; the mark is worth it.
 */

const WORDMARK = {
  light: "/images/brand/logo1-light.png",
  dark: "/images/brand/logo1-dark.png",
  width: 1239,
  height: 399,
} as const;

const MARK = {
  light: "/images/brand/icon-light.png",
  dark: "/images/brand/icon-dark.png",
  width: 612,
  height: 657,
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
  const width = Math.round(height * (asset.width / asset.height));

  /*
   * `object-contain` rather than `object-fill`: the two icon files are not
   * quite the same aspect ratio (612x657 against 504x537), and the box is
   * sized from the light one. Containing letterboxes the dark mark by a
   * fraction of a pixel; filling would stretch it.
   */
  const shared = "absolute inset-0 size-full object-contain";

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width, height }}
    >
      <Image
        src={asset.light}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className={cn(shared, "dark:hidden")}
      />
      <Image
        src={asset.dark}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        priority={priority}
        unoptimized
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
