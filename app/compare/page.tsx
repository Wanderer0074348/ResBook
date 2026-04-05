import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTools } from "@/lib/mdx";
import { ToolComparisonClient } from "@/components/compare/ToolComparisonClient";

export const metadata: Metadata = {
  title: "Compare Tools | ResBook",
  description: "Compare up to four AI tools side by side across quality, speed, automation depth, and pricing value.",
};

export default async function ComparePage() {
  const toolsData = await getTools();
  const tools = toolsData.map((tool) => tool.frontmatter);

  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-5xl px-8 py-12">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">compare</span>
        </div>

        <div className="mb-10">
          <h1 className="mb-4 text-5xl font-bold">Compare Tools</h1>
          <p className="max-w-3xl text-gray-600 dark:text-gray-400">
            Pick up to four tools and see a side-by-side view for capability fit, quality, and value. Shareable URL state is stored in query params.
          </p>
        </div>

        {tools.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No tools available for comparison yet.</p>
        ) : (
          <Suspense
            fallback={
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading comparison tools...</p>
            }
          >
            <ToolComparisonClient tools={tools} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
