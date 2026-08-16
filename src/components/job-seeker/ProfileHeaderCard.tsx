"use client";

import { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Camera, Eye, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import type { JobSeekerProfileResponse } from "@/contracts";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { resolveFileUrl } from "@/lib/file-url";
import { getInitials } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-error";
import { uploadFile } from "@/lib/upload-file";
import { useUpdateJobSeekerProfileMutation } from "@/services/jobSeekerApi";
import { useGetCurrentUserQuery } from "@/services/authApi";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderCardProps {
  profile: JobSeekerProfileResponse;
}

/** Fields that count toward the profile strength meter. */
const STRENGTH_FIELDS = [
  "headline",
  "bio",
  "currentPosition",
  "preferredLocation",
  "availabilityStatus",
  "expectedSalaryMin",
  "expectedSalaryMax",
] as const satisfies readonly (keyof JobSeekerProfileResponse)[];

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const { data: currentUser } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isSaving }] =
    useUpdateJobSeekerProfileMutation();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // The photo lives on the backend profile, not on the auth session — the
  // mutation invalidates the JobSeekerProfile tag, so this re-renders on save.
  const photoUrl = profile.avatarUrl ?? "";

  const name = currentUser?.fullName || currentUser?.email || "Job seeker";

  const completedCount = STRENGTH_FIELDS.filter((field) => {
    const value = profile[field];
    return value !== undefined && value !== null && value !== "";
  }).length;
  const completion = Math.round((completedCount / STRENGTH_FIELDS.length) * 100);

  const savePhoto = async () => {
    try {
      setIsUploading(true);
      // The staged file travels only now — picking one changes nothing yet.
      const avatarUrl = photoFile
        ? await uploadFile(photoFile, "public")
        : "";

      // "" clears the column; the object itself is left in MinIO.
      await updateProfile({ avatarUrl }).unwrap();
      setPhotoFile(null);
      setIsEditorOpen(false);
      toast.success(avatarUrl ? "Profile photo updated" : "Profile photo removed");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not update your profile photo."),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-brand/15 via-brand/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div
                className="flex size-20 items-center justify-center rounded-full bg-surface-muted bg-cover bg-center text-xl font-bold text-brand ring-4 ring-white/50"
                style={
                  photoUrl
                    ? { backgroundImage: `url("${resolveFileUrl(photoUrl)}")` }
                    : undefined
                }
              >
                {photoUrl ? <span className="sr-only">Profile photo</span> : getInitials(name)}
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-brand text-white shadow-md ring-2 ring-surface hover:bg-brand/90"
              >
                <Camera className="size-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-heading">{name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand">
                  <BadgeCheck className="size-3" />
                  {humanize(profile.verificationStatus)}
                </span>
              </div>
              <p className="mt-1 font-medium text-brand">
                {profile.headline || "Add your professional headline"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip icon={MapPin}>{profile.preferredLocation || "Location not set"}</Chip>
                <Chip icon={BriefcaseBusiness}>
                  {humanize(profile.availabilityStatus || "OPEN_TO_WORK")}
                </Chip>
                <Chip icon={Eye}>{humanize(profile.profileVisibility)} profile</Chip>
              </div>
            </div>

            <div className="w-full rounded-2xl bg-surface/80 p-4 sm:w-48">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-heading">Profile strength</span>
                <span className="text-brand">{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Complete details to stand out.</p>
            </div>
          </div>

          {isEditorOpen ? (
            <div className="mt-6 rounded-2xl bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-heading">Update profile photo</h3>
                  <p className="mt-1 text-xs text-slate-500">Choose a clear square portrait.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-surface-muted"
                >
                  <X className="size-4" />
                </button>
              </div>
              <FileDropzone
                value={photoUrl}
                file={photoFile}
                onFileChange={setPhotoFile}
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                hint="PNG, JPG or WebP up to 5 MB."
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setIsEditorOpen(false);
                  }}
                  className="h-10 rounded-lg px-4 text-sm font-medium text-body hover:bg-surface-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void savePhoto()}
                  disabled={isUploading || isSaving || (!photoFile && !photoUrl)}
                  className="h-10 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
                >
                  {isUploading ? "Uploading…" : isSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Chip({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs text-slate-600">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
