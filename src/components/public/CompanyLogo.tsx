import Image from "next/image";
import { Building2 } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { resolveFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";

type CompanyLogoProps = {
  job: Pick<PublicJobResponse, "companyName" | "companyLogoUrl" | "logoUrl">;
  /** Box size in px; the image is contained inside it. */
  size?: number;
  className?: string;
};

/**
 * The employer's uploaded logo, with a placeholder when there is none.
 *
 * <p>Two cases produce no image and both land on the placeholder: a masked
 * posting, which withholds the company entirely, and a company whose profile
 * has no logo uploaded yet. The placeholder is deliberately neutral — it
 * stands in until someone sets the company profile, and must not read as a
 * brand of its own.
 *
 * <p>`unoptimized` because employer logos are served from the API host, which
 * is not in `next.config.ts`'s `remotePatterns`; this is the same treatment
 * the landing page's client marquee gives them.
 */
export function CompanyLogo({ job, size = 44, className }: CompanyLogoProps) {
  const src = resolveFileUrl(job.companyLogoUrl ?? job.logoUrl);

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-muted",
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
          className="object-contain p-1.5"
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
