"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { uploadFile } from "@/lib/upload-file";
import { Plus } from "lucide-react";
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
import { SelectField } from "@/components/shared/FormFields";
import {
  companyDocumentSchema,
  type CompanyDocumentFormValues,
} from "@/lib/validation/recruiter.schema";
import { useAddCompanyDocumentMutation } from "@/services/recruiterApi";

/** `documentType` is a free string in the API; these are the common ones. */
const documentTypeOptions = [
  { value: "BUSINESS_LICENSE", label: "Business license" },
  { value: "TAX_CERTIFICATE", label: "Tax certificate" },
  { value: "COMPANY_REGISTRATION", label: "Company registration" },
  { value: "OWNER_ID", label: "Owner identification" },
  { value: "OTHER", label: "Other" },
];

const defaultValues: CompanyDocumentFormValues = {
  documentType: documentTypeOptions[0].value,
  documentUrl: "",
};

export function CompanyDocumentForm({ companyId }: { companyId: number }) {
  const [addCompanyDocument, addition] = useAddCompanyDocumentMutation();
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<CompanyDocumentFormValues>({
    resolver: zodResolver(companyDocumentSchema),
    defaultValues,
  });

  const onSubmit = async (values: CompanyDocumentFormValues) => {
    if (!documentFile && !values.documentUrl) {
      toast.error("Choose a document file first.");
      return;
    }

    try {
      // Uploaded here rather than at pick time, so an abandoned form leaves
      // nothing behind in the bucket.
      setIsUploading(true);
      const documentUrl = documentFile
        ? await uploadFile(documentFile, "private")
        : values.documentUrl;

      await addCompanyDocument({
        companyId,
        body: { ...values, documentUrl },
      }).unwrap();

      toast.success("Document added.");
      form.reset(defaultValues);
      setDocumentFile(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to add the document."));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <SelectField
          control={form.control}
          name="documentType"
          label="Document type"
          options={documentTypeOptions}
        />

        <FormField
          control={form.control}
          name="documentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document file</FormLabel>
              <FormControl>
                <FileDropzone
                  value={field.value}
                  file={documentFile}
                  onFileChange={setDocumentFile}
                  onClear={() => field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-lg px-6"
            disabled={addition.isLoading || isUploading}
          >
            <Plus aria-hidden="true" className="size-4" />
            {isUploading ? "Uploading…" : addition.isLoading ? "Adding…" : "Add document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
