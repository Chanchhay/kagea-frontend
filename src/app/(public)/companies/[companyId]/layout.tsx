import type { Metadata } from "next";

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
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

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
          url: "/images/seo/find-job-og.png",
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
      images: ["/images/seo/find-job-og.png"],
    },
  };
}

export default function CompanyLayout({ children }: Props) {
  return <>{children}</>;
}
