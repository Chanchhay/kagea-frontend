import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
  },
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
