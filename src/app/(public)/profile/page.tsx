"use client";

import { resolveFileUrl } from "@/lib/file-url";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import {
  Mail,
  MapPin,
  UserRound,
  Building2,
  UserCheck,
  Pencil,
  ExternalLink,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import type {
  CurrentUserResponse,
  JobSeekerProfileResponse,
} from "@/contracts";
import { KeycloakLogoutButton } from "@/components/auth/AuthActions";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCurrentUserQuery } from "@/services/authApi";
import { useGetJobSeekerProfileQuery } from "@/services/jobSeekerApi";

export default function ProfilePage() {
  const currentUser = useGetCurrentUserQuery();
  const isJobSeeker =
    currentUser.data?.roles.some((role) =>
      role.toUpperCase().includes("SEEKER"),
    ) ?? false;
  const jobSeekerProfile = useGetJobSeekerProfileQuery(undefined, {
    skip: !isJobSeeker,
  });

  const loading =
    currentUser.isLoading || (isJobSeeker && jobSeekerProfile.isLoading);
  const failed =
    currentUser.isError ||
    !currentUser.data ||
    (isJobSeeker && (jobSeekerProfile.isError || !jobSeekerProfile.data));

  return (
    <PublicShell>
      <main className="bg-canvas py-10 sm:py-14">
        <PageContainer className="max-w-4xl">
          {loading ? <LoadingState rows={6} /> : null}
          {!loading && failed ? (
            <ErrorState message="Unable to load your profile." />
          ) : null}
          {!loading && !failed && currentUser.data ? (
            <ProfileContent
              user={currentUser.data}
              jobSeekerProfile={jobSeekerProfile.data}
              image={resolveFileUrl(currentUser.data.avatarUrl)}
            />
          ) : null}
        </PageContainer>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}

function ProfileContent({
  user,
  jobSeekerProfile,
  image,
}: {
  user: CurrentUserResponse;
  jobSeekerProfile?: JobSeekerProfileResponse;
  image?: string | null;
}) {
  const isRecruiter = user.roles.some((role) =>
    role.toUpperCase().includes("RECRUITER"),
  );
  const isJobSeeker = user.roles.some((role) =>
    role.toUpperCase().includes("SEEKER"),
  );
  const workspaceHref = isRecruiter
    ? "/recruiter/dashboard"
    : isJobSeeker
      ? "/job-seeker/dashboard"
      : "/";

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-card)">
        {/*
         * The band is brand-only: a two-stop ramp between --primary and
         * --primary-hover, so it re-derives itself in dark mode instead of
         * carrying a second hard-coded palette.
         */}
        <div className="relative h-28 bg-linear-to-br from-brand to-brand-hover">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60 [background:radial-gradient(120%_140%_at_15%_0%,rgba(255,255,255,0.28),transparent_60%)]"
          />
          <div className="relative flex items-center justify-end gap-2 px-5 py-4 sm:px-7">
            <Button
              render={<Link href={workspaceHref} />}
              size="sm"
              className="bg-surface/90 font-semibold text-heading backdrop-blur-md hover:bg-surface"
            >
              Workspace <ExternalLink className="ml-1.5 size-3.5" />
            </Button>
            <KeycloakLogoutButton
              size="sm"
              variant="outline"
              className="border-transparent bg-surface/90 text-heading backdrop-blur-md hover:border-error/30 hover:bg-error/10 hover:text-error"
            />
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div
              className="relative -mt-12 flex size-24 shrink-0 items-center justify-center rounded-2xl bg-surface-muted bg-cover bg-center text-2xl font-black text-brand ring-4 ring-surface"
              style={image ? { backgroundImage: `url("${image}")` } : undefined}
            >
              {image ? (
                <span className="sr-only">Profile image</span>
              ) : (
                getInitials(user.fullName)
              )}
              <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-brand text-primary-foreground ring-4 ring-surface">
                <BadgeCheck className="size-3.5" />
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 self-start font-semibold sm:self-auto"
            >
              <Pencil className="size-3.5" /> Edit Profile
            </Button>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-heading">
                {user.fullName}
              </h1>
              {isRecruiter ? (
                <RoleChip icon={Building2} label="Recruiter" />
              ) : null}
              {isJobSeeker ? (
                <RoleChip icon={UserCheck} label="Jobseeker" />
              ) : null}
            </div>

            <p className="mt-1 text-sm font-semibold text-brand">
              {jobSeekerProfile?.headline ?? "Platform Professional"}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-3 text-xs font-medium text-body">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-fg" /> {user.email}
              </span>
              {jobSeekerProfile?.preferredLocation ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-fg" />{" "}
                  {jobSeekerProfile.preferredLocation}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <ProfileCard title="Basic Information" icon={UserRound}>
        <div className="divide-y divide-border">
          <ProfileRow label="Username" value={user.username} />
          <ProfileRow label="Full Name" value={user.fullName} />
          <ProfileRow label="Email Address" value={user.email} />
        </div>
      </ProfileCard>

      <ProfileCard title="Authentication & Roles" icon={ShieldCheck}>
        <div className="flex flex-wrap gap-1.5 py-4">
          {user.roles.map((role) => (
            <span
              key={role}
              className="rounded-md bg-chip-quiet px-2 py-0.5 text-xs font-semibold text-chip-quiet-fg"
            >
              {role}
            </span>
          ))}
        </div>
      </ProfileCard>
    </div>
  );
}

/** Role badges share one tint; the icon, not the hue, tells them apart. */
function RoleChip({ icon: Icon, label }: { icon: typeof UserRound; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-chip-soft px-2.5 py-0.5 text-xs font-bold text-chip-soft-fg">
      <Icon aria-hidden="true" className="size-3" /> {label}
    </span>
  );
}

function ProfileCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-card)">
      <CardHeader className="border-b border-border bg-surface-muted/40 px-6 py-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-heading">
          <span className="rounded-lg bg-brand-tint p-1.5 text-brand">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-1">{children}</CardContent>
    </Card>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-3">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-fg">
        {label}
      </span>
      <span className="text-sm font-medium text-heading">{value || "—"}</span>
    </div>
  );
}
