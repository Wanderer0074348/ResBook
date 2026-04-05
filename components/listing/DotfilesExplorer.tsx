"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DotfileFrontmatter } from "@/lib/types";
import {
  filterAndSortDotfiles,
  getAvailableDotfileTools,
  type DotfileSortOption,
} from "@/lib/listingFilters";

interface DotfilesExplorerProps {
  dotfiles: DotfileFrontmatter[];
}

export function DotfilesExplorer({ dotfiles }: DotfilesExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [kind, setKind] = useState<"All" | DotfileFrontmatter["kind"]>("All");
  const [toolFilter, setToolFilter] = useState("All");
  const [sortBy, setSortBy] = useState<DotfileSortOption>("newest");

  const availableTools = useMemo(() => getAvailableDotfileTools(dotfiles), [dotfiles]);

  const filteredDotfiles = useMemo(
    () =>
      filterAndSortDotfiles(dotfiles, {
        searchTerm,
        kind,
        toolFilter,
        sortBy,
      }),
    [dotfiles, searchTerm, kind, toolFilter, sortBy]
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
            placeholder="Search by title, author, or description"
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as DotfileSortOption)}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="title">Sort: Title A-Z</option>
          </select>

          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as "All" | DotfileFrontmatter["kind"])}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="All">Kind: All</option>
            <option value="Prompt Pack">Prompt Pack</option>
            <option value="Config">Config</option>
            <option value="Template">Template</option>
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
          {filteredDotfiles.length} result{filteredDotfiles.length === 1 ? "" : "s"}
        </p>

        {filteredDotfiles.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No dotfiles matched these filters.</p>
        ) : (
          <div className="space-y-4">
            {filteredDotfiles.map((dotfile) => (
              <Link
                key={dotfile.slug}
                href={`/dotfiles/${dotfile.slug}`}
                className="block border border-gray-300 p-4 no-underline transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="mb-1 text-base font-bold text-black dark:text-white">{dotfile.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dotfile.description}</p>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                      by <span className="font-bold">{dotfile.author}</span> • added{" "}
                      {new Date(dotfile.dateAdded).toLocaleDateString()}
                    </p>
                    {dotfile.toolsUsed.length > 0 && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                        tools: {dotfile.toolsUsed.join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">
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
