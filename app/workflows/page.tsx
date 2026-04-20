import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getWorkflows } from "@/lib/mdx";
import { WorkflowsExplorer } from "@/components/listing/WorkflowsExplorer";
import { extractWorkflowContentSummary } from "@/lib/workflowSummaries";

export const metadata: Metadata = {
  title: "Workflows | ResBook",
  description: "Browse practical, agentic workflows from the ResBook community.",
};

export default async function WorkflowsPage() {
  const workflowsData = await getWorkflows();
  const workflows = workflowsData.map((workflow) => {
    const summary = extractWorkflowContentSummary(workflow.content);

    return {
      ...workflow.frontmatter,
      bestFor: summary.bestFor,
      expectedOutput: summary.expectedOutput,
      stepCount: summary.stepCount,
      promptCount: summary.promptCount,
    };
  });

  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-3xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">workflows</span>
        </div>

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Workflows</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Reproducible blueprints for shipping faster with AI tools.
          </p>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="max-w-3xl px-8 py-12">
          <p className="text-gray-600 dark:text-gray-400">No workflows published yet.</p>
        </div>
      ) : (
        <div className="px-8 py-12">
          <Suspense fallback={<p className="text-gray-500">Loading workflows...</p>}>
            <WorkflowsExplorer workflows={workflows} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
