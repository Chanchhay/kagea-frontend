"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** A collapsible card wrapping one section of the builder form. */
export function BuilderSection({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: typeof Plus;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ws-line bg-ws-panel p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ws-fg">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-ws-muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-ws-fg">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  maxLength,
  className = "min-h-28",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <Field label={label}>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} className={className} />
      <span className="mt-1.5 flex justify-between text-xs text-ws-faint">
        <span>{hint}</span>
        {maxLength ? <span>{value.length}/{maxLength}</span> : null}
      </span>
    </Field>
  );
}

/** "Add entry" button used at the foot of every repeatable section. */
export function AddEntryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ws-line py-3 text-sm font-medium text-ws-muted transition hover:border-primary hover:text-primary"
    >
      <Plus className="size-4" /> {label}
    </button>
  );
}

/**
 * One entry inside a repeatable section, with the reorder and remove controls
 * every entry type shares.
 */
export function EntryCard({
  index,
  total,
  title,
  onMove,
  onRemove,
  children,
}: {
  index: number;
  total: number;
  title: string;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ws-line bg-ws-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <GripVertical aria-hidden="true" className="size-4 shrink-0 text-ws-faint" />
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ws-fg">{title}</p>
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          aria-label="Move up"
          className="flex size-8 items-center justify-center rounded-lg text-ws-muted transition hover:bg-ws-card-hover hover:text-ws-fg disabled:opacity-30"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={index === total - 1}
          aria-label="Move down"
          className="flex size-8 items-center justify-center rounded-lg text-ws-muted transition hover:bg-ws-card-hover hover:text-ws-fg disabled:opacity-30"
        >
          <ChevronDown className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          className="flex size-8 items-center justify-center rounded-lg text-ws-muted transition hover:bg-chip-alert hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** Free-form tag input: type a skill, press Enter or comma to commit it. */
export function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const additions = raw
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill && !skills.some((existing) => existing.toLowerCase() === skill.toLowerCase()));
    if (additions.length) onChange([...skills, ...additions]);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
      return;
    }
    if (event.key === "Backspace" && !draft && skills.length) {
      onChange(skills.slice(0, -1));
    }
  };

  return (
    <div>
      {skills.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-chip-soft px-3 py-1.5 text-xs font-medium text-chip-soft-fg">
              {skill}
              <button
                type="button"
                onClick={() => onChange(skills.filter((item) => item !== skill))}
                aria-label={`Remove ${skill}`}
                className="transition hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => commit(draft)}
        placeholder="Type a skill and press Enter"
      />
      <p className="mt-2 text-xs text-ws-muted">Separate skills with Enter or a comma. Backspace removes the last one.</p>
    </div>
  );
}

/** Moves an item within a list, ignoring out-of-range targets. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
