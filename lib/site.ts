const DEFAULT_SITE_URL = "https://resbook.vercel.app";

export function getSiteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  if (!path) {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteConfig = {
  name: "ResBook",
  description: "A markdown-driven directory for AI tools, agentic workflows, and developer tips.",
  defaultOgPath: "/opengraph-image",
};
