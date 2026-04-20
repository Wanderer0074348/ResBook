"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ToolFrontmatter } from "@/lib/types";
import { rankToolsForComparison } from "@/lib/toolComparison";
import { Image } from "lucide-react";

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

export function ToolComparisonClient({ tools }: ToolComparisonClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const compareRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const selectedSlugs = useMemo(
    () => parseToolsParam(searchParams.get("tools")),
    [searchParams]
  );

  const selectedTools = useMemo(() => {
    return selectedSlugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter(Boolean) as ToolFrontmatter[];
  }, [selectedSlugs, tools]);

  const availableTools = useMemo(() => {
    return tools.filter((t) => !selectedSlugs.includes(t.slug));
  }, [tools, selectedSlugs]);

  const rankings = useMemo(() => {
    return selectedTools.length > 0 ? rankToolsForComparison(selectedTools) : null;
  }, [selectedTools]);

  const toggleTool = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = parseToolsParam(params.get("tools"));

    if (current.includes(slug)) {
      params.set("tools", current.filter((s) => s !== slug).join(","));
    } else if (current.length < MAX_SELECTION) {
      params.set("tools", [...current, slug].join(","));
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleExportImage = async () => {
    if (!compareRef.current || typeof window === "undefined") return;

    setIsExporting(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(compareRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "tool-comparison.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {selectedSlugs.length < MAX_SELECTION && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  toggleTool(e.target.value);
                  e.target.value = "";
                }
              }}
              className="border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
              value=""
            >
              <option value="">Add tool to compare...</option>
              {availableTools.map((tool) => (
                <option key={tool.slug} value={tool.slug}>
                  {tool.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedTools.length > 0 && (
          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50"
          >
            <Image className="w-4 h-4" aria-hidden="true" />
            {isExporting ? "Exporting..." : "Export as Image"}
          </button>
        )}
      </div>

      {selectedTools.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select tools above to compare them side by side
          </p>
          <p className="text-sm text-gray-500">
            Compare up to {MAX_SELECTION} tools
          </p>
        </div>
      ) : (
        <div ref={compareRef} className="border border-gray-300 dark:border-gray-700">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedTools.length}, 1fr)` }}>
            <div className="border-r border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 font-bold">
              Tool
            </div>
            {selectedTools.map((tool) => (
              <div
                key={tool.slug}
                className="border-r border-b border-gray-300 p-4 dark:border-gray-700 last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <Link href={`/tools/${tool.slug}`} className="font-bold hover:underline">
                    {tool.title}
                  </Link>
                  <button
                    onClick={() => toggleTool(tool.slug)}
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="border-r border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              Description
            </div>
            {selectedTools.map((tool) => (
              <div
                key={tool.slug}
                className="border-r border-b border-gray-300 p-4 text-sm dark:border-gray-700 last:border-r-0"
              >
                {tool.description}
              </div>
            ))}

            <div className="border-r border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              Category
            </div>
            {selectedTools.map((tool) => (
              <div
                key={tool.slug}
                className="border-r border-b border-gray-300 p-4 dark:border-gray-700 last:border-r-0"
              >
                {tool.category}
              </div>
            ))}

            <div className="border-r border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              Pricing
            </div>
            {selectedTools.map((tool) => (
              <div
                key={tool.slug}
                className="border-r border-b border-gray-300 p-4 dark:border-gray-700 last:border-r-0"
              >
                {tool.pricing}
              </div>
            ))}

            {rankings && rankings.length > 0 && (
              <>
                {(["quality", "speed", "automation", "value"] as const).map((metric) => (
                  <React.Fragment key={metric}>
                    <div className="border-r border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 capitalize">
                      {metric}
                    </div>
                    {selectedTools.map((tool) => {
                      const profile = rankings.find(r => r.tool.slug === tool.slug);
                      const rank = profile ? Object.keys(rankings).indexOf(tool.slug) + 1 : null;
                      return (
                        <div
                          key={tool.slug}
                          className="border-r border-b border-gray-300 p-4 text-center dark:border-gray-700 last:border-r-0"
                        >
                          {rank != null && rank <= selectedTools.length ? (
                            <span
                              className={`inline-block px-2 py-1 text-sm ${
                                rank === 1
                                  ? "bg-green-600 text-white"
                                  : rank === 2
                                    ? "bg-yellow-500 text-white"
                                    : "bg-gray-300"
                              }`}
                            >
                              #{rank}
                            </span>
                          ) : (
                            "—"
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}