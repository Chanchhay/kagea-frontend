import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/jobs", "/companies", "/about-us", "/register", "/practice-interview/"],
        disallow: ["/auth/", "/job-seeker/", "/recruiter/", "/*.json$", "/*?*sort"],
      },
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/companies", "/about-us", "/register", "/practice-interview/"],
        disallow: ["/auth/", "/job-seeker/", "/recruiter/", "/*.json$", "/*?*sort"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
