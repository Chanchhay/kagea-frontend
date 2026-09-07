"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { resolveFileUrl } from "@/lib/file-url";
import Link from "next/link";
import responsive from "@/components/workspace/DashboardResponsive.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  LogOut,
  Search,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/shared/BrandLogo";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import {
  PageHeadingProvider,
  usePageHeading,
} from "@/components/layout/PageHeader";
import { jobSeekerNavigation, recruiterNavigation } from "@/lib/navigation";
import { cn, getInitials } from "@/lib/utils";
import { useGetCurrentUserQuery, useGetSessionQuery } from "@/services/authApi";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

type Role = "job-seeker" | "recruiter";

type WorkspaceShellProps = {
  role: Role;
  /** Shown next to the back arrow when a page has not published its own title. */
  title: string;
  links: NavLink[];
  children: ReactNode;
};

/** Where the chrome's search, create, and alert controls land per role. */
const quickActions: Record<Role, { search: string; create: string; alerts: string }> = {
  "job-seeker": {
    search: "/job-seeker/jobs",
    create: "/job-seeker/jobs",
    alerts: "/job-seeker/interviews",
  },
  recruiter: {
    search: "/recruiter/talent",
    create: "/recruiter/jobs/new",
    alerts: "/recruiter/forwarded-candidates",
  },
};

/**
 * The workspace frame: an icon rail and a single rounded panel floating on a
 * dark canvas. Deliberately not a dashboard chrome — no bordered header band,
 * no page description column; pages own their own composition inside the panel.
 */
export function WorkspaceShell(props: WorkspaceShellProps) {
  return (
    <PageHeadingProvider>
      <WorkspaceFrame {...props} />
    </PageHeadingProvider>
  );
}

function WorkspaceFrame({ role, title, links, children }: WorkspaceShellProps) {
  const tx = useWorkspaceTranslation();
  const pathname = usePathname();
  const heading = usePageHeading();
  const activeLink = links.find((link) => isActivePath(pathname, link.href));
  const pageTitle = heading?.title ?? tx(activeLink?.label ?? title);
  const pageDescription = heading?.description;

  return (
    /*
     * The frame owns the viewport height and never scrolls itself: the rail
     * stays exactly one screen tall however long a page gets, and the panel's
     * <main> is the only scroller, which leaves the top bar pinned above it.
     */
    <div className={cn("ws-shell flex h-dvh gap-3 overflow-hidden bg-ws-canvas p-0 text-ws-fg lg:p-3", pathname === `/${role}/dashboard` && responsive.shell)}>
      <Rail links={links} pathname={pathname} />

      <div className="ws-panel relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-none lg:rounded-[28px]">
        <TopBar
          title={pageTitle}
          description={tx(pageDescription)}
          role={role}
        />

        <main className="ws-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-2 max-md:pb-[calc(9rem+env(safe-area-inset-bottom))] lg:px-7 lg:pb-8">
          <div
            key={pathname}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
          >
            {children}
          </div>
        </main>
      </div>

      <MobileDock links={links} pathname={pathname} />
    </div>
  );
}

/* ---------------------------------------------------------------- rail --- */

function Rail({ links, pathname }: { links: NavLink[]; pathname: string }) {
  const tx = useWorkspaceTranslation();
  return (
    <aside
      aria-label={tx("Workspace navigation")}
      className="ws-panel hidden h-full w-17 shrink-0 flex-col items-center rounded-[28px] py-5 lg:flex"
    >
      <Link
        href="/"
        aria-label={tx("Kagea home")}
        className="flex size-10 items-center justify-center transition-transform hover:scale-105"
      >
        <BrandMark height={30} />
      </Link>

      {/*
        * Scrolling is opt-in by viewport height: `overflow-y` also clips the
        * horizontal axis, which would eat the hover labels, so the rail only
        * becomes a scroller on screens too short to hold every icon.
        */}
      <nav className="ws-scroll mt-8 flex min-h-0 flex-col items-center gap-1.5 [@media(max-height:44rem)]:overflow-y-auto">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex size-11 items-center justify-center rounded-[18px] transition-colors",
                active
                  ? "bg-chip-solid text-chip-solid-fg"
                  : "text-ws-faint hover:bg-ws-card hover:text-ws-fg",
              )}
            >
              <link.icon aria-hidden="true" className="size-5" />
              {/* Label only on hover: the rail stays an icon strip, not a menu. */}
              <span className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-lg bg-ws-card px-2.5 py-1.5 text-xs font-medium text-ws-fg shadow-(--shadow-dropdown) group-hover:block">
                {tx(link.label)}
              </span>
            </Link>
          );
        })}
      </nav>

      <SignOutRailButton />
    </aside>
  );
}

function SignOutRailButton() {
  const tx = useWorkspaceTranslation();
  return (
    <form action="/logout" method="post" className="mt-auto pt-4">
      <button
        type="submit"
        aria-label={tx("Sign out")}
        className="group relative flex size-11 items-center justify-center rounded-[18px] text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
      >
        <LogOut aria-hidden="true" className="size-5" />
        <span className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-lg bg-ws-card px-2.5 py-1.5 text-xs font-medium text-ws-fg shadow-(--shadow-dropdown) group-hover:block">
          {tx("Sign out")}</span>
      </button>
    </form>
  );
}

/* -------------------------------------------------------------- top bar --- */

function TopBar({
  title,
  description,
  role,
}: {
  title: string;
  description?: string;
  role: Role;
}) {
  const tx = useWorkspaceTranslation();
  const actions = quickActions[role];

  return (
    <header className="sticky top-0 z-30 grid shrink-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-ws-line/60 bg-ws-panel px-4 py-4 sm:flex lg:px-7 lg:py-5">
      <Link
        href="/"
        aria-label={tx("Back to site")}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-4.5" />
      </Link>

      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight lg:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-0.5 hidden truncate text-base font-normal text-ws-muted sm:block">
            {tx(description)}
          </p>
        ) : null}
      </div>

      <div className="col-span-2 ml-auto flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
        <Link
          href="/"
          aria-label={tx("Kagea home")}
          className="mr-auto flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-105 sm:mr-0 lg:hidden"
        >
          <BrandMark height={26} />
        </Link>

        <QuickSearch
          href={actions.search}
          placeholder={tx(role === "recruiter" ? "Search talent" : "Search jobs")}
        />

        <LanguageToggle className="h-10 shrink-0 border-ws-line text-ws-fg" />

        <ThemeToggle className="size-10 rounded-full bg-ws-card text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg" />

        {/*
          * Path prefixes this app can route to. The inbox is shared with the
          * admin console, whose deep links would 404 here, so those render as
          * plain text instead of links. Every seeker- and recruiter-targeted
          * notification uses one of these two prefixes.
          */}
        <NotificationBell pathPrefixes={["/job-seeker", "/recruiter"]} />

        <Avatar role={role} />
      </div>
    </header>
  );
}

/** Hands the query to the in-workspace explorer rather than any public page. */
function QuickSearch({ href, placeholder }: { href: string; placeholder: string }) {
  const tx = useWorkspaceTranslation();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const query = keyword.trim();
        router.push(query ? `${href}?q=${encodeURIComponent(query)}` : href);
      }}
      className="hidden items-center gap-2 rounded-full bg-ws-card px-4 py-2.5 text-sm text-ws-muted transition-colors focus-within:bg-ws-card-hover xl:flex"
    >
      <Search aria-hidden="true" className="size-4 shrink-0" />
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder={tx(placeholder)}
        aria-label={tx(placeholder)}
        className="w-40 bg-transparent text-ws-fg outline-none placeholder:text-ws-faint xl:w-56"
      />
    </form>
  );
}

function Avatar({ role }: { role: Role }) {
  const tx = useWorkspaceTranslation();
  const { data: session } = useGetSessionQuery();
  const currentUser = useGetCurrentUserQuery(undefined, {
    skip: !session?.authenticated,
  });

  if (!session?.authenticated) return null;

  const name =
    currentUser.data?.fullName || session.username || session.email || "Account";
  // The uploaded avatar lives on the backend profile; the auth session only
  // carries whatever picture Keycloak happens to hold.
  const avatar = resolveFileUrl(currentUser.data?.avatarUrl);

  return (
    <Link
      href={`/${role}/profile`}
      aria-label={tx("Open {0}'s profile", { 0: name })}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chip-solid bg-cover bg-center text-xs font-semibold text-chip-solid-fg ring-2 ring-ws-line"
      style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}
    >
      {avatar ? <span className="sr-only">{tx("Profile image")}</span> : getInitials(name)}
    </Link>
  );
}

/* ---------------------------------------------------------- mobile dock --- */

/**
 * On small screens the rail becomes a floating dock: same icons, still no
 * hamburger menu, so navigation stays one tap away.
 */
function MobileDock({ links, pathname }: { links: NavLink[]; pathname: string }) {
  const tx = useWorkspaceTranslation();
  return (
    <nav
      aria-label={tx("Workspace navigation")}
      className="ws-scroll fixed inset-x-3 bottom-3 z-40 flex justify-center gap-1 overflow-x-auto rounded-full bg-ws-card/95 p-1 shadow-(--shadow-dropdown) backdrop-blur sm:mx-auto sm:w-fit sm:max-w-[calc(100%-1.5rem)] sm:p-1.5 max-md:bottom-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={tx(link.label)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex aspect-square min-w-0 max-w-11 flex-1 items-center justify-center rounded-full transition-colors sm:max-w-none sm:flex-none sm:size-11",
              active
                ? "bg-chip-solid text-chip-solid-fg"
                : "text-ws-faint hover:text-ws-fg",
            )}
          >
            <link.icon aria-hidden="true" className="size-4 sm:size-5" />
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------- helpers --- */

function isActivePath(pathname: string, href: string) {
  return href.endsWith("/dashboard")
    ? pathname === href
    : pathname.startsWith(href);
}

/*
 * Re-exported from this client module so the icon components stay on the client
 * side of the boundary — a server layout cannot hand functions to a client one.
 */
export const jobSeekerLinks = [...jobSeekerNavigation] satisfies NavLink[];

export const recruiterLinks = [...recruiterNavigation] satisfies NavLink[];
