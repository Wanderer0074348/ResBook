import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getWorkflowBySlug, getAllWorkflowSlugs, getWorkflows } from "@/lib/mdx";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { Verdict } from "@/components/mdx/Verdict";
import { WorkflowStep } from "@/components/mdx/WorkflowStep";
import { PromptBlock } from "@/components/mdx/PromptBlock";
import { ToolLink } from "@/components/mdx/ToolLink";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { PageNavigation } from "@/components/PageNavigation";

interface WorkflowPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllWorkflowSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkflowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    return {
      title: "Workflow Not Found | ResBook",
    };
  }

  const canonicalUrl = getSiteUrl(`/workflows/${slug}`);
  const title = `${workflow.frontmatter.title} | ResBook`;

  return {
    title,
    description: workflow.frontmatter.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: workflow.frontmatter.description,
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
      description: workflow.frontmatter.description,
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

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    notFound();
  }

  // Get all workflows for navigation
  const allWorkflows = await getWorkflows();
  const currentIndex = allWorkflows.findIndex((w) => w.frontmatter.slug === slug);
  const prevWorkflow =
    currentIndex > 0
      ? { title: allWorkflows[currentIndex - 1].frontmatter.title, href: `/workflows/${allWorkflows[currentIndex - 1].frontmatter.slug}` }
      : undefined;
  const nextWorkflow =
    currentIndex < allWorkflows.length - 1
      ? { title: allWorkflows[currentIndex + 1].frontmatter.title, href: `/workflows/${allWorkflows[currentIndex + 1].frontmatter.slug}` }
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
          <Link href="/workflows" className="hover:text-black dark:hover:text-white">
            workflows
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">{workflow.frontmatter.title}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">{workflow.frontmatter.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {workflow.frontmatter.description}
          </p>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-xs font-bold uppercase bg-gray-100 dark:bg-gray-900 px-3 py-1 border border-gray-300 dark:border-gray-700">
              {workflow.frontmatter.complexity}
            </span>
            <span className="text-sm">
              by <strong>{workflow.frontmatter.author}</strong>
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Added {new Date(workflow.frontmatter.dateAdded).toLocaleDateString()}
            </span>
          </div>

          {/* Tools Used */}
          {workflow.frontmatter.toolsUsed.length > 0 && (
            <div className="border-t border-gray-300 pt-4 dark:border-gray-700 mt-6">
              <p className="text-xs font-bold uppercase mb-3 text-gray-600 dark:text-gray-400">
                Tools used
              </p>
              <div className="flex flex-wrap gap-2">
                {workflow.frontmatter.toolsUsed.map((toolSlug) => (
                  <Link
                    key={toolSlug}
                    href={`/tools/${toolSlug}`}
                    className="text-xs border border-gray-300 px-3 py-1 bg-gray-50 dark:bg-gray-950 dark:border-gray-700"
                  >
                    {toolSlug}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote source={workflow.content} components={components} />
        </article>

        {/* Page Navigation */}
        <PageNavigation prev={prevWorkflow} next={nextWorkflow} />
      </div>
    </div>
  );
}
