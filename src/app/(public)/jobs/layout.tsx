import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Find Jobs in Cambodia | Browse Job Listings",
  description: "Search and browse thousands of job openings in Cambodia. Filter by location, industry, and experience level. Find your next career opportunity on Find Job.",
  keywords: ["job listings", "job search Cambodia", "career opportunities", "hiring", "job board", "employment"],
  alternates: {
    canonical: `${siteUrl}/jobs`,
  },
  openGraph: {
    title: "Find Jobs in Cambodia | Browse Job Listings",
    description: "Search and browse thousands of job openings in Cambodia. Filter by location, industry, and experience level.",
    url: `${siteUrl}/jobs`,
    type: "website",
    images: [{ url: "/images/hero-ai-robot-v3.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Jobs in Cambodia",
    description: "Search thousands of job openings in Cambodia",
  },
};

export default function JobsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
