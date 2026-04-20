import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getWorkflowBySlug, getAllWorkflowSlugs, getWorkflows, getTools } from "@/lib/mdx";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { WorkflowClientContent } from "@/components/workflows/WorkflowClientContent";
import { Verdict } from "@/components/mdx/Verdict";
import { WorkflowStep } from "@/components/mdx/WorkflowStep";
import { PromptBlock } from "@/components/mdx/PromptBlock";
import { WorkflowGraph } from "@/components/mdx/WorkflowGraph";
import { ToolLink } from "@/components/mdx/ToolLink";

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

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    notFound();
  }

  const [allWorkflows, allTools] = await Promise.all([getWorkflows(), getTools()]);
  const toolMetadataMap = new Map(allTools.map((tool) => [tool.frontmatter.slug, tool.frontmatter]));
  const toolLinksMap = new Map(allTools.map((tool) => [tool.frontmatter.slug, tool.frontmatter.title]));

  const workflowTools = workflow.frontmatter.toolsUsed.map((toolSlug) => {
    const metadata = toolMetadataMap.get(toolSlug);
    return {
      slug: toolSlug,
      title: metadata?.title ?? toolSlug,
      category: metadata?.category,
      pricing: metadata?.pricing,
    };
  });

  const currentIndex = allWorkflows.findIndex((w) => w.frontmatter.slug === slug);
  const prevWorkflow =
    currentIndex > 0
      ? { title: allWorkflows[currentIndex - 1].frontmatter.title, href: `/workflows/${allWorkflows[currentIndex - 1].frontmatter.slug}` }
      : undefined;
  const nextWorkflow =
    currentIndex < allWorkflows.length - 1
      ? { title: allWorkflows[currentIndex + 1].frontmatter.title, href: `/workflows/${allWorkflows[currentIndex + 1].frontmatter.slug}` }
      : undefined;

  const currentTools = workflow.frontmatter.toolsUsed || [];
  const relatedWorkflows = allWorkflows
    .filter((w) => w.frontmatter.slug !== slug)
    .map((w) => {
      const wTools = w.frontmatter.toolsUsed || [];
      const toolOverlap = wTools.filter((t) => currentTools.includes(t)).length;
      const sameAuthor = w.frontmatter.author === workflow.frontmatter.author;
      const score = toolOverlap * 2 + (sameAuthor ? 3 : 0);
      return { ...w.frontmatter, score };
    })
    .filter((w) => w.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((w) => ({ title: w.title, href: `/workflows/${w.slug}` }));

  return (
    <WorkflowClientContent
      workflow={workflow}
      workflowTools={workflowTools}
      prevWorkflow={prevWorkflow}
      nextWorkflow={nextWorkflow}
      relatedWorkflows={relatedWorkflows}
    />
  );
}
