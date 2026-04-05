"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ToolFrontmatter } from "@/lib/types";
import { rankToolsForComparison } from "@/lib/toolComparison";

interface ToolComparisonClientProps {
  tools: ToolFrontmatter[];
}

const MAX_SELECTION = 4;

function parseToolsParam(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function formatPrice(value: number | null): string {
  if (value === null) {
    return "n/a";
  }

  return `$${value.toFixed(0)}/mo`;
}

export function ToolComparisonClient({ tools }: ToolComparisonClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const toolBySlug = useMemo(() => {
    const map = new Map<string, ToolFrontmatter>();
    for (const tool of tools) {
      map.set(tool.slug, tool);
    }
    return map;
  }, [tools]);

  const selectedFromQuery = useMemo(() => {
    return parseToolsParam(searchParams.get("tools"))
      .filter((slug) => toolBySlug.has(slug))
      .slice(0, MAX_SELECTION);
  }, [searchParams, toolBySlug]);

  const [searchTerm, setSearchTerm] = useState("");

  const selectedTools = useMemo(() => {
    return selectedFromQuery
      .map((slug) => toolBySlug.get(slug))
      .filter((tool): tool is ToolFrontmatter => Boolean(tool));
  }, [selectedFromQuery, toolBySlug]);

  const rankedTools = useMemo(() => rankToolsForComparison(selectedTools), [selectedTools]);

  const filteredTools = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return tools;
    }

    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(normalized) ||
        tool.description.toLowerCase().includes(normalized) ||
        tool.slug.toLowerCase().includes(normalized)
    );
  }, [tools, searchTerm]);

  const setSelection = (nextSlugs: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSlugs.length === 0) {
      params.delete("tools");
    } else {
      params.set("tools", nextSlugs.join(","));
    }

    const query = params.toString();
    const nextUrl = query.length > 0 ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const toggleTool = (slug: string) => {
    if (selectedFromQuery.includes(slug)) {
      setSelection(selectedFromQuery.filter((value) => value !== slug));
      return;
    }

    if (selectedFromQuery.length >= MAX_SELECTION) {
      return;
    }

    setSelection([...selectedFromQuery, slug]);
  };

  const bestTool = rankedTools[0];

  return (
    <>
      <section className="mb-10 border border-gray-300 p-4 dark:border-gray-700">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
            Pick 2-4 tools to compare
          </p>
          <button
            type="button"
            onClick={() => setSelection([])}
            className="text-xs text-gray-600 underline-offset-2 hover:underline dark:text-gray-400"
          >
            clear
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tool by name"
          className="mb-3 w-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
        />

        <div className="max-h-60 space-y-2 overflow-y-auto border border-gray-200 p-3 dark:border-gray-800">
          {filteredTools.map((tool) => {
            const selected = selectedFromQuery.includes(tool.slug);
            const disabled = !selected && selectedFromQuery.length >= MAX_SELECTION;

            return (
              <label
                key={tool.slug}
                className={`flex cursor-pointer items-start gap-3 rounded border px-3 py-2 text-sm ${
                  selected
                    ? "border-black bg-gray-50 dark:border-white dark:bg-gray-950"
                    : "border-gray-200 dark:border-gray-800"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => toggleTool(tool.slug)}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold">{tool.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{tool.description}</p>
                </div>
              </label>
            );
          })}
        </div>

        {selectedFromQuery.length > 0 && (
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            selected: {selectedFromQuery.length}/{MAX_SELECTION}
          </p>
        )}
      </section>

      {rankedTools.length < 2 ? (
        <section className="border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          Select at least two tools to see side-by-side comparison.
        </section>
      ) : (
        <>
          <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
            <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Current leader</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold">{bestTool.tool.title}</span>
              <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">
                score {bestTool.overallScore}/100
              </span>
              <span className="text-gray-600 dark:text-gray-400">{bestTool.tool.category}</span>
            </div>
          </section>

          <section className="hidden overflow-x-auto border border-gray-300 dark:border-gray-700 md:block">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-r border-gray-300 bg-gray-50 px-3 py-2 text-left text-xs uppercase dark:border-gray-700 dark:bg-gray-950">
                    Metric
                  </th>
                  {rankedTools.map((profile) => (
                    <th
                      key={profile.tool.slug}
                      className="border-b border-gray-300 px-3 py-2 text-left dark:border-gray-700"
                    >
                      <div className="space-y-1">
                        <Link href={`/tools/${profile.tool.slug}`} className="font-bold hover:underline">
                          {profile.tool.title}
                        </Link>
                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                          {profile.tool.category} • {profile.tool.pricing}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Overall</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.overallScore}/100
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Ease of use</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.metrics.easeOfUse}/5
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Output quality</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.metrics.outputQuality}/5
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Speed</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.metrics.speed}/5
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Automation depth</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.metrics.automationDepth}/5
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Collaboration</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.metrics.collaboration}/5
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Price value</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {profile.metrics.priceValue}/5
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Starting price</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">
                      {formatPrice(profile.startingPriceUsdMonthly)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-r border-gray-300 px-3 py-2 font-semibold dark:border-gray-700">Best for</td>
                  {rankedTools.map((profile) => (
                    <td key={profile.tool.slug} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                      {profile.bestFor.length > 0 ? profile.bestFor.join(", ") : "n/a"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-4 md:hidden">
            {rankedTools.map((profile) => (
              <article key={profile.tool.slug} className="border border-gray-300 p-4 dark:border-gray-700">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Link href={`/tools/${profile.tool.slug}`} className="font-bold hover:underline">
                    {profile.tool.title}
                  </Link>
                  <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">
                    {profile.overallScore}/100
                  </span>
                </div>
                <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                  {profile.tool.category} • {profile.tool.pricing}
                </p>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Ease</dt>
                    <dd>{profile.metrics.easeOfUse}/5</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Output</dt>
                    <dd>{profile.metrics.outputQuality}/5</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Speed</dt>
                    <dd>{profile.metrics.speed}/5</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Automation</dt>
                    <dd>{profile.metrics.automationDepth}/5</dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        </>
      )}
    </>
  );
}
