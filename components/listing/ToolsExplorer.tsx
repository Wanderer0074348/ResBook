"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ToolFrontmatter } from "@/lib/types";
import { filterAndSortTools, type RecommendationFilter, type ToolSortOption } from "@/lib/listingFilters";

interface ToolsExplorerProps {
  tools: ToolFrontmatter[];
}

export function ToolsExplorer({ tools }: ToolsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<"All" | ToolFrontmatter["category"]>("All");
  const [pricing, setPricing] = useState<"All" | ToolFrontmatter["pricing"]>("All");
  const [recommendation, setRecommendation] = useState<RecommendationFilter>("all");
  const [sortBy, setSortBy] = useState<ToolSortOption>("newest");

  const filteredTools = useMemo(
    () =>
      filterAndSortTools(tools, {
        searchTerm,
        category,
        pricing,
        recommendation,
        sortBy,
      }),
    [tools, searchTerm, category, pricing, recommendation, sortBy]
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
            placeholder="Search by tool name or description"
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as ToolSortOption)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="title">Sort: Title A-Z</option>
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as "All" | ToolFrontmatter["category"])}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="All">Category: All</option>
            <option value="LLM">LLM</option>
            <option value="Agent">Agent</option>
            <option value="IDE">IDE</option>
            <option value="CLI">CLI</option>
          </select>

          <select
            value={pricing}
            onChange={(event) => setPricing(event.target.value as "All" | ToolFrontmatter["pricing"])}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="All">Pricing: All</option>
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>

          <select
            value={recommendation}
            onChange={(event) => setRecommendation(event.target.value as RecommendationFilter)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black md:col-span-2"
          >
            <option value="all">Recommendation: All</option>
            <option value="recommended">Recommendation: Recommended only</option>
            <option value="not-recommended">Recommendation: Not recommended only</option>
          </select>
        </div>
      </section>

      <section>
        <p className="mb-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
          {filteredTools.length} result{filteredTools.length === 1 ? "" : "s"}
        </p>

        {filteredTools.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No tools matched these filters.</p>
        ) : (
          <div className="space-y-4">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="block border border-gray-300 p-4 no-underline transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="mb-1 text-base font-bold text-black dark:text-white">{tool.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                      added {new Date(tool.dateAdded).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                    <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">{tool.category}</span>
                    <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">{tool.pricing}</span>
                    <span
                      className={`px-2 py-1 text-xs font-bold ${
                        tool.worthIt
                          ? "border border-black bg-white dark:border-white dark:bg-black"
                          : "border border-gray-400 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {tool.worthIt ? "✓" : "−"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
