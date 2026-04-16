import { Metadata } from "next";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(getSiteUrl()),
  keywords: [
    "AI tools",
    "AI workflows",
    "developer tools",
    "LLM",
    "AI assistant",
    "productivity",
    "automation",
  ],
  authors: [
    {
      name: "Manavarya09",
      url: "https://github.com/Manavarya09",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default metadata;
