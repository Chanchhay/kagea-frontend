/**
 * One field skin shared by every control on the auth surface so the inputs,
 * the gender select, and the password fields stay identical in both themes.
 *
 * Both themes lift the field off the panel with a fill rather than relying on
 * the border alone: the panel is white in light mode and near-black in dark, so
 * a white/black field would read as a borderless gap at a glance.
 */
export const authFieldClass =
  "h-11 w-full rounded-2xl border border-black/10 bg-surface-muted/70 text-[14px] text-heading shadow-none transition-colors"
  + " placeholder:text-muted-fg hover:border-black/16"
  + " focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/25"
  + " aria-invalid:border-error aria-invalid:ring-[3px] aria-invalid:ring-error/20"
  + " dark:border-white/14 dark:bg-white/[.045] dark:text-white dark:placeholder:text-white/35 dark:hover:border-white/22"
  + " dark:focus-visible:border-brand dark:aria-invalid:border-error";

/** Leading icon sitting inside a field that reserves `pl-11` for it. */
export const authFieldIconClass =
  "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-fg dark:text-white/45";

export const authLabelClass = "text-[13px] font-semibold text-heading";
