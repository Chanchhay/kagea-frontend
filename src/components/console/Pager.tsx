"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageLike = {
  number: number;
  totalPages: number;
  totalElements: number;
  first?: boolean;
  last?: boolean;
};

/**
 * Numbered paging over a Spring or local Page object.
 *
 * The window is always the same width — first page, last page, and a run
 * around the current one, with an ellipsis where numbers were dropped — so the
 * control does not change size as you walk through a long queue.
 */
export function Pager({
  page,
  onPageChange,
}: {
  page: PageLike;
  onPageChange: (nextPage: number) => void;
}) {
  if (page.totalElements === 0) return null;

  const totalPages = Math.max(page.totalPages, 1);
  const isFirst = page.first !== undefined ? page.first : page.number === 0;
  const isLast = page.last !== undefined ? page.last : page.number >= totalPages - 1;

  return (
    <div className="flex items-center gap-3">
      <p className="hidden text-xs text-ws-faint sm:block">
        {page.totalElements.toLocaleString()}{" "}
        {page.totalElements === 1 ? "result" : "results"}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Arrow
          label="Previous page"
          disabled={isFirst}
          onClick={() => onPageChange(page.number - 1)}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Arrow>

        {pageWindow(page.number, totalPages).map((entry, index) =>
          entry === null ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-xs text-ws-faint"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page.number ? "page" : undefined}
              aria-label={`Page ${entry + 1}`}
              className={cn(
                "h-9 min-w-9 rounded-md px-2 text-sm font-medium tabular-nums transition-colors",
                entry === page.number
                  ? "bg-chip-solid text-chip-solid-fg"
                  : "text-ws-muted hover:bg-ws-card hover:text-ws-fg",
              )}
            >
              {entry + 1}
            </button>
          ),
        )}

        <Arrow
          label="Next page"
          disabled={isLast}
          onClick={() => onPageChange(page.number + 1)}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Arrow>
      </nav>
    </div>
  );
}

/**
 * The page numbers to render, zero-based, with `null` standing for a gap.
 *
 * Seven slots at most: first, last, the current page and one either side, plus
 * up to two ellipses. Short runs are returned whole.
 */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index);

  const pages = new Set<number>([0, total - 1, current]);
  if (current - 1 > 0) pages.add(current - 1);
  if (current + 1 < total - 1) pages.add(current + 1);

  if (current <= 2) [1, 2, 3].forEach((page) => pages.add(page));
  if (current >= total - 3)
    [total - 4, total - 3, total - 2].forEach((page) => pages.add(page));

  const sorted = [...pages].filter((page) => page >= 0 && page < total).sort((a, b) => a - b);

  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? [null, page] : [page],
  );
}

function Arrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-md text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
