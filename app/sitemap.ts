import type { MetadataRoute } from "next";
import { getAllToolSlugs, getAllWorkflowSlugs } from "@/lib/mdx";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [toolSlugs, workflowSlugs] = await Promise.all([
    getAllToolSlugs(),
    getAllWorkflowSlugs(),
  ]);
  const baseUrl = getSiteUrl();

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/workflows",
    "/search",
    "/resources",
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

  return [...staticRoutes, ...toolRoutes, ...workflowRoutes];
}
