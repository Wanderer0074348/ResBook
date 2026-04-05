"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DotfileFrontmatter } from "@/lib/types";

type HomeDotfileSortOption = "newest" | "oldest" | "title" | "kind";

interface HomeDotfilesBlockProps {
  dotfiles: DotfileFrontmatter[];
}

function safeTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function HomeDotfilesBlock({ dotfiles }: HomeDotfilesBlockProps) {
  const [sortBy, setSortBy] = useState<HomeDotfileSortOption>("newest");

  const sortedDotfiles = useMemo(() => {
    return [...dotfiles].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "kind") {
        const kindOrder = a.kind.localeCompare(b.kind);
        if (kindOrder !== 0) {
          return kindOrder;
        }
        return b.title.localeCompare(a.title);
      }

      const aTime = safeTimestamp(a.dateAdded);
      const bTime = safeTimestamp(b.dateAdded);

      if (sortBy === "oldest") {
        return aTime - bTime;
      }

      return bTime - aTime;
    });
  }, [dotfiles, sortBy]);

  return (
    <section className="mb-16 border border-gray-300 p-6 dark:border-gray-700">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold">Dotfiles</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reusable prompt packs, config snippets, and implementation templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="dotfiles-home-sort" className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
            Sort
          </label>
          <select
            id="dotfiles-home-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as HomeDotfileSortOption)}
            className="border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A-Z</option>
            <option value="kind">Kind</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedDotfiles.map((dotfile) => (
          <Link
            key={dotfile.slug}
            href={`/dotfiles/${dotfile.slug}`}
            className="block border border-gray-300 p-4 transition-colors hover:bg-gray-50 no-underline dark:border-gray-700 dark:hover:bg-gray-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="mb-1 font-bold text-black dark:text-white">{dotfile.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{dotfile.description}</p>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                  by <span className="font-bold">{dotfile.author}</span> • added {new Date(dotfile.dateAdded).toLocaleDateString()}
                </p>
              </div>
              <span className="whitespace-nowrap border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">
                {dotfile.kind}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-300 pt-4 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <span>{sortedDotfiles.length} total dotfiles</span>
        <Link href="/dotfiles" className="font-bold">
          View all dotfiles
        </Link>
      </div>
    </section>
  );
}
