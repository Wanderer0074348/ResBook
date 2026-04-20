"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { PageNavigation } from "@/components/PageNavigation";
import { ReadinessBadge } from "@/components/workflows/ReadinessBadge";
import { ReadinessPanel } from "@/components/workflows/ReadinessPanel";
import { WorkflowRunnerProvider, WorkflowProgressBar } from "@/components/workflows/WorkflowRunner";
import { ShareButton } from "@/components/ui/ShareButton";
import { UpdatedBadge } from "@/components/ui/UpdatedBadge";
import type { WorkflowContent, ToolFrontmatter } from "@/lib/types";
import { getWorkflowReadiness } from "@/lib/workflowReadiness";

interface WorkflowTool {
  slug: string;
  title: string;
  category?: string;
  pricing?: string;
}

interface WorkflowClientContentProps {
  workflow: WorkflowContent;
  workflowTools: WorkflowTool[];
  prevWorkflow?: { title: string; href: string };
  nextWorkflow?: { title: string; href: string };
  toolLinks: Map<string, string>;
  relatedWorkflows?: { title: string; href: string }[];
}

export function WorkflowClientContent({
  workflow,
  workflowTools,
  prevWorkflow,
  nextWorkflow,
  toolLinks,
  relatedWorkflows = [],
}: WorkflowClientContentProps) {
  const [isRunnerMode, setIsRunnerMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [addedToStack, setAddedToStack] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const readiness = getWorkflowReadiness(workflow.frontmatter);
  const stepCount = (workflow.content.match(/<WorkflowStep\b/g) ?? []).length;
  const promptCount = (workflow.content.match(/<PromptBlock\b/g) ?? []).length;
  const prerequisiteCount = workflow.frontmatter.prerequisites?.length ?? 0;
  const failurePointCount = workflow.frontmatter.failurePoints?.length ?? 0;
  const visibleFlowNodes = Math.min(stepCount, 12);

  const handleAddToStack = () => {
    if (!isClient) return;
    
    const item = {
      type: "workflow" as const,
      slug: workflow.frontmatter.slug,
      title: workflow.frontmatter.title,
    };

    const stored = localStorage.getItem("resbook-personal-stack");
    let stack: Array<{ type: string; slug: string; title: string }> = [];
    if (stored) {
      try {
        stack = JSON.parse(stored);
      } catch {
        stack = [];
      }
    }

    const exists = stack.some((s) => s.type === "workflow" && s.slug === item.slug);
    if (!exists) {
      stack.push(item);
      localStorage.setItem("resbook-personal-stack", JSON.stringify(stack));
      setAddedToStack(true);
      setTimeout(() => setAddedToStack(false), 2000);
    }
  };

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
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-5xl font-bold">{workflow.frontmatter.title}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunnerMode(!isRunnerMode)}
                className={`px-3 py-2 text-xs font-medium border transition-colors ${
                  isRunnerMode
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                }`}
              >
                {isRunnerMode ? "✅ Runner Mode" : "▶️ Run Workflow"}
              </button>
              <button
                onClick={handleAddToStack}
                className="px-3 py-2 text-xs font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                {addedToStack ? "✓ Added" : "+ Add to Stack"}
              </button>
              <ShareButton title={workflow.frontmatter.title} />
            </div>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {workflow.frontmatter.description}
          </p>

          <div className="flex flex-wrap gap-3 items-center mb-4">
            <UpdatedBadge dateAdded={workflow.frontmatter.dateAdded} />
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

          {/* Runner Mode Progress Bar */}
          {isRunnerMode && stepCount > 0 && isClient && (
            <WorkflowRunnerProvider slug={workflow.frontmatter.slug} totalSteps={stepCount}>
              <WorkflowProgressBar />
            </WorkflowRunnerProvider>
          )}

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

          {relatedWorkflows.length > 0 && (
            <div className="mt-8 border-t border-gray-300 pt-6 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Related Workflows</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {relatedWorkflows.map((related) => (
                  <Link
                    key={related.href}
                    href={related.href}
                    className="border border-gray-300 p-3 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <span className="font-medium">{related.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <article className="prose dark:prose-invert max-w-none">
          {isRunnerMode && stepCount > 0 && isClient ? (
            <WorkflowRunnerProvider slug={workflow.frontmatter.slug} totalSteps={stepCount}>
              {children}
            </WorkflowRunnerProvider>
          ) : (
            children
          )}
        </article>

        {/* Page Navigation */}
        <PageNavigation prev={prevWorkflow} next={nextWorkflow} />
      </div>
    </div>
  );
}
