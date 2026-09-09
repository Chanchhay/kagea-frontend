"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, RotateCcw, User, DollarSign } from "lucide-react";
import type { JobSeekerProfileResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  jobSeekerProfileSchema,
  type JobSeekerProfileFormValues,
} from "@/lib/validation/job-seeker.schema";
import { useUpdateJobSeekerProfileMutation } from "@/services/jobSeekerApi";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectField, TextAreaField, TextField } from "@/components/shared/FormFields";

interface ProfileFormProps {
  profile: JobSeekerProfileResponse;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const tx = useWorkspaceTranslation();
  const [updateProfile, { isLoading }] = useUpdateJobSeekerProfileMutation();

  const getDefaultValues = (p: JobSeekerProfileResponse): JobSeekerProfileFormValues => ({
    headline: p.headline || "",
    bio: p.bio || "",
    currentPosition: p.currentPosition || "",
    expectedSalaryMin: p.expectedSalaryMin !== undefined && p.expectedSalaryMin !== null ? String(p.expectedSalaryMin) : "",
    expectedSalaryMax: p.expectedSalaryMax !== undefined && p.expectedSalaryMax !== null ? String(p.expectedSalaryMax) : "",
    expectedSalaryCurrency: p.expectedSalaryCurrency || "USD",
    salaryVisibility: p.salaryVisibility || "RECRUITERS_ONLY",
    preferredLocation: p.preferredLocation || "",
    availabilityStatus: p.availabilityStatus || "Actively Looking",
  });

  const form = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues: getDefaultValues(profile),
  });

  useEffect(() => {
    form.reset(getDefaultValues(profile));
  }, [profile, form]);

  const onSubmit = async (values: JobSeekerProfileFormValues) => {
    try {
      const minSalary = values.expectedSalaryMin.trim() ? Number(values.expectedSalaryMin) : undefined;
      const maxSalary = values.expectedSalaryMax.trim() ? Number(values.expectedSalaryMax) : undefined;

      await updateProfile({
        headline: values.headline.trim() || undefined,
        bio: values.bio.trim() || undefined,
        currentPosition: values.currentPosition.trim() || undefined,
        expectedSalaryMin: minSalary,
        expectedSalaryMax: maxSalary,
        expectedSalaryCurrency: values.expectedSalaryCurrency.trim() || undefined,
        salaryVisibility: values.salaryVisibility,
        preferredLocation: values.preferredLocation.trim() || undefined,
        availabilityStatus: values.availabilityStatus.trim() || undefined,
      }).unwrap();

      toast.success(tx("Profile information updated successfully!"));
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to update profile.")));
    }
  };

  const handleReset = () => {
    form.reset(getDefaultValues(profile));
    toast.info(tx("Form reset to saved profile information."));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-0 space-y-6 [&_[data-slot=form-item]]:min-w-0 [&_[data-slot=select-trigger]]:max-w-full">
        {/* Professional Summary & Overview */}
        <Card className="min-w-0 overflow-hidden rounded-3xl border border-ws-line bg-ws-panel py-0 gap-0 shadow-xs ring-0">
          <CardHeader className="border-b border-ws-line bg-ws-card/50 px-4 py-5 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-ws-fg">
              <User className="size-5 text-brand" />
              {tx("General Profile Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-4 sm:p-6">
            <TextField
              control={form.control}
              name="headline"
              label={tx("Professional Headline")}
              placeholder={tx("e.g. Senior Full Stack Software Engineer | React & Node.js Specialist")}
              description={tx("A concise summary line displayed at the top of your profile.")}
            />

            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
              <TextField
                control={form.control}
                name="currentPosition"
                label={tx("Current Position")}
                placeholder={tx("e.g. Senior Frontend Engineer at TechCorp")}
              />
              <TextField
                control={form.control}
                name="preferredLocation"
                label={tx("Preferred Location")}
                placeholder={tx("e.g. Ho Chi Minh City, Remote, Relocation")}
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
              <SelectField
                control={form.control}
                name="availabilityStatus"
                label={tx("Availability Status")}
                options={[
                  { value: "Actively Looking", label: "Actively Looking - Available Immediately" },
                  { value: "Open to Offers", label: "Open to Offers - Passive Job Seeking" },
                  { value: "Notice Period Required", label: "Serving Notice Period" },
                  { value: "Not Available", label: "Not Available Currently" },
                ]}
              />
            </div>

            <TextAreaField
              control={form.control}
              name="bio"
              label={tx("About You / Bio")}
              rows={5}
              placeholder={tx("Write a brief professional summary describing your key skills, background, achievements, and career goals...")}
              description={tx("Provide detailed background information for recruiters to learn more about you.")}
            />
          </CardContent>
        </Card>

        {/* Salary Expectations & Visibility */}
        <Card className="min-w-0 overflow-hidden rounded-3xl border border-ws-line bg-ws-panel py-0 gap-0 shadow-xs ring-0">
          <CardHeader className="border-b border-ws-line bg-ws-card/50 px-4 py-5 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-ws-fg">
              <DollarSign className="size-5 text-brand" />
              {tx("Salary Expectations & Privacy")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-4 sm:p-6">
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-3">
              <TextField
                control={form.control}
                name="expectedSalaryMin"
                label={tx("Minimum Expected Salary")}
                type="number"
                placeholder={tx("e.g. 2000")}
              />
              <TextField
                control={form.control}
                name="expectedSalaryMax"
                label={tx("Maximum Expected Salary")}
                type="number"
                placeholder={tx("e.g. 3500")}
              />
              <SelectField
                control={form.control}
                name="expectedSalaryCurrency"
                label={tx("Currency")}
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "VND", label: "VND (₫)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "SGD", label: "SGD ($)" },
                  { value: "GBP", label: "GBP (£)" },
                ]}
              />
            </div>

            <SelectField
              control={form.control}
              name="salaryVisibility"
              label={tx("Salary Privacy & Visibility")}
              description={tx("Control who can see your expected salary range.")}
              options={[
                { value: "PRIVATE", label: "Private - Only visible to you" },
                { value: "RECRUITERS_ONLY", label: "Recruiters Only - Visible to verified recruiters" },
                { value: "PUBLIC", label: "Public - Visible on your public profile" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 rounded-2xl border border-ws-line bg-ws-card/40 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading || !form.formState.isDirty}
            className="min-h-11 h-auto whitespace-normal rounded-xl bg-ws-panel px-6 py-3"
          >
            <RotateCcw className="mr-2 size-4" />
            {tx("Discard Changes")}</Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-h-11 h-auto whitespace-normal rounded-xl bg-primary px-8 py-3 font-medium hover:bg-brand/90 text-white shadow-sm"
          >
            <Save className="mr-2 size-4" />
            {isLoading ? tx("Saving Profile…") : tx("Save Profile Changes")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
