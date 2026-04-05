import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getWorkflowBySlug, getAllWorkflowSlugs, getWorkflows, getTools } from "@/lib/mdx";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { Verdict } from "@/components/mdx/Verdict";
import { WorkflowStep } from "@/components/mdx/WorkflowStep";
import { PromptBlock } from "@/components/mdx/PromptBlock";
import { ToolLink } from "@/components/mdx/ToolLink";
import { WorkflowGraph } from "@/components/mdx/WorkflowGraph";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { PageNavigation } from "@/components/PageNavigation";
import { getWorkflowReadiness } from "@/lib/workflowReadiness";
import { ReadinessBadge } from "@/components/workflows/ReadinessBadge";
import { ReadinessPanel } from "@/components/workflows/ReadinessPanel";

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
  WorkflowGraph,
};

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    notFound();
  }

  const readiness = getWorkflowReadiness(workflow.frontmatter);

  // Get all workflows for navigation and tool metadata for richer tool cards.
  const [allWorkflows, allTools] = await Promise.all([getWorkflows(), getTools()]);

  const toolMetadata = new Map(allTools.map((tool) => [tool.frontmatter.slug, tool.frontmatter]));
  const workflowTools = workflow.frontmatter.toolsUsed.map((toolSlug) => {
    const metadata = toolMetadata.get(toolSlug);

    return {
      slug: toolSlug,
      title: metadata?.title ?? toolSlug,
      category: metadata?.category,
      pricing: metadata?.pricing,
    };
  });

  const stepCount = (workflow.content.match(/<WorkflowStep\b/g) ?? []).length;
  const promptCount = (workflow.content.match(/<PromptBlock\b/g) ?? []).length;
  const prerequisiteCount = workflow.frontmatter.prerequisites?.length ?? 0;
  const failurePointCount = workflow.frontmatter.failurePoints?.length ?? 0;
  const visibleFlowNodes = Math.min(stepCount, 12);

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
            <ReadinessBadge score={readiness.score} tier={readiness.tier} />
            <span className="text-sm">
              by <strong>{workflow.frontmatter.author}</strong>
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Added {workflow.frontmatter.dateAdded}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-gray-300 p-3 dark:border-gray-700">
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Estimated time</p>
              <p className="mt-2 text-xl font-bold">{Math.round(readiness.inputs.estimatedHours)}h</p>
            </div>
            <div className="border border-gray-300 p-3 dark:border-gray-700">
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Workflow steps</p>
              <p className="mt-2 text-xl font-bold">{stepCount}</p>
            </div>
            <div className="border border-gray-300 p-3 dark:border-gray-700">
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Prompt blocks</p>
              <p className="mt-2 text-xl font-bold">{promptCount}</p>
            </div>
            <div className="border border-gray-300 p-3 dark:border-gray-700">
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Known risks</p>
              <p className="mt-2 text-xl font-bold">{failurePointCount}</p>
            </div>
          </div>

          <div className="mt-4 border border-gray-300 p-4 dark:border-gray-700">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Execution flow</p>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {stepCount} step{stepCount === 1 ? "" : "s"} · {prerequisiteCount} prerequisite{prerequisiteCount === 1 ? "" : "s"}
              </span>
            </div>
            {stepCount === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">No workflow steps were detected in this write-up yet.</p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: visibleFlowNodes }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-400 text-xs font-bold dark:border-gray-600">
                      {index + 1}
                    </span>
                    {index < visibleFlowNodes - 1 && (
                      <span className="h-px w-6 bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
                    )}
                  </div>
                ))}
                {stepCount > visibleFlowNodes && (
                  <span className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    +{stepCount - visibleFlowNodes} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tools Used */}
          {workflowTools.length > 0 && (
            <div className="border-t border-gray-300 pt-4 dark:border-gray-700 mt-6">
              <p className="text-xs font-bold uppercase mb-3 text-gray-600 dark:text-gray-400">
                Tools used
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {workflowTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="border border-gray-300 bg-gray-50 p-3 transition-colors hover:bg-white dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900"
                  >
                    <p className="text-sm font-semibold leading-tight">{tool.title}</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">/{tool.slug}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tool.category && (
                        <span className="border border-gray-300 px-2 py-1 text-[11px] uppercase dark:border-gray-700">
                          {tool.category}
                        </span>
                      )}
                      {tool.pricing && (
                        <span className="border border-gray-300 px-2 py-1 text-[11px] uppercase dark:border-gray-700">
                          {tool.pricing}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ReadinessPanel workflow={workflow.frontmatter} readiness={readiness} />
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
