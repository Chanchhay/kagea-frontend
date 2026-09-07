"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CompanyResponse } from "@/contracts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { uploadFile } from "@/lib/upload-file";
import { SectionLabel } from "@/components/shared/ApiCards";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/shared/FormFields";
import {
  companySchema,
  type CompanyFormValues,
} from "@/lib/validation/recruiter.schema";
import { useGetPublicIndustriesQuery } from "@/services/publicApi";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/services/recruiterApi";

const NO_INDUSTRY = "none";

function toFormValues(company?: CompanyResponse): CompanyFormValues {
  return {
    name: company?.name ?? "",
    industryId: company?.industryId ? String(company.industryId) : NO_INDUSTRY,
    description: company?.description ?? "",
    websiteUrl: company?.websiteUrl ?? "",
    address: company?.address ?? "",
    contactEmail: company?.contactEmail ?? "",
    contactPhone: company?.contactPhone ?? "",
    logoUrl: company?.logoUrl ?? "",
    businessRegistrationNo: company?.businessRegistrationNo ?? "",
  };
}

export function CompanyForm({
  company,
  onDone,
}: {
  company?: CompanyResponse;
  onDone?: () => void;
}) {
  const tx = useWorkspaceTranslation();
  const industries = useGetPublicIndustriesQuery();
  const [createCompany, creation] = useCreateCompanyMutation();
  const [updateCompany, update] = useUpdateCompanyMutation();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    values: toFormValues(company),
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isSaving = creation.isLoading || update.isLoading || isUploading;

  const onSubmit = async (values: CompanyFormValues) => {
    // Uploaded on save rather than at pick time, so abandoning the form
    // leaves no orphaned object in the bucket.
    let logoUrl = values.logoUrl;
    if (logoFile) {
      try {
        setIsUploading(true);
        logoUrl = await uploadFile(logoFile, "public");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : tx("Unable to upload the logo."),
        );
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const body = {
      name: values.name,
      industryId:
        values.industryId === NO_INDUSTRY ? undefined : Number(values.industryId),
      description: values.description || undefined,
      websiteUrl: values.websiteUrl || undefined,
      address: values.address || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      logoUrl: logoUrl || undefined,
      businessRegistrationNo: values.businessRegistrationNo || undefined,
    };

    try {
      if (company) {
        await updateCompany({ id: company.id, body }).unwrap();
        toast.success(tx("Company updated."));
      } else {
        await createCompany(body).unwrap();
        toast.success(tx("Company created."));
      }
      onDone?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          company
            ? tx("Unable to update the company.")
            : tx("Unable to create the company."),
        ),
      );
    }
  };

  const industryOptions = [
    { value: NO_INDUSTRY, label: "Not specified" },
    ...(industries.data ?? []).map((industry) => ({
      value: String(industry.id),
      label: industry.name,
    })),
  ];

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <section>
          <SectionLabel>{tx("Company identity")}</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              control={form.control}
              name="name"
              label={tx("Legal name")}
              placeholder={tx("ISTAD Store")}
            />
            <SelectField
              control={form.control}
              name="industryId"
              label={tx("Industry")}
              options={industryOptions}
            />
          </div>
          <div className="mt-5">
            <TextAreaField
              control={form.control}
              name="description"
              label={tx("Public description")}
              placeholder={tx("What your company does.")}
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <TextField
              control={form.control}
              name="businessRegistrationNo"
              label={tx("Business registration number")}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tx("Company logo")}</FormLabel>
                  <FormControl>
                    <FileDropzone
                      value={field.value}
                      file={logoFile}
                      onFileChange={setLogoFile}
                      onClear={() => field.onChange("")}
                      accept=".png,.jpg,.jpeg,.webp,.svg"
                      hint="PNG, JPG, WebP or SVG up to 5 MB."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section>
          <SectionLabel>{tx("Contact information")}</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              control={form.control}
              name="contactEmail"
              label={tx("Email address")}
              type="email"
              placeholder="hello@company.com"
            />
            <TextField
              control={form.control}
              name="contactPhone"
              label={tx("Phone number")}
            />
            <TextField
              control={form.control}
              name="websiteUrl"
              label={tx("Website")}
              placeholder="https://…"
            />
            <TextField control={form.control} name="address" label={tx("Address")} />
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          {onDone ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg px-6"
              onClick={onDone}
            >
              {tx("Cancel")}</Button>
          ) : null}
          <Button
            type="submit"
            className="h-11 rounded-lg px-8"
            disabled={isSaving}
          >
            {isSaving ? tx("Saving…") : company ? tx("Save changes") : tx("Create company")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
