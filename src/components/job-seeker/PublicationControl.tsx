"use client";

import { EyeOff, Globe2, Loader2, Lock } from "lucide-react";
import type { PublicationVisibility } from "@/contracts";

const choices: { value: PublicationVisibility; label: string; icon: typeof Globe2 }[] = [
  { value: "PUBLIC", label: "Public", icon: Globe2 },
  { value: "PRIVATE", label: "Private", icon: Lock },
  { value: "HIDDEN", label: "Hidden", icon: EyeOff },
];

export function PublicationControl({ value, loading, onChange }: { value: PublicationVisibility; loading?: boolean; onChange: (value: PublicationVisibility) => void }) {
  return <div className="grid grid-cols-3 gap-2">{choices.map((choice) => { const active = value === choice.value; return <button key={choice.value} type="button" disabled={loading} onClick={() => onChange(choice.value)} className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-ws-line bg-ws-panel text-ws-muted hover:text-ws-fg"}`}><span className="flex h-4 items-center">{loading && active ? <Loader2 className="size-4 animate-spin" /> : <choice.icon className="size-4" />}</span>{choice.label}</button>; })}</div>;
}
