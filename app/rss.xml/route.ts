import { getTools, getWorkflows, getDotfiles } from "@/lib/mdx";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const runtime = "edge";

async function getRSS() {
  const [tools, workflows, dotfiles] = await Promise.all([
    getTools(),
    getWorkflows(),
    getDotfiles(),
  ]);

  const siteUrl = getSiteUrl();
  const items: string[] = [];

  const addItem = (
    type: string,
    title: string,
    slug: string,
    description: string,
    date: string,
    author?: string
  ) => {
    const url = `${siteUrl}/${type}s/${slug}`;
    items.push(`<item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      <guid>${url}</guid>
      ${author ? `<author>${author}</author>` : ""}
    </item>`);
  };

  tools.forEach((t) => {
    addItem("tool", t.frontmatter.title, t.frontmatter.slug, t.frontmatter.description, t.frontmatter.dateAdded);
  });

  workflows.forEach((w) => {
    addItem("workflow", w.frontmatter.title, w.frontmatter.slug, w.frontmatter.description, w.frontmatter.dateAdded, w.frontmatter.author);
  });

  dotfiles.forEach((d) => {
    addItem("dotfile", d.frontmatter.title, d.frontmatter.slug, d.frontmatter.description, d.frontmatter.dateAdded, d.frontmatter.author);
  });

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join("\n")}
  </channel>
</rss>`;
}

export async function GET() {
  const rss = await getRSS();

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}