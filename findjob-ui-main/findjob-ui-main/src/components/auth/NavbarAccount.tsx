"use client";

import { useRef } from "react";
import { resolveFileUrl } from "@/lib/file-url";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
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
  const workspacePrefix = getWorkspacePrefix(currentUser.data?.roles);
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
    <ProfileMenu
      name={name}
      role={role}
      image={image}
      dashboardHref={dashboardHref}
      profileHref={workspacePrefix ? `${workspacePrefix}/profile` : null}
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
        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-brand-hover"
      >
        Register
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <KeycloakLoginButton variant="ghost" className="rounded-full px-5">Login</KeycloakLoginButton>
      <Link
        href="/register"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
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
  profileHref,
}: {
  name: string;
  role: string;
  image?: string | null;
  dashboardHref: string;
  profileHref: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group flex max-w-64 items-center gap-3 rounded-lg px-1 py-1 text-left transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        aria-label={`Open ${name}'s account menu`}
      >
        <Avatar name={name} image={image} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-heading transition-colors group-hover:text-brand">
            {name}
          </span>
          <span className="block truncate text-xs text-body">{role}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-fg transition-transform group-aria-expanded:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-76 p-0">
        {/* Identity block: the avatar large enough to read, the role as a chip
            rather than a second line of grey text. */}
        <div className="flex items-center gap-3 px-4 pb-4 pt-5">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center font-medium text-brand"
            style={image ? { backgroundImage: `url("${image}")` } : undefined}
          >
            {image ? <span className="sr-only">Profile image</span> : getInitials(name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-heading">{name}</span>
            <span className="mt-1 inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-muted-fg">
              {role}
            </span>
          </span>
        </div>

        <div className="h-px bg-border" />

        <div className="p-2">
          <DropdownMenuItem
            render={<Link href={dashboardHref} />}
            className="text-body focus:bg-surface-muted focus:text-heading"
          >
            <LayoutDashboard aria-hidden="true" className="size-5 text-muted-fg" />
            Dashboard
          </DropdownMenuItem>
          {profileHref ? (
            <DropdownMenuItem
              render={<Link href={profileHref} />}
              className="text-body focus:bg-surface-muted focus:text-heading"
            >
              <UserRound aria-hidden="true" className="size-5 text-muted-fg" />
              Your profile
            </DropdownMenuItem>
          ) : null}
        </div>

        <div className="h-px bg-border" />

        <div className="p-2">
          <SignOutMenuItem />
        </div>
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
        <LogOut aria-hidden="true" className="size-5" />
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
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center text-xs font-semibold text-brand ring-1 ring-brand/20"
      style={image ? { backgroundImage: `url("${image}")` } : undefined}
    >
      {image ? <span className="sr-only">Profile image</span> : getInitials(name)}
    </span>
  );
}

/** Both role areas expose the same two routes, so the menu derives its links
 *  from one prefix rather than branching per item. */
function getWorkspacePrefix(roles?: string[]) {
  const normalizedRoles = roles?.map((role) => role.toUpperCase()) ?? [];
  if (normalizedRoles.some((role) => role.includes("RECRUITER"))) return "/recruiter";
  if (normalizedRoles.some((role) => role.includes("SEEKER"))) return "/job-seeker";
  return null;
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
