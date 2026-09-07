import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  },
};

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
