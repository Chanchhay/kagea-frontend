import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Find Job",
  description: "Sign in to your Find Job account to access job listings and manage your applications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
