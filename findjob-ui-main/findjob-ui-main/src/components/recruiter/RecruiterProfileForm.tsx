"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { RecruiterProfileResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/shared/FormFields";
import {
  recruiterProfileSchema,
  type RecruiterProfileFormValues,
} from "@/lib/validation/recruiter.schema";
import { useUpdateRecruiterProfileMutation } from "@/services/recruiterApi";

export function RecruiterProfileForm({
  profile,
}: {
  profile?: RecruiterProfileResponse;
}) {
  const tx = useWorkspaceTranslation();
  const [updateRecruiterProfile, update] = useUpdateRecruiterProfileMutation();
  const form = useForm<RecruiterProfileFormValues>({
    resolver: zodResolver(recruiterProfileSchema),
    defaultValues: {
      position: profile?.position ?? "",
      linkedinUrl: profile?.linkedinUrl ?? "",
    },
  });

  const onSubmit = async (values: RecruiterProfileFormValues) => {
    try {
      await updateRecruiterProfile({
        position: values.position || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
      }).unwrap();
      toast.success(tx("Profile updated."));
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to update the profile.")));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            control={form.control}
            name="position"
            label={tx("Position")}
            placeholder={tx("Head of Talent")}
          />
          <TextField
            control={form.control}
            name="linkedinUrl"
            label={tx("LinkedIn URL")}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-lg px-8"
            disabled={update.isLoading}
          >
            {update.isLoading ? tx("Saving…") : tx("Save changes")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
