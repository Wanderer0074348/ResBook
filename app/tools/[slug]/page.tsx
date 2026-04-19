import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getToolBySlug, getAllToolSlugs, getTools } from "@/lib/mdx";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { Verdict } from "@/components/mdx/Verdict";
import { WorkflowStep } from "@/components/mdx/WorkflowStep";
import { PromptBlock } from "@/components/mdx/PromptBlock";
import { ToolLink } from "@/components/mdx/ToolLink";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { PageNavigation } from "@/components/PageNavigation";
import { AddToStackButton } from "@/components/stack/AddToStackButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { UpdatedBadge } from "@/components/ui/UpdatedBadge";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found | ResBook",
    };
  }

  const canonicalUrl = getSiteUrl(`/tools/${slug}`);
  const title = `${tool.frontmatter.title} | ResBook`;

  return {
    title,
    description: tool.frontmatter.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: tool.frontmatter.description,
      url: canonicalUrl,
      type: "article",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.defaultOgPath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: tool.frontmatter.description,
      images: [siteConfig.defaultOgPath],
    },
  };
}

const components = {
  Verdict,
  WorkflowStep,
  PromptBlock,
  ToolLink,
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Get all tools for navigation
  const allTools = await getTools();
  const currentIndex = allTools.findIndex((t) => t.frontmatter.slug === slug);
  const prevTool =
    currentIndex > 0
      ? { title: allTools[currentIndex - 1].frontmatter.title, href: `/tools/${allTools[currentIndex - 1].frontmatter.slug}` }
      : undefined;
  const nextTool =
    currentIndex < allTools.length - 1
      ? { title: allTools[currentIndex + 1].frontmatter.title, href: `/tools/${allTools[currentIndex + 1].frontmatter.slug}` }
      : undefined;

  return (
    <div className="border-l border-gray-300 dark:border-gray-700 min-h-screen">
      <TableOfContents />

      <div className="max-w-3xl px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-black dark:hover:text-white">
            tools
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">{tool.frontmatter.title}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">{tool.frontmatter.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {tool.frontmatter.description}
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <AddToStackButton item={{ type: "tool", slug, title: tool.frontmatter.title }} />
            <ShareButton title={tool.frontmatter.title} />
            <UpdatedBadge dateAdded={tool.frontmatter.dateAdded} />
            <span className="text-xs font-bold uppercase bg-gray-100 dark:bg-gray-900 px-3 py-1 border border-gray-300 dark:border-gray-700">
              {tool.frontmatter.category}
            </span>
            <span className="text-xs font-bold uppercase bg-gray-100 dark:bg-gray-900 px-3 py-1 border border-gray-300 dark:border-gray-700">
              {tool.frontmatter.pricing}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Added {tool.frontmatter.dateAdded}
            </span>
          </div>
        </div>

        {/* Verdict Component */}
        <Verdict
          isWorthIt={tool.frontmatter.worthIt}
          cost={tool.frontmatter.pricing === "Free" ? "Free" : "Paid"}
        />

        {/* Content */}
        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote source={tool.content} components={components} />
        </article>

        {/* Page Navigation */}
        <PageNavigation prev={prevTool} next={nextTool} />
      </div>
    </div>
  );
}
