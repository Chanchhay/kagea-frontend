"use client";

import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { cn } from "@/lib/utils";

export const PAGE_SIZES = [10, 20, 50, 100] as const;

/** Rows per page, for the footer of a paged table. */
export function PageSizeSelect({
  value,
  onChange,
  id = "page-size",
}: {
  value: number;
  /** Changing the size invalidates the current offset, so callers reset the page. */
  onChange: (size: number) => void;
  id?: string;
}) {
  const tx = useWorkspaceTranslation();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-xs whitespace-nowrap text-ws-faint">
        {tx("Rows per page")}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "flex h-9 items-center rounded-md border border-ws-line bg-ws-panel px-2 text-sm font-medium text-ws-fg outline-none transition-colors hover:bg-ws-card focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        )}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
