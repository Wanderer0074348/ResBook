"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { WorkflowFrontmatter } from "@/lib/types";

type SortOption = "newest" | "oldest" | "title";

interface WorkflowsExplorerProps {
  workflows: WorkflowFrontmatter[];
}

export function WorkflowsExplorer({ workflows }: WorkflowsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [complexity, setComplexity] = useState<"All" | WorkflowFrontmatter["complexity"]>("All");
  const [toolFilter, setToolFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const availableTools = useMemo(() => {
    const values = new Set<string>();
    for (const workflow of workflows) {
      for (const tool of workflow.toolsUsed) {
        values.add(tool);
      }
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [workflows]);

  const filteredWorkflows = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    const result = workflows.filter((workflow) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        workflow.title.toLowerCase().includes(normalizedQuery) ||
        workflow.description.toLowerCase().includes(normalizedQuery) ||
        workflow.author.toLowerCase().includes(normalizedQuery);

      const matchesComplexity = complexity === "All" || workflow.complexity === complexity;
      const matchesTool = toolFilter === "All" || workflow.toolsUsed.includes(toolFilter);

      return matchesSearch && matchesComplexity && matchesTool;
    });

    return result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      const aTime = new Date(a.dateAdded).getTime();
      const bTime = new Date(b.dateAdded).getTime();

      if (sortBy === "oldest") {
        return aTime - bTime;
      }

      return bTime - aTime;
    });
  }, [workflows, searchTerm, complexity, toolFilter, sortBy]);

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
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="title">Sort: Title A-Z</option>
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
            {filteredWorkflows.map((workflow) => (
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
                  <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">
                    {workflow.complexity}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
