"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { WorkflowFrontmatter } from "@/lib/types";
import {
  filterAndSortWorkflows,
  getAvailableWorkflowTools,
  type WorkflowReadinessFilter,
  type WorkflowSortOption,
} from "@/lib/listingFilters";
import { ReadinessBadge } from "@/components/workflows/ReadinessBadge";
import { getWorkflowReadiness } from "@/lib/workflowReadiness";

interface WorkflowsExplorerProps {
  workflows: WorkflowFrontmatter[];
}

export function WorkflowsExplorer({ workflows }: WorkflowsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [complexity, setComplexity] = useState<"All" | WorkflowFrontmatter["complexity"]>("All");
  const [toolFilter, setToolFilter] = useState("All");
  const [readiness, setReadiness] = useState<WorkflowReadinessFilter>("All");
  const [sortBy, setSortBy] = useState<WorkflowSortOption>("newest");

  const availableTools = useMemo(() => getAvailableWorkflowTools(workflows), [workflows]);

  const filteredWorkflows = useMemo(
    () =>
      filterAndSortWorkflows(workflows, {
        searchTerm,
        complexity,
        toolFilter,
        readiness,
        sortBy,
      }),
    [workflows, searchTerm, complexity, toolFilter, readiness, sortBy]
  );

  return (
    <>
      <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
        <p className="mb-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Filter & Sort</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by workflow, author, or description"
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as WorkflowSortOption)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="title">Sort: Title A-Z</option>
            <option value="readiness">Sort: Readiness high-low</option>
          </select>

          <select
            value={complexity}
            onChange={(event) => setComplexity(event.target.value as "All" | WorkflowFrontmatter["complexity"])}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="All">Complexity: All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={toolFilter}
            onChange={(event) => setToolFilter(event.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="All">Tool: All</option>
            {availableTools.map((toolSlug) => (
              <option key={toolSlug} value={toolSlug}>
                {toolSlug}
              </option>
            ))}
          </select>

          <select
            value={readiness}
            onChange={(event) => setReadiness(event.target.value as WorkflowReadinessFilter)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black md:col-span-2"
          >
            <option value="All">Readiness: All tiers</option>
            <option value="High">Readiness: High</option>
            <option value="Medium">Readiness: Medium</option>
            <option value="Low">Readiness: Low</option>
          </select>
        </div>
      </section>

      <section>
        <p className="mb-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
          {filteredWorkflows.length} result{filteredWorkflows.length === 1 ? "" : "s"}
        </p>

        {filteredWorkflows.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No workflows matched these filters.</p>
        ) : (
          <div className="space-y-4">
            {filteredWorkflows.map((workflow) => {
              const readinessResult = getWorkflowReadiness(workflow);

              return (
                <Link
                  key={workflow.slug}
                  href={`/workflows/${workflow.slug}`}
                  className="block border border-gray-300 p-4 no-underline transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="mb-1 text-base font-bold text-black dark:text-white">{workflow.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{workflow.description}</p>
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                        by <span className="font-bold">{workflow.author}</span> • added{" "}
                        {new Date(workflow.dateAdded).toLocaleDateString()}
                      </p>
                      {workflow.toolsUsed.length > 0 && (
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                          tools: {workflow.toolsUsed.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">
                        {workflow.complexity}
                      </span>
                      <ReadinessBadge score={readinessResult.score} tier={readinessResult.tier} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
