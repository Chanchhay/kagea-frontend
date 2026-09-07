"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { Building2, FileText, Pencil, ShieldCheck } from "lucide-react";
import { resolveFileUrl } from "@/lib/file-url";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { LoadingState } from "@/components/shared/LoadingState";
import { CompanyForm } from "@/components/recruiter/CompanyForm";
import { Button } from "@/components/ui/button";
import {
  useGetRecruiterCompanyQuery,
  useSubmitCompanyVerificationMutation,
} from "@/services/recruiterApi";

export default function RecruiterCompanyPage() {
  const tx = useWorkspaceTranslation();
  const companyQuery = useGetRecruiterCompanyQuery();
  const [submitVerification, submission] =
    useSubmitCompanyVerificationMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (companyQuery.isLoading) return <LoadingState rows={5} />;

  const company = companyQuery.data;

  // A recruiter without a company cannot post jobs, so offer creation instead
  // of an error when the lookup comes back empty.
  if (!company) {
    return (
      <>
        <PageIntro
          title={tx("Company profile")}
          description={tx("Create your company before posting jobs. A moderator must verify it before your posts can go live.")}
        />
        <PlainCard>
          <CompanyForm />
        </PlainCard>
      </>
    );
  }

  const onSubmitVerification = async () => {
    try {
      await submitVerification(company.id).unwrap();
      toast.success(tx("Submitted for verification."));
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, tx("Unable to submit for verification.")),
      );
    }
  };

  const canSubmit = company.verificationStatus !== "APPROVED";

  return (
    <>
      <PageIntro
        title={tx("Company profile")}
        description={tx("Manage your company details and submit them for moderator verification.")}
      />

      {isEditing ? (
        <PlainCard>
          <CompanyForm company={company} onDone={() => setIsEditing(false)} />
        </PlainCard>
      ) : (
        <div className="grid gap-6">
          <PlainCard>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface text-muted-fg shadow-sm">
                  {resolveFileUrl(company.logoUrl) ? (
                    <Image
                      src={resolveFileUrl(company.logoUrl)!}
                      alt={tx("{0} logo", { 0: company.name })}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <Building2 aria-hidden="true" className="size-8" />
                  )}
                </span>
                <div className="min-w-0 pt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-ws-muted">
                      {company.name}
                    </h2>
                    <StatusPill>{company.verificationStatus}</StatusPill>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
                    {company.description || tx("No description yet.")}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg px-5"
                onClick={() => setIsEditing(true)}
              >
                <Pencil aria-hidden="true" className="size-4" />
                {tx("Edit")}</Button>
            </div>

            <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
              <Detail label={tx("Industry")} value={company.industryName} />
              <Detail
                label={tx("Business registration")}
                value={company.businessRegistrationNo}
              />
              <Detail label={tx("Contact email")} value={company.contactEmail} />
              <Detail label={tx("Phone number")} value={company.contactPhone} />
              <Detail label={tx("Website")} value={company.websiteUrl} />
              <Detail label={tx("Address")} value={company.address} />
            </dl>
          </PlainCard>

          <PlainCard>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
                  <ShieldCheck aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold text-heading">{tx("Verification")}</h2>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-body">
                    {tx("Attach supporting documents, then submit for review. Jobs can only be published once a moderator approves the company.")}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/recruiter/company/documents"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold text-body transition-colors hover:border-brand/30 hover:text-brand"
                >
                  <FileText aria-hidden="true" className="size-4" />
                  {tx("Documents")}</Link>
                <Button
                  type="button"
                  className="h-11 rounded-lg px-6"
                  disabled={!canSubmit || submission.isLoading}
                  onClick={onSubmitVerification}
                >
                  {submission.isLoading ? tx("Submitting…") : tx("Submit for verification")}
                </Button>
              </div>
            </div>
          </PlainCard>
        </div>
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  const tx = useWorkspaceTranslation();
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
        {tx(label)}
      </dt>
      <dd className="mt-1 text-heading">{value || "—"}</dd>
    </div>
  );
}
