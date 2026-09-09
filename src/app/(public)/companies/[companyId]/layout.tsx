import type { Metadata } from "next";
import { absoluteSiteUrl, siteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ companyId: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companyId: string }>;
}): Promise<Metadata> {
  const { companyId } = await params;

  return {
    title: "Company Jobs & Opportunities | Find Job Cambodia",
    description: "Explore job vacancies, company profiles, and career opportunities on Find Job Cambodia.",
    alternates: {
      canonical: `${siteUrl}/companies/${companyId}`,
    },
    openGraph: {
      title: "Company Jobs & Opportunities | Find Job Cambodia",
      description: "Explore job vacancies, company profiles, and career opportunities on Find Job Cambodia.",
      url: `${siteUrl}/companies/${companyId}`,
      type: "website",
      images: [
        {
          url: absoluteSiteUrl("/images/seo/find-job-og.png"),
          width: 1733,
          height: 908,
          alt: "Find Job Cambodia company profile",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Company Jobs & Opportunities | Find Job Cambodia",
      description: "Explore job vacancies, company profiles, and career opportunities on Find Job Cambodia.",
      images: [absoluteSiteUrl("/images/seo/find-job-og.png")],
    },
  };
}

export default function CompanyLayout({ children }: Props) {
  return <>{children}</>;
}
