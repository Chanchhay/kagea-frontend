import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: "Find Job",
    title: {
        default: "Find Job | Discover Your Next Career Opportunity",
        template: "%s | Find Job",
    },
    description:
        "Discover jobs, build your professional profile, and prepare for interviews with Find Job.",
    keywords: ["jobs", "job search", "careers", "recruitment", "AI interview", "Find Job", "Cambodia"],
    authors: [{ name: "Find Job" }],
    creator: "Find Job",
    publisher: "Find Job",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: siteUrl,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Find Job",
        title: "Find Job | Discover Your Next Career Opportunity",
        description: "Discover jobs, build your professional profile, and prepare for interviews with Find Job.",
        url: siteUrl,
        images: [{ url: "/images/seo/find-job-og.png", width: 1200, height: 630, alt: "Find Job career platform" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Find Job | Discover Your Next Career Opportunity",
        description: "Discover jobs, build your professional profile, and prepare for interviews with Find Job.",
        images: ["/images/hero-ai-robot-v3.webp"],
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

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
            </head>
            <body className="min-h-screen bg-canvas" suppressHydrationWarning>
                <ThemeProvider>
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
                </ThemeProvider>
            </body>
        </html>
    );
}
