"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PublicJobPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function PublicJobPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PublicJobPaginationProps) {
  const firstItem = page * pageSize + 1;
  const lastItem = Math.min((page + 1) * pageSize, totalItems);
  const pages = paginationItems(page, totalPages);

  return (
    <nav
      aria-label="Public job pagination"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-sm font-medium text-heading">Showing {firstItem}–{lastItem} of {totalItems} jobs</p>
        <p className="mt-0.5 text-xs text-body">Page {page + 1} of {totalPages}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page === 0}
          onClick={() => onPageChange(Math.max(0, page - 1))}
          aria-label="Previous page"
          className="rounded-xl"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((item, index) => item === "ellipsis" ? <span key={`ellipsis-${index}`} className="flex size-10 items-center justify-center text-sm text-muted-fg">…</span> : <button key={item} type="button" onClick={() => onPageChange(item)} aria-label={`Go to page ${item + 1}`} aria-current={item === page ? "page" : undefined} className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition ${item === page ? "bg-primary text-primary-foreground shadow-sm" : "text-body hover:bg-surface-muted hover:text-heading"}`}>{item + 1}</button>)}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          aria-label="Next page"
          className="rounded-xl"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

function paginationItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index);
  const items: Array<number | "ellipsis"> = [0];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages - 2, page + 1);
  if (start > 1) items.push("ellipsis");
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < totalPages - 2) items.push("ellipsis");
  items.push(totalPages - 1);
  return items;
}
