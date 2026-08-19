"use client";

import { Check, Minus } from "lucide-react";
import type { JobDocumentParseResponse } from "@/contracts";
import {
  experienceLevelOptions,
  jobTypeOptions,
  workModeOptions,
} from "@/lib/job-options";

/** Turns a stored value like FULL_TIME back into the label the selects show. */
function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string | null,
) {
  if (!value) return null;

  return options.find((option) => option.value === value)?.label ?? value;
}

function salaryLabel(parsed: JobDocumentParseResponse) {
  const { salaryMin, salaryMax } = parsed;
  if (salaryMin === null && salaryMax === null) return null;

  const format = (value: number) => value.toLocaleString();

  if (salaryMin !== null && salaryMax !== null) {
    return salaryMin === salaryMax
      ? format(salaryMin)
      : `${format(salaryMin)} – ${format(salaryMax)}`;
  }

  return format((salaryMin ?? salaryMax) as number);
}

function SkillChip({
  name,
  skillType,
  isNew,
}: {
  name: string;
  skillType: string | null;
  isNew?: boolean;
}) {
  return (
    <span
      className={
        isNew
          ? "inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-xs text-body"
          : "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-heading"
      }
    >
      <span className="font-medium">{name}</span>
      {/* The type is shown even when absent, so nothing about what we recorded
          is left to guess. */}
      <span className="text-body/70">
        {skillType ? skillType.toLowerCase() : "no type"}
      </span>
    </span>
  );
}

/**
 * The full readout of what an uploaded PDF produced — what was filled in, what
 * was not, and every skill attached, separating the ones the import created.
 *
 * Extraction is a guess dressed as data, so the recruiter is shown all of it
 * rather than left to diff the form against their own document. Fields that
 * came back empty are listed too: knowing the salary was not found is as
 * useful as knowing the title was. And because importing writes skills to the
 * shared list straight away, that is said plainly rather than left to discover.
 */
export function JobImportSummary({
  parsed,
}: {
  parsed: JobDocumentParseResponse;
}) {
  const fields: { label: string; value: string | null }[] = [
    { label: "Job title", value: parsed.title },
    { label: "Category", value: parsed.categoryName },
    { label: "Location", value: parsed.location },
    { label: "Job type", value: optionLabel(jobTypeOptions, parsed.jobType) },
    { label: "Work mode", value: optionLabel(workModeOptions, parsed.workMode) },
    {
      label: "Experience level",
      value: optionLabel(experienceLevelOptions, parsed.experienceLevel),
    },
    { label: "Salary", value: salaryLabel(parsed) },
    { label: "Description", value: parsed.description ? "Written" : null },
  ];

  const found = fields.filter((field) => field.value !== null);
  const missing = fields.filter((field) => field.value === null);

  // Split so the recruiter can see which skills their upload added to the
  // shared list, rather than only which ones ended up on the job.
  const createdSkills = parsed.skills.filter((skill) => skill.created);
  const existingSkills = parsed.skills.filter((skill) => !skill.created);

  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-heading">
        What we read from your PDF
      </h3>
      <p className="mt-1 text-xs text-body">
        Everything below came from the document, and you can edit all of it. The
        job itself isn&apos;t saved until you press save — the one thing already
        stored is any new skill, since those are shared with everyone.
      </p>

      <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {found.map((field) => (
          <div key={field.label} className="flex items-start gap-2 text-xs">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0 text-brand"
            />
            <dt className="text-body">{field.label}:</dt>
            <dd className="font-medium text-heading">{field.value}</dd>
          </div>
        ))}
      </dl>

      {missing.length > 0 ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-body">
          <Minus aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Not stated in the document, so left for you to fill in:{" "}
            {missing.map((field) => field.label.toLowerCase()).join(", ")}.
            {/* Called out separately because it is never extracted at all. */}{" "}
            The expiry date is never read from a PDF — those are usually stale.
          </span>
        </p>
      ) : null}

      {parsed.sections.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-heading">
            Sections ({parsed.sections.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {parsed.sections.map((section) => (
              <span
                key={section.sectionType}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-heading"
              >
                {section.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {existingSkills.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-heading">
            Skills we already had ({existingSkills.length}) — attached
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {existingSkills.map((skill) => (
              <SkillChip
                key={skill.skillId}
                name={skill.name}
                skillType={skill.skillType}
              />
            ))}
          </div>
        </div>
      ) : null}

      {createdSkills.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-heading">
            Skills we added for you ({createdSkills.length}) — attached
          </p>
          <p className="mt-1 text-xs text-body">
            These weren&apos;t in our list, so your PDF created them. They now
            exist for everyone, under the type shown. Remove any that don&apos;t
            belong to this job in the Skills section below.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {createdSkills.map((skill) => (
              <SkillChip
                key={skill.skillId}
                name={skill.name}
                skillType={skill.skillType}
                isNew
              />
            ))}
          </div>
        </div>
      ) : null}

    </div>
  );
}
