import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getDotfileBySlug, getAllDotfileSlugs, getDotfiles } from "@/lib/mdx";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { WorkflowStep } from "@/components/mdx/WorkflowStep";
import { PromptBlock } from "@/components/mdx/PromptBlock";
import { ToolLink } from "@/components/mdx/ToolLink";
import { WorkflowGraph } from "@/components/mdx/WorkflowGraph";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { PageNavigation } from "@/components/PageNavigation";
import { AddToStackButton } from "@/components/stack/AddToStackButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { UpdatedBadge } from "@/components/ui/UpdatedBadge";

interface DotfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDotfileSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DotfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const dotfile = await getDotfileBySlug(slug);

  if (!dotfile) {
    return {
      title: "Dotfile Not Found | ResBook",
    };
  }

  const canonicalUrl = getSiteUrl(`/dotfiles/${slug}`);
  const title = `${dotfile.frontmatter.title} | ResBook`;

  return {
    title,
    description: dotfile.frontmatter.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: dotfile.frontmatter.description,
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
      description: dotfile.frontmatter.description,
      images: [siteConfig.defaultOgPath],
    },
  };
}

const components = {
  WorkflowStep,
  PromptBlock,
  ToolLink,
  WorkflowGraph,
};

export default async function DotfilePage({ params }: DotfilePageProps) {
  const { slug } = await params;
  const dotfile = await getDotfileBySlug(slug);

  if (!dotfile) {
    notFound();
  }

  const allDotfiles = await getDotfiles();
  const currentIndex = allDotfiles.findIndex((item) => item.frontmatter.slug === slug);
  const prevDotfile =
    currentIndex > 0
      ? {
          title: allDotfiles[currentIndex - 1].frontmatter.title,
          href: `/dotfiles/${allDotfiles[currentIndex - 1].frontmatter.slug}`,
        }
      : undefined;
  const nextDotfile =
    currentIndex < allDotfiles.length - 1
      ? {
          title: allDotfiles[currentIndex + 1].frontmatter.title,
          href: `/dotfiles/${allDotfiles[currentIndex + 1].frontmatter.slug}`,
        }
      : undefined;

  return (
    <div className="border-l border-gray-300 dark:border-gray-700 min-h-screen">
      <TableOfContents />

      <div className="max-w-3xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <Link href="/dotfiles" className="hover:text-black dark:hover:text-white">
            dotfiles
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">{dotfile.frontmatter.title}</span>
        </div>

        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">{dotfile.frontmatter.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {dotfile.frontmatter.description}
          </p>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <AddToStackButton item={{ type: "dotfile", slug, title: dotfile.frontmatter.title }} />
            <ShareButton title={dotfile.frontmatter.title} />
            <UpdatedBadge dateAdded={dotfile.frontmatter.dateAdded} />
            <span className="text-xs font-bold uppercase bg-gray-100 dark:bg-gray-900 px-3 py-1 border border-gray-300 dark:border-gray-700">
              {dotfile.frontmatter.kind}
            </span>
            <span className="text-sm">
              by <strong>{dotfile.frontmatter.author}</strong>
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Added {dotfile.frontmatter.dateAdded}
            </span>
          </div>

          {dotfile.frontmatter.toolsUsed.length > 0 && (
            <div className="border-t border-gray-300 pt-4 dark:border-gray-700 mt-6">
              <p className="text-xs font-bold uppercase mb-3 text-gray-600 dark:text-gray-400">
                Tools used
              </p>
              <div className="flex flex-wrap gap-2">
                {dotfile.frontmatter.toolsUsed.map((toolSlug) => (
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

        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote source={dotfile.content} components={components} />
        </article>

        <PageNavigation prev={prevDotfile} next={nextDotfile} />
      </div>
    </div>
  );
}
