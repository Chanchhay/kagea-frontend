import type { Metadata } from "next";
import { absoluteSiteUrl, siteUrl } from "@/lib/site-url";

const previewImage = {
  url: absoluteSiteUrl("/images/seo/find-job-preview.png"),
  width: 1200,
  height: 630,
  alt: "Find Job Cambodia career platform preview",
};

export const metadata: Metadata = {
  title: {
    absolute: "Find Job Cambodia | Jobs, Profiles, and AI Interview Practice",
  },
  description:
    "Search Cambodian job openings, build a career profile, and practice interviews with AI-powered preparation tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Find Job Cambodia | Jobs, Profiles, and AI Interview Practice",
    description:
      "Search Cambodian job openings, build a career profile, and practice interviews with AI-powered preparation tools.",
    url: siteUrl,
    type: "website",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Job Cambodia",
    description: "Search jobs in Cambodia and practice interviews with AI-powered tools.",
    images: [previewImage.url],
  },
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
