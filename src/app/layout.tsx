import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { inter, notoSansKhmer } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Career Platform",
    description:
        "Public jobs, job seeker workspace, and recruiter hiring tools for the AI Career Platform.",
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
        <html
            lang="en"
            className={`${inter.variable} ${notoSansKhmer.variable}`}
            suppressHydrationWarning
        >
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
