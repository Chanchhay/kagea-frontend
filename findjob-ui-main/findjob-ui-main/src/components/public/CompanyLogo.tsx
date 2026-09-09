import Image from "next/image";
import { Building2 } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { resolveFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";

type CompanyLogoProps = {
  job: Pick<PublicJobResponse, "companyLogoUrl" | "logoUrl">;
  /** Box size in px; the image is contained inside it. */
  size?: number;
  className?: string;
};

/**
 * The employer's logo, with a neutral placeholder when there is none.
 *
 * <p>What arrives in `companyLogoUrl` is already the logo this viewer is
 * allowed to see: the backend's `CompanyIdentity.displayLogoUrl` swaps a masked
 * company's own logo for the stand-in an administrator set, and sends null when
 * there is neither. This component deliberately does NOT re-derive that from
 * `companyId` — a second masking rule here would contradict the first, and did:
 * it blanked the administrator's stand-in, which exists only for masked
 * postings.
 *
 * <p>The tile only fills and pads itself for the PLACEHOLDER. A real logo is
 * drawn edge to edge on a plain surface: many company marks are full-bleed
 * squares with their own background, and insetting one on a grey fill rings it
 * in somebody else's colour instead of letting it read as the icon it is.
 * `object-contain` keeps a wide wordmark from being cropped to reach that edge.
 *
 * <p>`unoptimized` because employer logos are served from the API host, which
 * is not in `next.config.ts`'s `remotePatterns`; this is the same treatment the
 * landing page's client marquee gives them.
 */
export function CompanyLogo({ job, size = 44, className }: CompanyLogoProps) {
  const src = resolveFileUrl(job.companyLogoUrl ?? job.logoUrl);

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border",
        src ? "bg-surface" : "bg-surface-muted",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          unoptimized
          sizes={`${size}px`}
          className="object-contain"
        />
      ) : (
        <Building2
          aria-hidden="true"
          className="text-muted-fg"
          style={{ width: size * 0.45, height: size * 0.45 }}
        />
      )}
    </span>
  );
}
