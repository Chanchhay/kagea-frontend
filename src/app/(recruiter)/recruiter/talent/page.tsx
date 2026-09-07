"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  MapPin,
  Search,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { resolveFileUrl } from "@/lib/file-url";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetTalentQuery } from "@/services/recruiterApi";
import type { PublicTalentListItemResponse } from "@/contracts";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ws-panel";

const AVAILABILITY_OPTIONS = [
  { value: "ALL", label: "All availability statuses" },
  { value: "Actively Looking", label: "Actively looking" },
  { value: "Open to Offers", label: "Open to offers" },
  { value: "Notice Period Required", label: "Serving notice period" },
  { value: "Not Available", label: "Not available" },
];

export default function TalentDiscoveryPage() {
  const tx = useWorkspaceTranslation();
  const [keyword, setKeyword] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<string>("ALL");
  const [page, setPage] = useState(0);

  const talentQuery = useGetTalentQuery({
    keyword: keyword.trim() || undefined,
    preferredLocation: preferredLocation.trim() || undefined,
    availabilityStatus: availabilityStatus !== "ALL" ? availabilityStatus : undefined,
    page,
    size: 10,
  });

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(0);
  };

  const hasFilters = Boolean(keyword || preferredLocation || availabilityStatus !== "ALL");
  const clearFilters = () => {
    setKeyword("");
    setPreferredLocation("");
    setAvailabilityStatus("ALL");
    setPage(0);
  };

  const talentPage = talentQuery.data;
  const talents = talentPage?.content ?? [];
  const totalPages = talentPage?.totalPages ?? 0;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-ws-panel p-5 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-80 rounded-full bg-primary/5" />
        <div className="relative flex min-w-0 items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex"><Users aria-hidden="true" className="size-6" /></span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ws-fg sm:text-3xl">{tx("Talent discovery")}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ws-muted">{tx("Explore published job-seeker profiles open for recruitment and candidate sourcing.")}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSearchSubmit} className="min-w-0 space-y-4 rounded-3xl border border-ws-line bg-ws-panel p-5 sm:p-6">
        <div className="grid min-w-0 gap-3 md:grid-cols-3">
          <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-ws-line bg-ws-card px-3.5 text-ws-muted transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <Search aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">{tx("Search headline, skills, position")}</span>
            <input type="text" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={tx("Search headline, skills, position…")} className="min-w-0 w-full bg-transparent py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint" />
          </label>
          <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-ws-line bg-ws-card px-3.5 text-ws-muted transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <MapPin aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">{tx("Preferred location")}</span>
            <input type="text" value={preferredLocation} onChange={(event) => setPreferredLocation(event.target.value)} placeholder={tx("Location (e.g. Remote, HCMC)…")} className="min-w-0 w-full bg-transparent py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint" />
          </label>
          <Select
            value={availabilityStatus}
            onValueChange={(value) => {
              setAvailabilityStatus(value ?? "ALL");
              setPage(0);
            }}
          >
            <SelectTrigger className="h-11 w-full min-w-0 rounded-xl border-ws-line bg-ws-card text-sm text-ws-fg">
              <SelectValue placeholder={tx("Availability status")} />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{tx(option.label)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ws-line pt-4">
          <span className="text-xs text-ws-muted">
            {talentPage ? tx("{0} candidate(s) found", { 0: talentPage.totalElements }) : tx("Searching candidates…")}
          </span>
          <div className="flex items-center gap-2">
            {hasFilters ? (
              <button type="button" onClick={clearFilters} className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium text-ws-muted transition hover:bg-ws-card-hover hover:text-ws-fg ${focusRing}`}>
                <X aria-hidden="true" className="size-3.5 shrink-0" />{tx("Clear filters")}
              </button>
            ) : null}
            <button type="submit" className={`inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-hover ${focusRing}`}>
              <Search aria-hidden="true" className="size-3.5 shrink-0" />{tx("Search candidates")}
            </button>
          </div>
        </div>
      </form>

      {talentQuery.isLoading ? (
        <LoadingState rows={6} />
      ) : talentQuery.isError ? (
        <ErrorState message={tx("Unable to load public candidate profiles. Please try again.")} onRetry={() => void talentQuery.refetch()} />
      ) : talents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-5 py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Users aria-hidden="true" className="size-8" /></span>
          <h2 className="mt-5 text-lg font-semibold text-ws-fg">{tx("No candidates match your criteria")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ws-muted">{tx("Try broadening your search keywords or location filters.")}</p>
          {hasFilters ? (
            <button type="button" onClick={clearFilters} className={`mt-5 rounded-xl border border-primary/20 bg-ws-panel px-5 py-3 text-sm font-semibold text-primary ${focusRing}`}>{tx("Clear filters")}</button>
          ) : null}
        </div>
      ) : (
        <div className="min-w-0 space-y-5">
          <div className="grid min-w-0 gap-4">
            {talents.map((talent) => (
              <TalentRow key={talent.profileId} talent={talent} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 border-t border-ws-line pt-4 max-md:flex-wrap">
              <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} className={`inline-flex h-10 items-center gap-1.5 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40 ${focusRing}`}>
                <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />{tx("Previous")}
              </button>
              <span className="text-xs text-ws-muted">{tx("Page ")}{page + 1} {tx(" of ")}{totalPages}</span>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))} className={`inline-flex h-10 items-center gap-1.5 rounded-xl bg-ws-card px-4 text-sm font-semibold text-ws-fg disabled:opacity-40 ${focusRing}`}>
                {tx("Next")}<ChevronRight aria-hidden="true" className="size-4 shrink-0" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function TalentRow({ talent }: { talent: PublicTalentListItemResponse }) {
  const tx = useWorkspaceTranslation();
  const availability = availabilityInfo(talent.availabilityStatus);
  const avatarUrl = resolveFileUrl(talent.avatarUrl);
  const salary = formatSalaryRange(talent.expectedSalaryMin, talent.expectedSalaryMax, talent.expectedSalaryCurrency);

  return (
    <article className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-ws-line bg-ws-panel p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-start sm:justify-between sm:p-6">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" fill unoptimized sizes="48px" className="object-cover" />
          ) : (
            <UserRound aria-hidden="true" className="size-6" />
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 text-lg font-semibold tracking-tight text-ws-fg [overflow-wrap:anywhere] group-hover:text-primary">
              {talent.headline || tx("Published candidate")}
            </h3>
            {talent.availabilityStatus ? (
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${availability.className}`}>
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${availability.accent}`} />
                {tx(talent.availabilityStatus)}
              </span>
            ) : null}
          </div>

          {talent.currentPosition ? (
            <p className="flex items-center gap-1.5 text-sm font-medium text-ws-fg [overflow-wrap:anywhere]">
              <Briefcase aria-hidden="true" className="size-4 shrink-0 text-ws-muted" />
              {talent.currentPosition}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ws-muted">
            {talent.preferredLocation ? (
              <span className="flex items-center gap-1"><MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />{talent.preferredLocation}</span>
            ) : null}
            {salary ? (
              <span className="flex items-center gap-1"><DollarSign aria-hidden="true" className="size-3.5 shrink-0 text-primary" />{salary}</span>
            ) : null}
          </div>

          {talent.bio ? (
            <p className="line-clamp-2 text-xs leading-relaxed text-ws-muted [overflow-wrap:anywhere]">{talent.bio}</p>
          ) : null}
        </div>
      </div>

      <Link href={`/recruiter/talent/${talent.publicProfileSlug}`} className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/50 hover:bg-primary/5 dark:bg-ws-panel ${focusRing}`}>
        <UserRound aria-hidden="true" className="size-4 shrink-0" />{tx("View profile")}
      </Link>
    </article>
  );
}

function availabilityInfo(status: string): { className: string; accent: string } {
  switch (status) {
    case "Actively Looking":
      return { className: "bg-primary/10 text-primary", accent: "bg-primary" };
    case "Open to Offers":
      return { className: "bg-blue-500/10 text-blue-700 dark:text-blue-300", accent: "bg-blue-400" };
    case "Notice Period Required":
      return { className: "bg-amber-400/15 text-amber-700 dark:text-amber-300", accent: "bg-amber-400" };
    default:
      return { className: "bg-ws-card text-ws-muted", accent: "bg-ws-faint" };
  }
}

function formatSalaryRange(min?: number, max?: number, currency = "USD") {
  if (!min && !max) return null;
  const fmt = new Intl.NumberFormat();
  if (min && max) return `${currency} ${fmt.format(min)} - ${fmt.format(max)}`;
  if (min) return `From ${currency} ${fmt.format(min)}`;
  return `Up to ${currency} ${fmt.format(max!)}`;
}
