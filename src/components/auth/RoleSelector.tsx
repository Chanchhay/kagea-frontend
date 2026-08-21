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
      <legend className="text-[13px] font-semibold text-heading">
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
                "relative flex items-center gap-3 rounded-2xl border p-3.5 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-brand/30",
                selected
                  ? "border-brand bg-brand/10 shadow-[inset_0_0_0_1px_rgba(46,186,89,.22)] dark:border-brand/70 dark:bg-brand/15"
                  : "border-black/10 bg-surface-muted/70 hover:border-brand/40 hover:bg-surface-muted dark:border-white/14 dark:bg-white/[.045] dark:hover:border-brand/50 dark:hover:bg-white/[.07]",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                  selected
                    ? "border-brand/40 bg-brand/15 text-brand dark:border-brand/50 dark:bg-brand/25 dark:text-[#7bf0a4]"
                    : "border-black/10 bg-surface text-muted-fg dark:border-white/14 dark:bg-white/8 dark:text-white/65",
                )}
              >
                <Icon aria-hidden="true" className="size-4.5" />
              </span>

              <div className="min-w-0 flex-1 pr-5">
                <p
                  className={cn(
                    "text-[0.875rem] font-semibold",
                    selected ? "text-brand dark:text-[#7bf0a4]" : "text-heading",
                  )}
                >
                  {role.title}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[11.5px] leading-[1.35]",
                    selected ? "text-body dark:text-white/70" : "text-body",
                  )}
                >
                  {role.description}
                </p>
              </div>

              {selected && (
                <CheckCircle2
                  aria-hidden="true"
                  className="absolute right-3 top-3 size-4 text-brand dark:text-[#7bf0a4]"
                />
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
