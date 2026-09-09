import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import localFont from "next/font/local";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const previewImage = {
    url: "/images/seo/find-job-preview.png",
    width: 1200,
    height: 630,
    alt: "Find Job Cambodia career platform preview",
};

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: "Find Job",
    title: {
        default: "Find Job Cambodia | Jobs, Profiles, and AI Interview Practice",
        template: "%s | Find Job",
    },
    description:
        "Find jobs in Cambodia, build your professional profile, and practice interviews with AI-powered tools on Find Job.",
    keywords: ["jobs in Cambodia", "job search Cambodia", "careers", "recruitment", "AI interview", "Find Job", "Phnom Penh jobs"],
    authors: [{ name: "Find Job" }],
    creator: "Find Job",
    publisher: "Find Job",
    category: "Recruitment",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Find Job",
        title: "Find Job Cambodia | Jobs, Profiles, and AI Interview Practice",
        description: "Find jobs in Cambodia, build your professional profile, and practice interviews with AI-powered tools.",
        url: "/",
        images: [previewImage],
    },
    twitter: {
        card: "summary_large_image",
        title: "Find Job Cambodia | Jobs, Profiles, and AI Interview Practice",
        description: "Find jobs in Cambodia, build your professional profile, and practice interviews with AI-powered tools.",
        images: [previewImage.url],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    icons: {
        icon: "/images/brand/favicon-64.png",
        shortcut: "/images/brand/favicon-64.png",
        apple: "/images/brand/apple-icon-180.png",
    },
    
};

const googleSans = localFont({
  src: [
    {
      path: "./font/GoogleSans-VariableFont_GRAD,opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./font/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});
export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={googleSans.variable} suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([organizationSchema, websiteSchema, localBusinessSchema]),
                    }}
                />
            </head>
            <body className="min-h-screen bg-canvas" suppressHydrationWarning>
                <ThemeProvider>
                    <LocaleProvider>
                        <StoreProvider>
                            {children}
                            <Toaster
                                richColors
                                position="top-right"
                                toastOptions={{
                                    classNames: {
                                        success:
                                            "!bg-brand !text-white !border-brand",
                                    },
                                }}
                            />
                        </StoreProvider>
                    </LocaleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
