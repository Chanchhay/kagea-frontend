import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Find Job",
    short_name: "Find Job",
    description: "Find jobs in Cambodia, build your professional profile, and practice interviews with AI-powered tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#008A1E",
    icons: [
      { src: "/images/brand/favicon-64.png", sizes: "64x64", type: "image/png" },
      { src: "/images/brand/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  };
}


