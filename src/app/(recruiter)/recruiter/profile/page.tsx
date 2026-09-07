"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Camera,
  ImagePlus,
  Link2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { RecruiterProfileForm } from "@/components/recruiter/RecruiterProfileForm";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { uploadFile } from "@/lib/upload-file";
import { getInitials } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/services/authApi";
import {
  useGetRecruiterProfileQuery,
  useUpdateRecruiterProfileMutation,
} from "@/services/recruiterApi";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

function ProfileCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-ws-line bg-ws-panel p-5 shadow-sm sm:p-7 ${className}`}>
      {children}
    </div>
  );
}

export default function RecruiterProfilePage() {
  const tx = useWorkspaceTranslation();
  const currentUserQuery = useGetCurrentUserQuery();
  const profileQuery = useGetRecruiterProfileQuery();
  const [updateProfile, update] = useUpdateRecruiterProfileMutation();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (currentUserQuery.isLoading || profileQuery.isLoading) {
    return <LoadingState rows={4} />;
  }
  if (currentUserQuery.isError || !currentUserQuery.data) {
    return <ErrorState message={tx("Unable to load your account.")} onRetry={() => void currentUserQuery.refetch()} />;
  }

  const currentUser = currentUserQuery.data;
  const avatarUrl = profileQuery.data?.avatarUrl ?? "";
  const profile = profileQuery.data;
  const isBusy = isUploading || update.isLoading;

  const savePhoto = async () => {
    try {
      setIsUploading(true);
      // The staged file travels only now — picking one changes nothing yet.
      const url = photoFile ? await uploadFile(photoFile, "public") : "";

      // "" clears the column; the object itself is left in MinIO.
      await updateProfile({ avatarUrl: url }).unwrap();
      setPhotoFile(null);
      toast.success(url ? tx("Profile photo updated") : tx("Profile photo removed"));
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, tx("Could not update your profile photo.")),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="lg:col-span-2">
        <div className="overflow-hidden rounded-3xl border border-ws-line bg-ws-panel shadow-sm">
          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ws-line bg-ws-card bg-cover bg-center text-2xl font-bold text-ws-fg shadow-xs"
                style={
                  avatarUrl
                    ? { backgroundImage: `url("${resolveFileUrl(avatarUrl)}")` }
                    : undefined
                }
              >
                {avatarUrl ? (
                  <span className="sr-only">{tx("Profile photo")}</span>
                ) : (
                  getInitials(currentUser.fullName)
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <BadgeCheck aria-hidden="true" className="size-3.5" />
                    {tx("Recruiter account")}
                  </span>
                  {profile?.status ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ws-card px-3 py-1 text-xs font-semibold text-ws-muted">
                      <ShieldCheck aria-hidden="true" className="size-3.5" />
                      {tx(formatStatus(profile.status))}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-ws-fg [overflow-wrap:anywhere] sm:text-3xl">
                  {currentUser.fullName || tx("Recruiter profile")}
                </h1>
                <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-ws-muted [overflow-wrap:anywhere]">
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl bg-ws-card p-4 text-sm lg:w-80">
              <ProfileFact
                label={tx("Position")}
                value={profile?.position || tx("Not added")}
              />
              <ProfileFact
                label={tx("LinkedIn")}
                value={profile?.linkedinUrl ? tx("Connected") : tx("Not added")}
              />
            </div>
          </div>
        </div>
      </section>

      <ProfileCard className="lg:order-2">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Camera aria-hidden="true" className="size-5" /></span>
          <div className="min-w-0">
            <h2 className="font-semibold text-ws-fg">{tx("Profile photo")}</h2>
            <p className="mt-1 text-sm leading-6 text-ws-muted">
              {tx("Shown on your workspace header and anywhere your account appears.")}</p>
          </div>
        </div>
        <div className="mt-5">
          <FileDropzone
            value={avatarUrl}
            file={photoFile}
            onFileChange={setPhotoFile}
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            hint="PNG, JPG or WebP up to 5 MB."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={() => void savePhoto()}
            disabled={isBusy || (!photoFile && !avatarUrl)}
            className={`h-11 rounded-xl px-6 ${focusRing}`}
          >
            <ImagePlus aria-hidden="true" className="size-4" />
            {isUploading ? tx("Uploading…") : update.isLoading ? tx("Saving…") : tx("Save photo")}
          </Button>
        </div>
      </ProfileCard>

      <ProfileCard className="lg:order-1">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Link2 aria-hidden="true" className="size-5" /></span>
          <div className="min-w-0">
            <h2 className="font-semibold text-ws-fg">{tx("Recruiter details")}</h2>
            <p className="mt-1 text-sm leading-6 text-ws-muted">
              {tx("Your position and LinkedIn profile, shown to candidates you contact.")}</p>
          </div>
        </div>
        <div className="mt-5">
          <RecruiterProfileForm profile={profileQuery.data} />
        </div>
      </ProfileCard>
    </div>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-ws-muted">{label}</span>
      <span className="min-w-0 truncate text-sm font-semibold text-ws-fg">{value}</span>
    </div>
  );
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
