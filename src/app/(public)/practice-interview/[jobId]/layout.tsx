import type { Metadata } from "next";

type Props = {
  params: Promise<{ jobId: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return {
    title: "AI Practice Interview | Find Job Cambodia",
    description: "Practice real-time voice and text interviews with AI preparation for Cambodian job opportunities.",
    alternates: {
      canonical: `${siteUrl}/practice-interview/${jobId}`,
    },
    openGraph: {
      title: "AI Practice Interview | Find Job Cambodia",
      description: "Practice real-time voice and text interviews with AI preparation for Cambodian job opportunities.",
      url: `${siteUrl}/practice-interview/${jobId}`,
      type: "website",
      images: [
        {
          url: "/images/seo/find-job-og.png",
          width: 1733,
          height: 908,
          alt: "Find Job Cambodia AI Interview Practice",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Practice Interview | Find Job Cambodia",
      description: "Practice real-time voice and text interviews with AI preparation for Cambodian job opportunities.",
      images: ["/images/seo/find-job-og.png"],
    },
  };
}

export default function PracticeInterviewLayout({ children }: Props) {
  return <>{children}</>;
}
