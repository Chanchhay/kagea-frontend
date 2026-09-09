import type { Metadata } from "next";
import { jobPostingSchema } from "@/lib/schema";
import { isUuid } from "@/lib/uuid";
import { getApiEndpoint } from "@/lib/api-url";

type Props = {
  params: Promise<{ jobId: string }>;
  children: React.ReactNode;
};

type JobDetail = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  companyLogoUrl?: string | null;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  publishedAt?: string;
  expiredAt?: string;
};

async function getJob(jobId: string): Promise<JobDetail | null> {
  if (!isUuid(jobId)) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(getApiEndpoint(`/public/jobs/${jobId}`), {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const job = await getJob(jobId);

  if (!job) {
    return {
      title: "Job Details | Find Job Cambodia",
      description: "Explore job details and career opportunities in Cambodia on Find Job.",
      alternates: {
        canonical: `${siteUrl}/jobs/${jobId}`,
      },
    };
  }

  const plainDesc = job.description
    ? job.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : "View details and apply for this job on Find Job Cambodia.";

  const title = `${job.title} at ${job.companyName}`;

  return {
    title,
    description: plainDesc,
    alternates: {
      canonical: `${siteUrl}/jobs/${jobId}`,
    },
    openGraph: {
      title: `${title} | Find Job`,
      description: plainDesc,
      url: `${siteUrl}/jobs/${jobId}`,
      type: "article",
      images: job.companyLogoUrl
        ? [
            {
              url: job.companyLogoUrl,
              alt: `${job.companyName} logo`,
            },
          ]
        : [
            {
              url: "/images/seo/find-job-og.png",
              width: 1733,
              height: 908,
              alt: title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Find Job`,
      description: plainDesc,
      images: job.companyLogoUrl ? [job.companyLogoUrl] : ["/images/seo/find-job-og.png"],
    },
  };
}

export default async function JobDetailLayout({ children, params }: Props) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  const schema = job
    ? jobPostingSchema({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        companyName: job.companyName,
        salary: {
          min: job.salaryMin,
          max: job.salaryMax,
          currency: "USD",
        },
        publishedAt: job.publishedAt,
        expiresAt: job.expiredAt,
      })
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}
