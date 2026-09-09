import type { MetadataRoute } from "next";
import { getApiEndpoint } from "@/lib/api-url";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

type SitemapJob = {
  id: string;
  companyId: string | null;
  publishedAt?: string;
};

type PublicJobsPage = {
  content?: SitemapJob[];
  page?: {
    number: number;
    totalPages: number;
  };
};

type PublicJobsResponse = {
  data?: PublicJobsPage;
};

const SITEMAP_PAGE_SIZE = 100;
const MAX_SITEMAP_JOBS = 5000;

function dateOrNow(value: string | undefined, now: Date) {
  if (!value) return now;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? now : date;
}

async function fetchPublicJobsForSitemap() {
  const jobs: SitemapJob[] = [];
  const maxPages = Math.ceil(MAX_SITEMAP_JOBS / SITEMAP_PAGE_SIZE);

  for (let page = 0; page < maxPages; page += 1) {
    const url = new URL(getApiEndpoint("/public/jobs"));
    url.searchParams.set("page", String(page));
    url.searchParams.set("size", String(SITEMAP_PAGE_SIZE));
    url.searchParams.set("sort", "publishedAt,desc");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate },
      });

      if (!res.ok) break;

      const json = (await res.json()) as PublicJobsResponse;
      const pageData = json.data;
      const pageJobs = pageData?.content ?? [];

      jobs.push(...pageJobs);

      if (
        pageJobs.length === 0 ||
        pageData?.page?.totalPages == null ||
        page >= pageData.page.totalPages - 1 ||
        jobs.length >= MAX_SITEMAP_JOBS
      ) {
        break;
      }
    } catch {
      break;
    } finally {
      clearTimeout(timeout);
    }
  }

  return jobs.slice(0, MAX_SITEMAP_JOBS);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const jobs = await fetchPublicJobsForSitemap();
  const companies = new Map<string, Date>();

  const jobPages = jobs.flatMap((job): MetadataRoute.Sitemap => {
    const lastModified = dateOrNow(job.publishedAt, now);

    if (job.companyId) {
      const previous = companies.get(job.companyId);
      if (!previous || lastModified > previous) {
        companies.set(job.companyId, lastModified);
      }
    }

    return [
      {
        url: `${siteUrl}/jobs/${job.id}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/practice-interview/${job.id}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      },
    ];
  });

  const companyPages: MetadataRoute.Sitemap = Array.from(
    companies,
    ([companyId, lastModified]) => ({
      url: `${siteUrl}/companies/${companyId}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [...staticPages, ...jobPages, ...companyPages];
}
