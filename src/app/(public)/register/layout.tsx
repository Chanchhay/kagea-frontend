import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const previewImage = {
  url: "/images/seo/find-job-preview.png",
  width: 1200,
  height: 630,
  alt: "Find Job account signup preview",
};

export const metadata: Metadata = {
  title: "Create Your Account | Find Job",
  description: "Sign up for Find Job to access job listings, build your professional profile, and practice AI-powered interviews for free.",
  keywords: ["sign up", "create account", "job seeker registration", "find jobs"],
  alternates: {
    canonical: `${siteUrl}/register`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Create Your Account | Find Job",
    description: "Join thousands of job seekers on Find Job. Create your free account to start browsing jobs and preparing for interviews.",
    url: `${siteUrl}/register`,
    type: "website",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Your Account | Find Job",
    description: "Create your free Find Job account to browse jobs and prepare for interviews.",
    images: [previewImage.url],
  },
};

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
