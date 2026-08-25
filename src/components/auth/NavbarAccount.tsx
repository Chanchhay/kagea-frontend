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
      href="/recruiter/dashboard"
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface/95 text-left shadow-[0_2px_10px_rgba(15,23,42,0.07)] backdrop-blur transition-all duration-200 hover:border-brand/25 hover:shadow-[0_5px_18px_rgba(15,23,42,0.11)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        mobile ? "px-3 py-2.5" : "min-w-50 max-w-58 px-2.5 py-2",
      )}
      aria-label={`Open ${name}'s recruiter dashboard`}
    >
      <span
        className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center text-xs font-extrabold text-brand ring-1 ring-brand/15 transition-colors duration-200 group-hover:bg-brand group-hover:text-primary-foreground"
        style={image ? { backgroundImage: `url("${image}")` } : undefined}
      >
        {image ? <span className="sr-only">Profile image</span> : getInitials(name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-4 text-heading">
          {name}
        </span>
        <span className="mt-1 flex items-center gap-1.5 truncate text-[11px] font-medium leading-none text-muted-fg">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
          <span className="truncate">{role}</span>
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="mr-0.5 size-4 shrink-0 text-muted-fg/70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
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
