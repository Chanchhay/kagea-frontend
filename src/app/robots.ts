import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/jobs", "/companies", "/about-us", "/register", "/practice-interview/"],
        disallow: ["/auth/", "/job-seeker/", "/recruiter/", "/*.json$", "/*?*sort"],
      },
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/companies", "/about-us", "/register"],
        disallow: ["/auth/", "/job-seeker/", "/recruiter/", "/practice-interview/", "/*.json$", "/*?*sort"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
