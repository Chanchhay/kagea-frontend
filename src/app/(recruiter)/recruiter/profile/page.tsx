"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
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

export default function RecruiterProfilePage() {
  const currentUserQuery = useGetCurrentUserQuery();
  const profileQuery = useGetRecruiterProfileQuery();
  const [updateProfile, update] = useUpdateRecruiterProfileMutation();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (currentUserQuery.isLoading || profileQuery.isLoading) {
    return <LoadingState rows={4} />;
  }
  if (currentUserQuery.isError || !currentUserQuery.data) {
    return <ErrorState message="Unable to load your account." />;
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
      toast.success(url ? "Profile photo updated" : "Profile photo removed");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not update your profile photo."),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <PageIntro
        title="Recruiter profile"
        description="Manage the personal details of the business owner."
      />
      <div className="grid gap-6">
        <PlainCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center text-lg font-bold text-brand"
                style={
                  avatarUrl
                    ? { backgroundImage: `url("${resolveFileUrl(avatarUrl)}")` }
                    : undefined
                }
              >
                {avatarUrl ? (
                  <span className="sr-only">Profile photo</span>
                ) : (
                  getInitials(currentUser.fullName)
                )}
              </div>
              <div>
                <h2 className="font-semibold text-heading">
                  {currentUser.fullName}
                </h2>
                <p className="mt-1 text-sm text-body">{currentUser.email}</p>
              </div>
            </div>
            <StatusPill>{currentUser.roles.join(", ")}</StatusPill>
          </div>
        </PlainCard>

        <PlainCard>
          <h2 className="font-semibold text-heading">Profile photo</h2>
          <p className="mt-1 mb-5 text-sm leading-6 text-body">
            Shown on your workspace header and anywhere your account appears.
          </p>
          <FileDropzone
            value={avatarUrl}
            file={photoFile}
            onFileChange={setPhotoFile}
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            hint="PNG, JPG or WebP up to 5 MB."
          />
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => void savePhoto()}
              disabled={isBusy || (!photoFile && !avatarUrl)}
              className="h-11 rounded-lg px-6"
            >
              {isUploading ? "Uploading…" : update.isLoading ? "Saving…" : "Save photo"}
            </Button>
          </div>
        </PlainCard>

        <PlainCard>
          <h2 className="font-semibold text-heading">Recruiter details</h2>
          <p className="mt-1 mb-5 text-sm leading-6 text-body">
            Your position and LinkedIn profile, shown to candidates you contact.
          </p>
          <RecruiterProfileForm profile={profileQuery.data} />
        </PlainCard>
      </div>
    </>
  );
}
