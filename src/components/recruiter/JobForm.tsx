"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { toast } from "sonner";
import type {
  JobDocumentParseResponse,
  JobPostRequest,
  JobPostResponse,
  JobPostSectionRequest,
} from "@/contracts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { SelectField, TextField } from "@/components/shared/FormFields";
import { JobDocumentImport } from "@/components/recruiter/JobDocumentImport";
import { JobImportSummary } from "@/components/recruiter/JobImportSummary";
import { getApiErrorMessage } from "@/lib/api-error";
import { markdownToPlainText } from "@/lib/markdown";
import {
  deriveSectionType,
  experienceLevelOptions,
  jobTypeOptions,
  NOT_SPECIFIED,
  sectionTypeLabels,
  withNotSpecified,
  workModeOptions,
} from "@/lib/job-options";
import { jobSchema, type JobFormValues } from "@/lib/validation/recruiter.schema";
import { Input } from "@/components/ui/input";
import {
  useGetPublicJobCategoriesQuery,
  useGetPublicSkillsQuery,
} from "@/services/publicApi";
import {
  useCreateJobDraftMutation,
  useCreateSkillMutation,
  usePublishJobMutation,
  useUpdateJobMutation,
} from "@/services/recruiterApi";

const REQUIREMENTS_SECTION = "REQUIREMENT_RESPONSIBILITY";

function toFormValues(job?: JobPostResponse): JobFormValues {
  const sections = [...(job?.sections ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const requirements = sections.find(
    (section) => section.sectionType === REQUIREMENTS_SECTION,
  );

  return {
    title: job?.title ?? "",
    description: job?.description ?? "",
    requirements: requirements?.contentMarkdown ?? "",
    categoryId: job?.categoryId ? String(job.categoryId) : NOT_SPECIFIED,
    location: job?.location ?? "",
    jobType: job?.jobType || NOT_SPECIFIED,
    workMode: job?.workMode || NOT_SPECIFIED,
    experienceLevel: job?.experienceLevel || NOT_SPECIFIED,
    salaryMin: job?.salaryMin ? String(job.salaryMin) : "",
    salaryMax: job?.salaryMax ? String(job.salaryMax) : "",
    // The API returns an ISO timestamp; <input type="date"> needs just the date.
    expiredAt: job?.expiredAt ? job.expiredAt.slice(0, 10) : "",
    // Saving replaces the whole section and skill lists, so anything the form
    // does not carry would be dropped on the next edit.
    extraSections: sections
      .filter((section) => section.sectionType !== REQUIREMENTS_SECTION)
      .map((section) => ({
        sectionType: section.sectionType,
        title: section.title ?? sectionTypeLabels[section.sectionType],
        contentMarkdown: section.contentMarkdown ?? "",
      })),
    skills: (job?.skills ?? []).map((skill) => ({
      skillId: skill.skillId,
      name: skill.skillName,
      skillType: skill.skillType ?? null,
    })),
    sourceFileUrl: job?.sourceFileUrl ?? "",
  };
}

const optional = (value: string) =>
  value && value !== NOT_SPECIFIED ? value : undefined;

/**
 * `expiredAt` is declared `format: date-time`, but <input type="date"> yields a
 * bare `YYYY-MM-DD` — which Jackson cannot read, failing the whole body.
 *
 * Sent as an end-of-day UTC instant ("…T16:59:59.000Z"), matching the format the
 * API's own timestamps use. If the backend field is a LocalDateTime rather than
 * an Instant it will reject the `Z`; drop to `${value}T23:59:59` in that case.
 */
function toDateTime(value: string) {
  if (!value) return undefined;
  const endOfDay = new Date(`${value}T23:59:59`);
  return Number.isNaN(endOfDay.getTime()) ? undefined : endOfDay.toISOString();
}

export function JobForm({ job }: { job?: JobPostResponse }) {
  const router = useRouter();
  const categories = useGetPublicJobCategoriesQuery();
  const [createJobDraft, creation] = useCreateJobDraftMutation();
  const [updateJob, update] = useUpdateJobMutation();
  const [publishJob, publication] = usePublishJobMutation();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    values: toFormValues(job),
  });
  const extraSections = useFieldArray({
    control: form.control,
    name: "extraSections",
  });
  const skills = useWatch({ control: form.control, name: "skills" });
  const publicSkills = useGetPublicSkillsQuery();
  const [createSkill, skillCreation] = useCreateSkillMutation();
  const [skillDraft, setSkillDraft] = useState("");
  /** The last import, kept so its full readout stays on screen. */
  const [lastImport, setLastImport] = useState<JobDocumentParseResponse | null>(
    null,
  );

  /**
   * Attaches a skill by name, creating it when the shared list is missing it.
   *
   * The endpoint is find-or-create, so there is nothing to resolve here first:
   * a name that already exists comes back with its id, and one that doesn't
   * becomes a row everyone can use. `skillType` is only a suggestion for the
   * creating case — an existing skill keeps the type it has.
   */
  const attachSkill = async (name: string, skillType?: string | null) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const current = form.getValues("skills");
    if (current.some((skill) => skill.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`${trimmed} is already on this job.`);
      setSkillDraft("");
      return;
    }

    try {
      const skill = await createSkill({
        name: trimmed,
        skillType: skillType ?? undefined,
      }).unwrap();

      // Re-read rather than close over `current`: the request is a round trip,
      // and the chip list may have changed while it was in flight.
      const latest = form.getValues("skills");
      if (!latest.some((attached) => attached.skillId === skill.id)) {
        form.setValue(
          "skills",
          [
            ...latest,
            { skillId: skill.id, name: skill.name, skillType: skill.skillType },
          ],
          { shouldDirty: true },
        );
      }

      setSkillDraft("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Unable to add ${trimmed}.`));
    }
  };

  const isSaving = creation.isLoading || update.isLoading || publication.isLoading;

  const toRequest = (values: JobFormValues): JobPostRequest => {
    const sections: JobPostSectionRequest[] = [];

    if (values.requirements.trim()) {
      sections.push({
        sectionType: REQUIREMENTS_SECTION,
        title: sectionTypeLabels[REQUIREMENTS_SECTION],
        // Plain-text mirror, so anything indexing the section body sees words
        // rather than markdown punctuation.
        contentText: markdownToPlainText(values.requirements),
        contentMarkdown: values.requirements,
        displayOrder: sections.length,
      });
    }

    values.extraSections.forEach((section) => {
      if (!section.contentMarkdown.trim()) return;
      sections.push({
        // Sections the recruiter added carry no type until here, where the
        // heading they wrote decides it.
        sectionType: section.sectionType ?? deriveSectionType(section.title),
        title: section.title,
        contentMarkdown: section.contentMarkdown,
        contentText: markdownToPlainText(section.contentMarkdown),
        displayOrder: sections.length,
      });
    });

    return {
      title: values.title,
      description: values.description,
      categoryId:
        values.categoryId === NOT_SPECIFIED
          ? undefined
          : Number(values.categoryId),
      location: optional(values.location),
      jobType: optional(values.jobType),
      workMode: optional(values.workMode),
      experienceLevel: optional(values.experienceLevel),
      salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
      expiredAt: toDateTime(values.expiredAt),
      sourceFileUrl: values.sourceFileUrl || undefined,
      sections,
      skills: values.skills.map((skill) => ({ skillId: skill.skillId })),
    };
  };

  /**
   * Merges extracted fields over the form. Anything the document did not state
   * comes back null and leaves what the recruiter already typed alone, so
   * importing a PDF into a half-filled form never erases their work.
   */
  const applyParsed = (parsed: JobDocumentParseResponse) => {
    const current = form.getValues();
    const requirements = parsed.sections.find(
      (section) => section.sectionType === REQUIREMENTS_SECTION,
    );
    const descriptionSection = parsed.sections.find(
      (section) => section.sectionType === "DESCRIPTION",
    );

    // A DESCRIPTION section duplicates the description field; it is only worth
    // keeping when the extraction gave no description of its own.
    const description = parsed.description ?? descriptionSection?.contentMarkdown;

    const parsedExtras = parsed.sections
      .filter((section) => section.sectionType !== REQUIREMENTS_SECTION)
      .filter(
        (section) =>
          section.sectionType !== "DESCRIPTION" || !parsed.description,
      )
      .map((section) => ({
        sectionType: section.sectionType,
        title: section.title,
        contentMarkdown: section.contentMarkdown,
      }));

    form.reset({
      ...current,
      title: parsed.title ?? current.title,
      description: description ?? current.description,
      requirements: requirements?.contentMarkdown ?? current.requirements,
      categoryId:
        parsed.categoryId === null
          ? current.categoryId
          : String(parsed.categoryId),
      location: parsed.location ?? current.location,
      jobType: parsed.jobType ?? current.jobType,
      workMode: parsed.workMode ?? current.workMode,
      experienceLevel: parsed.experienceLevel ?? current.experienceLevel,
      salaryMin:
        parsed.salaryMin === null ? current.salaryMin : String(parsed.salaryMin),
      salaryMax:
        parsed.salaryMax === null ? current.salaryMax : String(parsed.salaryMax),
      extraSections:
        parsedExtras.length > 0 ? parsedExtras : current.extraSections,
      skills: parsed.skills.length > 0 ? parsed.skills : current.skills,
      sourceFileUrl: parsed.sourceFileUrl,
    });

    setLastImport(parsed);
  };

  /** Saves, then optionally publishes — a new post is always created as a draft. */
  const submit = async (values: JobFormValues, publish: boolean) => {
    const body = toRequest(values);
    let saved: JobPostResponse;

    try {
      saved = job
        ? await updateJob({ id: job.id, body }).unwrap()
        : await createJobDraft(body).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save the job."));
      return;
    }

    if (publish) {
      try {
        await publishJob(saved.id).unwrap();
        toast.success("Job published.");
      } catch (error) {
        // The draft exists either way, so move on to it rather than let a retry
        // create a second copy.
        toast.error(
          getApiErrorMessage(error, "Saved as a draft, but publishing failed."),
        );
      }
    } else {
      toast.success(job ? "Job updated." : "Draft saved.");
    }

    router.push(`/recruiter/jobs/${saved.id}`);
  };

  const categoryOptions = withNotSpecified(
    (categories.data ?? []).map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  );

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => submit(values, false))}
      >
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="submit"
            variant="outline"
            className="h-11 rounded-lg px-6"
            disabled={isSaving}
          >
            {job ? "Save changes" : "Save draft"}
          </Button>
          <Button
            type="button"
            className="h-11 rounded-lg px-6"
            disabled={isSaving}
            onClick={form.handleSubmit((values) => submit(values, true))}
          >
            {publication.isLoading ? "Publishing…" : "Publish Job"}
          </Button>
        </div>

        <JobDocumentImport onParsed={applyParsed} disabled={isSaving} />

        {lastImport ? <JobImportSummary parsed={lastImport} /> : null}

        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            control={form.control}
            name="title"
            label="Job title"
            placeholder="e.g. Senior Full Stack Engineer"
          />
          <SelectField
            control={form.control}
            name="categoryId"
            label="Category / department"
            options={categoryOptions}
          />
          <TextField
            control={form.control}
            name="location"
            label="Location"
            placeholder="Remote / Phnom Penh, Cambodia"
          />
          <SelectField
            control={form.control}
            name="workMode"
            label="Work mode"
            options={withNotSpecified(workModeOptions)}
          />
          <TextField
            control={form.control}
            name="salaryMin"
            label="Salary min"
            type="number"
            placeholder="80000"
          />
          <TextField
            control={form.control}
            name="salaryMax"
            label="Salary max"
            type="number"
            placeholder="120000"
          />
          <SelectField
            control={form.control}
            name="experienceLevel"
            label="Experience level"
            options={withNotSpecified(experienceLevelOptions)}
          />
          <SelectField
            control={form.control}
            name="jobType"
            label="Job type"
            options={withNotSpecified(jobTypeOptions)}
          />
          <TextField
            control={form.control}
            name="expiredAt"
            label="Expires on"
            type="date"
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write the core responsibilities and mission of this role…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements &amp; responsibilities</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="List the specific technical requirements, years of experience, and day-to-day duties…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*
          Free-form sections: the recruiter writes the heading, and the order
          here is the order job seekers read. Empty ones are dropped on save,
          so an unused block costs nothing.
        */}
        {extraSections.fields.map((section, index) => (
          <div
            key={section.id}
            className="space-y-3 rounded-xl border border-border p-4"
          >
            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`extraSections.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">
                      Section {index + 1} heading
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Section heading, e.g. Benefits, Our stack, How we hire"
                        className="h-10 font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex shrink-0 items-center gap-1 pt-1">
                <button
                  type="button"
                  aria-label="Move section up"
                  disabled={index === 0}
                  onClick={() => extraSections.move(index, index - 1)}
                  className="rounded-md p-1.5 text-body hover:bg-surface-muted hover:text-heading disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowUp aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Move section down"
                  disabled={index === extraSections.fields.length - 1}
                  onClick={() => extraSections.move(index, index + 1)}
                  className="rounded-md p-1.5 text-body hover:bg-surface-muted hover:text-heading disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowDown aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Remove section"
                  onClick={() => extraSections.remove(index)}
                  className="rounded-md p-1.5 text-body hover:bg-surface-muted hover:text-destructive"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>

            <FormField
              control={form.control}
              name={`extraSections.${index}.contentMarkdown`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">
                    Section {index + 1} content
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write this section…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() =>
              extraSections.append({ title: "", contentMarkdown: "" })
            }
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Add a section
          </Button>
          <span className="text-xs text-body">
            Anything else worth saying — benefits, your stack, the hiring
            process.
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-heading">Skills</p>
          <p className="mt-1 text-xs text-body">
            Everything your PDF asked for is already here. Type a skill and press
            Enter to add another — anything we don&apos;t have yet joins the
            shared list for everyone.
          </p>

          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={skill.skillId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted/60 py-1 pl-3 pr-2 text-xs font-medium text-heading"
                >
                  {skill.name}
                  {skill.skillType ? (
                    <span className="font-normal text-body/70">
                      {skill.skillType.toLowerCase()}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Remove ${skill.name}`}
                    onClick={() =>
                      form.setValue(
                        "skills",
                        skills.filter((_, position) => position !== index),
                        { shouldDirty: true },
                      )
                    }
                    className="text-body hover:text-destructive"
                  >
                    <X aria-hidden="true" className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              list="known-skills"
              value={skillDraft}
              disabled={skillCreation.isLoading}
              onChange={(event) => setSkillDraft(event.target.value)}
              // Enter inside a form submits it; this field adds a skill instead.
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                void attachSkill(skillDraft);
              }}
              placeholder="e.g. Zustand"
              className="h-10 w-full sm:w-64"
            />
            <datalist id="known-skills">
              {(publicSkills.data ?? []).map((skill) => (
                <option key={skill.id} value={skill.name} />
              ))}
            </datalist>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={!skillDraft.trim() || skillCreation.isLoading}
              onClick={() => void attachSkill(skillDraft)}
            >
              {skillCreation.isLoading ? "Adding…" : "Add skill"}
            </Button>
          </div>

        </div>

        <div className="flex justify-end border-t border-border pt-6">
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-lg px-6"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
