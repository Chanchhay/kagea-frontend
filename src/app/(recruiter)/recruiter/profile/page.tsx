"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import { useState } from "react";
import { toast } from "sonner";
import { Camera, ImagePlus, Link2, UserRound } from "lucide-react";
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

function ProfileCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ws-line bg-ws-panel p-5 shadow-sm sm:p-7">
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
    <div className="mx-auto w-full min-w-0 max-w-4xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-ws-panel p-5 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-80 rounded-full bg-primary/5" />
        <div className="relative flex min-w-0 items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex"><UserRound aria-hidden="true" className="size-6" /></span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Recruiter profile")}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{tx("Manage the personal details of the business owner.")}</p>
          </div>
        </div>
      </header>

      <ProfileCard>
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/15 bg-primary/10 bg-cover bg-center text-lg font-semibold text-primary"
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
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold tracking-tight text-ws-fg [overflow-wrap:anywhere]">
              {currentUser.fullName}
            </h2>
            <p className="mt-1 text-sm text-ws-muted [overflow-wrap:anywhere]">{currentUser.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {currentUser.roles.map((role) => (
                <span key={role} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {tx(formatRole(role))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ProfileCard>

      <ProfileCard>
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

      <ProfileCard>
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

function formatRole(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
