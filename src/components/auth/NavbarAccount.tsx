"use client";

import { useRef } from "react";
import { resolveFileUrl } from "@/lib/file-url";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { KeycloakLoginButton, KeycloakLogoutButton } from "./AuthActions";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const dashboardHref = getDashboardHref(currentUser.data?.roles);
  const image = resolveFileUrl(currentUser.data?.avatarUrl);

  if (mobile) {
    return (
      <div className="grid gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3">
          <Avatar name={name} image={image} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-heading">
              {name}
            </span>
            <span className="block truncate text-xs text-body">{role}</span>
          </span>
        </div>
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-body hover:bg-surface-muted"
        >
          <LayoutDashboard aria-hidden="true" className="size-4" />
          Dashboard
        </Link>
        <KeycloakLogoutButton
          variant="ghost"
          className="w-full justify-start px-3 text-body"
        />
      </div>
    );
  }

  return (
    <ProfileMenu name={name} role={role} image={image} dashboardHref={dashboardHref} />
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

function ProfileMenu({
  name,
  role,
  image,
  dashboardHref,
}: {
  name: string;
  role: string;
  image?: string | null;
  dashboardHref: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group flex max-w-64 items-center gap-3 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-left shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        aria-label={`Open ${name}'s account menu`}
      >
        <Avatar name={name} image={image} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-heading">
            {name}
          </span>
          <span className="block truncate text-xs text-body">{role}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-fg transition-transform group-aria-expanded:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem render={<Link href={dashboardHref} />}>
          <LayoutDashboard aria-hidden="true" />
          Dashboard
        </DropdownMenuItem>
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SignOutMenuItem() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <DropdownMenuItem
        onClick={() => formRef.current?.requestSubmit()}
        className="text-error focus:bg-error/10 focus:text-error"
      >
        <LogOut aria-hidden="true" />
        Sign out
      </DropdownMenuItem>
      {/* Logout is a gateway session POST (see AuthActions.tsx); the menu
          item can't be a <form>, so it submits this hidden one instead. */}
      <form ref={formRef} action="/logout" method="post" className="hidden" />
    </>
  );
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center text-xs font-bold text-brand ring-1 ring-brand/20"
      style={image ? { backgroundImage: `url("${image}")` } : undefined}
    >
      {image ? <span className="sr-only">Profile image</span> : getInitials(name)}
    </span>
  );
}

function getDashboardHref(roles?: string[]) {
  const normalizedRoles = roles?.map((role) => role.toUpperCase()) ?? [];
  if (normalizedRoles.some((role) => role.includes("RECRUITER"))) {
    return "/recruiter/dashboard";
  }
  if (normalizedRoles.some((role) => role.includes("SEEKER"))) {
    return "/job-seeker/dashboard";
  }

  return "/";
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
