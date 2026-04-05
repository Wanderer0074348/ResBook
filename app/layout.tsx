import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ResBook | AI Tools & Workflows Directory",
    template: "%s",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ResBook | AI Tools & Workflows Directory",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgPath,
        width: 1200,
        height: 630,
        alt: "ResBook - AI Tools & Workflows Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResBook | AI Tools & Workflows Directory",
    description: siteConfig.description,
    images: [siteConfig.defaultOgPath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetBrainsMono.variable} h-full`}>
      <body className="min-h-full bg-white text-black font-mono antialiased dark:bg-black dark:text-white">
        <Sidebar />
        <main className="min-h-screen pt-14 md:ml-64 md:pt-0">{children}</main>
      </body>
    </html>
  );
}
