import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const previewImage = {
  url: "/images/seo/find-job-preview.png",
  width: 1200,
  height: 630,
  alt: "Find Job Cambodia platform preview",
};

export const metadata: Metadata = {
  title: "About Find Job | Job Search Platform for Cambodia",
  description: "Discover Find Job's mission to connect job seekers with career opportunities and empower employers in Cambodia. Learn about our AI-powered interview platform.",
  keywords: ["about Find Job", "job search platform", "recruitment Cambodia", "career platform", "AI interview"],
  alternates: {
    canonical: `${siteUrl}/about-us`,
  },
  openGraph: {
    title: "About Find Job | Job Search Platform for Cambodia",
    description: "Discover Find Job's mission and how we're transforming recruitment in Cambodia with AI-powered tools.",
    url: `${siteUrl}/about-us`,
    type: "website",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Find Job",
    description: "Learn about our mission to revolutionize job search in Cambodia",
    images: [previewImage.url],
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
