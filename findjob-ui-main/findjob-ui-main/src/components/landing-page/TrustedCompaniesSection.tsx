'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetPublicJobsQuery } from '@/services/publicApi';
import { resolveFileUrl } from '@/lib/file-url';

type Client = {
  id: string;
  name: string;
  logoUrl: string;
  jobCount: number;
};

/**
 * The API has no "companies" endpoint, so the client list is derived from the
 * employers behind the published jobs — the same source the hero marquee uses.
 * Confidential postings carry no `companyId` and are skipped: there is nothing
 * to name and nothing to link to.
 */
function useClients() {
  const jobsQuery = useGetPublicJobsQuery({ size: 100, sort: 'publishedAt,desc' });

  const clients = useMemo<Client[]>(() => {
    const byCompany = new Map<string, Client>();

    for (const job of jobsQuery.data?.content ?? []) {
      if (job.companyId === null) continue;

      const existing = byCompany.get(job.companyId);
      if (existing) {
        existing.jobCount += 1;
        continue;
      }

      byCompany.set(job.companyId, {
        id: job.companyId,
        name: job.companyName,
        logoUrl: resolveFileUrl(job.companyLogoUrl ?? job.logoUrl),
        jobCount: 1,
      });
    }

    return [...byCompany.values()].sort(
      (a, b) => b.jobCount - a.jobCount || a.name.localeCompare(b.name),
    );
  }, [jobsQuery.data?.content]);

  return { clients, isLoading: jobsQuery.isLoading, isError: jobsQuery.isError };
}

function ClientMark({ client }: { client: Client }) {
  return (
    <Link
      href={`/companies/${client.id}`}
      aria-label={`View ${client.name}`}
      className="group flex h-10 shrink-0 items-center gap-3 px-1"
    >
      {client.logoUrl ? (
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
          <Image
            src={client.logoUrl}
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            sizes="32px"
            className="object-contain grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100 dark:invert dark:group-hover:invert-0"
          />
        </span>
      ) : null}
      <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-slate-400 transition-colors duration-300 group-hover:text-slate-900 sm:text-xl dark:text-white/40 dark:group-hover:text-white">
        {client.name}
      </span>
    </Link>
  );
}

export default function TrustedCompaniesSection() {
  const { clients, isLoading, isError } = useClients();

  // A short list would leave a visible gap mid-scroll, so the row is padded by
  // repeating the clients up to a minimum length before it is duplicated.
  const row = clients.length
    ? Array.from({ length: Math.max(8, clients.length) }, (_, i) => clients[i % clients.length])
    : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        data-reveal
        className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-12 sm:rounded-[36px] sm:px-10 sm:py-16 lg:px-14 dark:border-[#3E444B] dark:bg-[#22262C]"
      >
        {/* Statement */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
          <div className="flex items-start gap-2.5 pt-1">
            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900 dark:bg-white" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Who we work with
            </span>
          </div>

          <h2 className="text-2xl font-medium leading-[1.25] tracking-tight text-slate-900 sm:text-3xl lg:text-[2.5rem] dark:text-white">
            We work with ambitious employers across Cambodia — teams whose hiring
            has outgrown word of mouth, and who need the right people faster than
            the market can find them.
          </h2>
        </div>

        {/* Clients */}
        <div className="mt-16 sm:mt-24">
          <p className="text-center text-[18px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-white/40">
            Our clients
          </p>

          {isError ? (
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-white/50">
              Unable to load companies right now.
            </p>
          ) : isLoading ? (
            <div className="mt-8 flex items-center justify-center gap-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="h-5 w-28 animate-pulse rounded bg-slate-100 dark:bg-white/10"
                />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-white/50">
              Companies with published jobs will appear here.
            </p>
          ) : (
            <div className="client-marquee mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="client-marquee-track flex w-max">
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    aria-hidden={copy === 1}
                    className="flex shrink-0 items-center"
                  >
                    {row.map((client, index) => (
                      <div key={`${copy}-${client.id}-${index}`} className="flex items-center">
                        <ClientMark client={client} />
                        {/* The small square between marks, as on the reference layout. */}
                        <span
                          aria-hidden="true"
                          className="mx-6 h-1.5 w-1.5 shrink-0 bg-slate-300 sm:mx-8 dark:bg-white/25"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .client-marquee-track {
          animation: client-marquee 40s linear infinite;
          will-change: transform;
        }

        .client-marquee:hover .client-marquee-track {
          animation-play-state: paused;
        }

        @keyframes client-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .client-marquee {
            mask-image: none;
            overflow-x: auto;
          }

          .client-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
