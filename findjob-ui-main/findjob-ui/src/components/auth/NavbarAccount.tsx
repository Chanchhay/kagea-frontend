"use client";

import { resolveFileUrl } from "@/lib/file-url";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { KeycloakLoginButton, KeycloakLogoutButton } from "./AuthActions";
import { cn, getInitials } from "@/lib/utils";
import { useGetCurrentUserQuery, useGetSessionQuery } from "@/services/authApi";

type NavbarAccountProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function NavbarAccount({
  mobile = false,
  onNavigate,
}: NavbarAccountProps) {
  const { data: session, isLoading } = useGetSessionQuery();
  const currentUser = useGetCurrentUserQuery(undefined, {
    skip: !session?.authenticated,
  });

  if (isLoading || !session?.authenticated) {
    return <SignedOutActions mobile={mobile} onNavigate={onNavigate} />;
  }

  const name =
    currentUser.data?.fullName || session.username || session.email || "Account";
  const role = getRoleLabel(currentUser.data?.roles);

  if (mobile) {
    return (
      <div className="grid gap-2 border-t border-border pt-3">
        <ProfileLink
          name={name}
          role={role}
          image={resolveFileUrl(currentUser.data?.avatarUrl)}
          mobile
          onClick={onNavigate}
        />
        <KeycloakLogoutButton
          variant="ghost"
          className="w-full justify-start px-3 text-body"
        />
      </div>
    );
  }

  return (
    <ProfileLink
      name={name}
      role={role}
      image={resolveFileUrl(currentUser.data?.avatarUrl)}
    />
  );
}

function SignedOutActions({
  mobile,
  onNavigate,
}: {
  mobile: boolean;
  onNavigate?: () => void;
}) {
  return mobile ? (
    <div className="mt-3 grid gap-2 border-t border-border pt-4">
      <KeycloakLoginButton
        variant="outline"
        className="w-full rounded-full"
        onClick={onNavigate}
      >
        Login
      </KeycloakLoginButton>
      <Link
        href="/register"
        onClick={onNavigate}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:bg-brand-hover"
      >
        Register
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <KeycloakLoginButton variant="ghost" className="rounded-full px-5">Login</KeycloakLoginButton>
      <Link
        href="/register"
        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        Register
      </Link>
    </div>
  );
}

function ProfileLink({
  name,
  role,
  image,
  mobile = false,
  onClick,
}: {
  name: string;
  role: string;
  image?: string | null;
  mobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/profile"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border bg-surface text-left transition-colors hover:border-brand/40 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        mobile ? "px-3 py-3" : "max-w-64 px-2.5 py-1.5 shadow-sm",
      )}
      aria-label={`Open ${name}'s profile`}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center text-xs font-bold text-brand ring-1 ring-brand/20"
        style={image ? { backgroundImage: `url("${image}")` } : undefined}
      >
        {image ? <span className="sr-only">Profile image</span> : getInitials(name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-heading">
          {name}
        </span>
        <span className="block truncate text-xs text-body">{role}</span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-fg transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function getRoleLabel(roles?: string[]) {
  const normalizedRoles = roles?.map((role) => role.toUpperCase()) ?? [];
  if (normalizedRoles.some((role) => role.includes("RECRUITER"))) {
    return "Recruiter";
  }
  if (normalizedRoles.some((role) => role.includes("SEEKER"))) {
    return "Job seeker";
  }

  return normalizedRoles[0]?.replace(/^ROLE_/, "").replaceAll("_", " ") || "Account";
}
