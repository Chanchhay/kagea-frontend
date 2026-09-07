import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Find Job Cambodia | Jobs, Profiles, and AI Interview Practice",
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
    images: [
      {
        url: "/images/seo/find-job-preview.png",
        width: 1200,
        height: 630,
        alt: "Find Job Cambodia career platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Job Cambodia",
    description: "Search jobs in Cambodia and practice interviews with AI-powered tools.",
    images: ["/images/seo/find-job-preview.png"],
  },
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
