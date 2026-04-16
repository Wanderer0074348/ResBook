import type { MetadataRoute } from "next";
import { getAllDotfileSlugs, getAllToolSlugs, getAllWorkflowSlugs } from "@/lib/mdx";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [toolSlugs, workflowSlugs, dotfileSlugs] = await Promise.all([
    getAllToolSlugs(),
    getAllWorkflowSlugs(),
    getAllDotfileSlugs(),
  ]);
  const baseUrl = getSiteUrl();

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/workflows",
    "/dotfiles",
    "/compare",
    "/collections",
    "/search",
    "/resources",
    "/analytics",
    "/submit",
    "/llms.txt",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));

  const toolRoutes: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
  }));

  const workflowRoutes: MetadataRoute.Sitemap = workflowSlugs.map((slug) => ({
    url: `${baseUrl}/workflows/${slug}`,
    lastModified: now,
  }));

  const dotfileRoutes: MetadataRoute.Sitemap = dotfileSlugs.map((slug) => ({
    url: `${baseUrl}/dotfiles/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...toolRoutes, ...workflowRoutes, ...dotfileRoutes];
}
