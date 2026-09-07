"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { CompanyVerificationStatus } from "@/contracts";
import { resolveFileUrl } from "@/lib/file-url";
import { LoadingState } from "@/components/shared/LoadingState";
import { CompanyForm } from "@/components/recruiter/CompanyForm";
import { Button } from "@/components/ui/button";
import {
  useGetRecruiterCompanyQuery,
  useSubmitCompanyVerificationMutation,
} from "@/services/recruiterApi";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

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
      <div className="mx-auto w-full min-w-0 max-w-5xl space-y-6">
        <CompanyHeader
          title={tx("Company profile")}
          description={tx("Create your company before posting jobs. A moderator must verify it before your posts can go live.")}
        />
        <div className="rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-8">
          <CompanyForm />
        </div>
      </div>
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
  const status = verificationStatusInfo(company.verificationStatus);
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-6">
      <CompanyHeader
        title={tx("Company profile")}
        description={tx("Manage your company details and submit them for moderator verification.")}
      />

      {isEditing ? (
        <div className="rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-8">
          <CompanyForm company={company} onDone={() => setIsEditing(false)} />
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="overflow-hidden rounded-3xl border border-ws-line bg-ws-panel shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ws-line bg-ws-card/50 p-5 sm:p-6">
              <div className="flex min-w-0 items-start gap-4">
                <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ws-line bg-ws-card text-ws-muted shadow-xs sm:size-20">
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
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl font-bold tracking-tight text-ws-fg [overflow-wrap:anywhere] sm:text-2xl">
                      {company.name}
                    </h2>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                      <StatusIcon aria-hidden="true" className="size-3.5 shrink-0" />
                      {tx(status.label)}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ws-muted [overflow-wrap:anywhere]">
                    {company.description || tx("No description yet.")}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className={`h-11 shrink-0 rounded-xl border-ws-line px-5 ${focusRing}`}
                onClick={() => setIsEditing(true)}
              >
                <Pencil aria-hidden="true" className="size-4" />
                {tx("Edit")}</Button>
            </div>

            <dl className="grid gap-5 p-5 text-sm sm:grid-cols-2 sm:p-6">
              <Detail icon={Building2} label={tx("Industry")} value={company.industryName} />
              <Detail icon={FileText} label={tx("Business registration")} value={company.businessRegistrationNo} />
              <Detail icon={Mail} label={tx("Contact email")} value={company.contactEmail} />
              <Detail icon={Phone} label={tx("Phone number")} value={company.contactPhone} />
              <Detail icon={Globe} label={tx("Website")} value={company.websiteUrl} />
              <Detail icon={MapPin} label={tx("Address")} value={company.address} />
            </dl>
          </div>

          <div className="rounded-3xl border border-ws-line bg-ws-panel p-5 shadow-xs sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-card text-primary">
                  <ShieldCheck aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-ws-fg">{tx("Verification")}</h2>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-ws-muted">
                    {company.verificationStatus === "APPROVED"
                      ? tx("Your company is verified. Jobs you publish can go live immediately.")
                      : company.verificationStatus === "REJECTED"
                        ? tx("Your last submission was rejected. Update your details and documents, then resubmit for review.")
                        : tx("Attach supporting documents, then submit for review. Jobs can only be published once a moderator approves the company.")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/recruiter/company/documents"
                  className={`inline-flex h-11 items-center gap-2 rounded-xl border border-ws-line bg-ws-card px-5 text-sm font-semibold text-ws-fg shadow-xs transition hover:bg-ws-card-hover ${focusRing}`}
                >
                  <FileText aria-hidden="true" className="size-4" />
                  {tx("Documents")}</Link>
                <Button
                  type="button"
                  className={`h-11 rounded-xl px-6 ${focusRing}`}
                  disabled={!canSubmit || submission.isLoading}
                  onClick={onSubmitVerification}
                >
                  {submission.isLoading ? tx("Submitting…") : tx("Submit for verification")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-8">
      <div className="relative flex min-w-0 items-start gap-4">
        <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-ws-line bg-ws-card text-primary sm:flex"><Building2 aria-hidden="true" className="size-6" /></span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{description}</p>
        </div>
      </div>
    </header>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value?: string }) {
  const isLink = value && /^https?:\/\//.test(value);
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ws-card text-ws-muted">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-ws-faint">{label}</dt>
        <dd className="mt-1 text-ws-fg [overflow-wrap:anywhere]">
          {isLink ? (
            <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              {value}<ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
            </a>
          ) : (
            value || "—"
          )}
        </dd>
      </div>
    </div>
  );
}

function verificationStatusInfo(status: CompanyVerificationStatus): { label: string; className: string; icon: typeof CheckCircle2 } {
  switch (status) {
    case "APPROVED":
      return { label: "Approved", className: "bg-primary/10 text-primary", icon: CheckCircle2 };
    case "REJECTED":
      return { label: "Rejected", className: "bg-chip-alert text-chip-alert-fg", icon: XCircle };
    default:
      return { label: "Pending verification", className: "bg-amber-400/15 text-amber-700 dark:text-amber-300", icon: Clock3 };
  }
}
