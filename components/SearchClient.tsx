"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DotfileFrontmatter, ToolFrontmatter, WorkflowFrontmatter } from "@/lib/types";
import { getWorkflowReadiness } from "@/lib/workflowReadiness";
import { ReadinessBadge } from "@/components/workflows/ReadinessBadge";

interface SearchClientProps {
  initialTools: ToolFrontmatter[];
  initialWorkflows: WorkflowFrontmatter[];
  initialDotfiles: DotfileFrontmatter[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchClient({ initialTools, initialWorkflows, initialDotfiles }: SearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setIsSearching(searchTerm !== debouncedTerm);
  }, [searchTerm, debouncedTerm]);

  const filteredTools = useMemo(
    () =>
      initialTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(debouncedTerm.toLowerCase())
      ),
    [initialTools, debouncedTerm]
  );

  const filteredWorkflows = useMemo(
    () =>
      initialWorkflows.filter(
        (workflow) =>
          workflow.title.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          workflow.description.toLowerCase().includes(debouncedTerm.toLowerCase())
      ),
    [initialWorkflows, debouncedTerm]
  );

  const filteredDotfiles = useMemo(
    () =>
      initialDotfiles.filter(
        (dotfile) =>
          dotfile.title.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          dotfile.description.toLowerCase().includes(debouncedTerm.toLowerCase())
      ),
    [initialDotfiles, debouncedTerm]
  );

  return (
    <>
      {/* Search Bar */}
      <section className="mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="search tools, workflows & dotfiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-black bg-white p-3 font-mono text-sm placeholder-gray-500 focus:outline-none dark:border-white dark:bg-black"
            aria-label="Search tools, workflows, and dotfiles"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              searching...
            </span>
          )}
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="mb-12">
        <h2 className="mb-6 border-b border-black pb-3 text-2xl font-bold dark:border-white">
          tools ({filteredTools.length})
        </h2>
        {filteredTools.length === 0 ? (
          <p className="text-gray-500">no tools found</p>
        ) : (
          <div className="space-y-3">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="block border border-black p-4 hover:bg-gray-100 dark:border-white dark:hover:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold">{tool.title}</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {tool.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-right text-xs">
                    <span className="border border-black px-2 py-1 dark:border-white">
                      {tool.category}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{tool.pricing}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Workflows Section */}
      <section id="workflows" className="mb-12">
        <h2 className="mb-6 border-b border-black pb-3 text-2xl font-bold dark:border-white">
          workflows ({filteredWorkflows.length})
        </h2>
        {filteredWorkflows.length === 0 ? (
          <p className="text-gray-500">no workflows found</p>
        ) : (
          <div className="space-y-3">
            {filteredWorkflows.map((workflow) => {
              const readiness = getWorkflowReadiness(workflow);

              return (
                <Link
                  key={workflow.slug}
                  href={`/workflows/${workflow.slug}`}
                  className="block border border-black p-4 hover:bg-gray-100 dark:border-white dark:hover:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold">{workflow.title}</h3>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {workflow.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        by {workflow.author}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="border border-black px-2 py-1 text-xs dark:border-white">
                        {workflow.complexity}
                      </span>
                      <ReadinessBadge score={readiness.score} tier={readiness.tier} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Dotfiles Section */}
      <section id="dotfiles" className="mb-12">
        <h2 className="mb-6 border-b border-black pb-3 text-2xl font-bold dark:border-white">
          dotfiles ({filteredDotfiles.length})
        </h2>
        {filteredDotfiles.length === 0 ? (
          <p className="text-gray-500">no dotfiles found</p>
        ) : (
          <div className="space-y-3">
            {filteredDotfiles.map((dotfile) => (
              <Link
                key={dotfile.slug}
                href={`/dotfiles/${dotfile.slug}`}
                className="block border border-black p-4 hover:bg-gray-100 dark:border-white dark:hover:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold">{dotfile.title}</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {dotfile.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      by {dotfile.author}
                    </p>
                  </div>
                  <span className="border border-black px-2 py-1 text-xs dark:border-white">
                    {dotfile.kind}
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
