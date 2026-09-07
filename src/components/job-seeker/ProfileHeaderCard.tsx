"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


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
  const tx = useWorkspaceTranslation();
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
      toast.success(avatarUrl ? tx("Profile photo updated") : tx("Profile photo removed"));
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, tx("Could not update your profile photo.")),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl border border-ws-line bg-ws-panel py-0 gap-0 shadow-xs ring-0">
      <CardContent className="p-0">
        <div className="relative bg-ws-panel p-4 sm:p-6">
          <div className="relative flex min-w-0 flex-col items-start gap-5 md:flex-row md:flex-wrap md:items-center xl:flex-nowrap">
            <div className="relative w-fit shrink-0">
              <div
                className="flex size-20 sm:size-22 items-center justify-center rounded-full bg-surface-muted bg-cover bg-center text-xl sm:text-2xl font-semibold text-primary shadow-md ring-4 ring-white/70 dark:ring-slate-800"
                style={
                  photoUrl
                    ? { backgroundImage: `url("${resolveFileUrl(photoUrl)}")` }
                    : undefined
                }
              >
                {photoUrl ? <span className="sr-only">{tx("Profile photo")}</span> : getInitials(name)}
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                aria-label={tx("Change profile photo")}
                className="absolute -bottom-1 -right-1 flex size-7 sm:size-8 items-center justify-center rounded-full bg-primary text-white shadow-md ring-2 ring-surface hover:bg-primary-hover"
              >
                <Camera className="size-3.5 sm:size-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ws-fg [overflow-wrap:anywhere]">{name}</h2>
                <span className={`inline-flex items-center gap-1 rounded-full border border-ws-line bg-ws-card px-2.5 py-1 text-xs font-semibold ${
                  profile.verificationStatus === "APPROVED" ? "text-primary" : "text-amber-500"
                }`}>
                  <BadgeCheck className="size-3" />
                  {tx(humanize(profile.verificationStatus))}
                </span>
              </div>
              <p className="mt-2 font-normal text-ws-muted [overflow-wrap:anywhere]">
                {profile.headline || tx("Add your professional headline")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip icon={MapPin}>{profile.preferredLocation || tx("Location not set")}</Chip>
                <Chip icon={BriefcaseBusiness}>
                  {tx(humanize(profile.availabilityStatus || "OPEN_TO_WORK"))}
                </Chip>
                <Chip icon={Eye}>{tx(humanize(profile.profileVisibility))} {tx(" profile")}</Chip>
              </div>
            </div>

            <div className="w-full min-w-0 rounded-2xl border border-ws-line bg-ws-card p-4 shadow-xs md:w-56 md:shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ws-fg">{tx("Profile strength")}</span>
                <span className="text-base font-semibold text-primary">{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ws-muted">{tx("Complete details to stand out.")}</p>
            </div>
          </div>

          {isEditorOpen ? (
            <div className="mt-6 rounded-2xl bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-ws-fg">{tx("Update profile photo")}</h3>
                  <p className="mt-1 text-xs text-ws-muted">{tx("Choose a clear square portrait.")}</p>
                </div>
                <button
                  type="button"
                  aria-label={tx("Close")}
                  onClick={() => setIsEditorOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-ws-muted hover:bg-surface-muted"
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
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setIsEditorOpen(false);
                  }}
                  className="h-10 rounded-lg px-4 text-sm font-medium text-ws-muted hover:bg-surface-muted"
                >
                  {tx("Cancel")}</button>
                <button
                  type="button"
                  onClick={() => void savePhoto()}
                  disabled={isUploading || isSaving || (!photoFile && !photoUrl)}
                  className="h-10 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
                >
                  {isUploading ? tx("Uploading…") : isSaving ? tx("Saving…") : tx("Save")}
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
  const tx = useWorkspaceTranslation();
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/10 bg-ws-panel px-2.5 py-1 text-xs text-ws-muted">
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="min-w-0 [overflow-wrap:anywhere]">{tx(children)}</span>
    </span>
  );
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
