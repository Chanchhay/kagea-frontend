"use client";

import { BriefcaseBusiness, CheckCircle2, GraduationCap } from "lucide-react";
import type { RegistrationRole } from "@/contracts";
import { cn } from "@/lib/utils";

type RoleSelectorProps = {
  value: RegistrationRole;
  onChange: (role: RegistrationRole) => void;
};

const roles: Array<{
  value: RegistrationRole;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    value: "SEEKER",
    title: "Job seeker",
    description: "People looking for work by company",
    icon: GraduationCap,
  },
  {
    value: "RECRUITER",
    title: "Recruiter",
    description: "Companies that need to recruit individuals",
    icon: BriefcaseBusiness,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-heading">
        Account type <span className="text-error">*</span>
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = value === role.value;

          return (
            <button
              key={role.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(role.value)}
              className={cn(
                "relative flex items-center gap-3 rounded-[16px] border p-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-brand bg-brand/8 shadow-[inset_0_0_0_1px_rgba(46,186,89,.18)] dark:bg-brand/12"
                  : "border-border bg-background/88 hover:border-brand/40 dark:border-white/10 dark:bg-black",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                  selected
                    ? "border-brand/35 bg-brand/12 text-brand dark:bg-brand/18"
                    : "border-border bg-surface-muted text-muted-foreground dark:border-white/10 dark:bg-white/5 dark:text-white/55",
                )}
              >
                <Icon aria-hidden="true" className="size-4.5" />
              </span>

              <div className="min-w-0 flex-1 pr-5">
                <p
                  className={cn(
                    "text-[0.875rem] font-semibold",
                    selected ? "text-brand" : "text-heading",
                  )}
                >
                  {role.title}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[11.5px] leading-[1.35]",
                    selected ? "text-brand/80" : "text-body",
                  )}
                >
                  {role.description}
                </p>
              </div>

              {selected && (
                <CheckCircle2
                  aria-hidden="true"
                  className="absolute right-3 top-3 size-4 text-brand"
                />
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
